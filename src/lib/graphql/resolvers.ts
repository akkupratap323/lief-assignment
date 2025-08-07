import { prisma } from '@/lib/prisma'
import { getSession } from '@auth0/nextjs-auth0'
import { GraphQLScalarType, Kind } from 'graphql'

const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value: any) {
    return value instanceof Date ? value.toISOString() : value
  },
  parseValue(value: any) {
    return new Date(value)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  },
})

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const resolvers = {
  DateTime: dateTimeScalar,
  
  Query: {
    me: async (_: any, __: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) return null
      
      return await prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
        include: { shifts: true }
      })
    },

    currentShift: async (_: any, __: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!user) throw new Error('User not found')

      return await prisma.shift.findFirst({
        where: { 
          userId: user.id, 
          status: 'CLOCKED_IN' 
        },
        include: { user: true, organization: true }
      })
    },

    myShifts: async (_: any, __: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!user) throw new Error('User not found')

      return await prisma.shift.findMany({
        where: { userId: user.id },
        include: { user: true, organization: true },
        orderBy: { createdAt: 'desc' }
      })
    },

    allActiveShifts: async (_: any, __: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!user || user.role !== 'MANAGER') {
        throw new Error('Manager access required')
      }

      return await prisma.shift.findMany({
        where: { status: 'CLOCKED_IN' },
        include: { user: true, organization: true },
        orderBy: { clockInTime: 'desc' }
      })
    },

    allShifts: async (_: any, __: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!user || user.role !== 'MANAGER') {
        throw new Error('Manager access required')
      }

      return await prisma.shift.findMany({
        include: { user: true, organization: true },
        orderBy: { createdAt: 'desc' }
      })
    },

    organizations: async () => {
      return await prisma.organization.findMany({
        include: { shifts: true }
      })
    },

    organization: async (_: any, { id }: { id: string }) => {
      return await prisma.organization.findUnique({
        where: { id },
        include: { shifts: true }
      })
    },

    dashboardStats: async (_: any, __: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!user || user.role !== 'MANAGER') {
        throw new Error('Manager access required')
      }

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const shifts = await prisma.shift.findMany({
        where: {
          clockInTime: { gte: weekAgo },
          status: 'CLOCKED_OUT'
        },
        include: { user: true }
      })

      const todayShifts = await prisma.shift.count({
        where: {
          clockInTime: { gte: today }
        }
      })

      const avgHours = shifts.reduce((sum, shift) => sum + (shift.totalHours || 0), 0) / Math.max(shifts.length, 1)
      
      const weeklyHours = shifts.reduce((acc: any, shift) => {
        const existing = acc.find((item: any) => item.userId === shift.userId)
        if (existing) {
          existing.totalHours += shift.totalHours || 0
        } else {
          acc.push({
            userId: shift.userId,
            userName: shift.user.name || shift.user.email,
            totalHours: shift.totalHours || 0
          })
        }
        return acc
      }, [])

      return {
        avgHoursPerDay: avgHours,
        dailyClockIns: todayShifts,
        weeklyHoursByStaff: weeklyHours
      }
    },

    isWithinPerimeter: async (_: any, { organizationId, latitude, longitude }: any) => {
      const org = await prisma.organization.findUnique({
        where: { id: organizationId }
      })

      if (!org) return false

      const distance = calculateDistance(latitude, longitude, org.latitude, org.longitude)
      return distance <= org.radiusKm
    }
  },

  Mutation: {
    clockIn: async (_: any, { input }: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      let user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            auth0Id: session.user.sub,
            email: session.user.email,
            name: session.user.name,
            role: 'CARE_WORKER'
          }
        })
      }

      const existingShift = await prisma.shift.findFirst({
        where: { 
          userId: user.id, 
          status: 'CLOCKED_IN' 
        }
      })

      if (existingShift) {
        throw new Error('Already clocked in')
      }

      if (input.latitude && input.longitude) {
        const org = await prisma.organization.findUnique({
          where: { id: input.organizationId }
        })

        if (org) {
          const distance = calculateDistance(
            input.latitude, 
            input.longitude, 
            org.latitude, 
            org.longitude
          )

          if (distance > org.radiusKm) {
            throw new Error('Outside allowed perimeter')
          }
        }
      }

      const shift = await prisma.shift.create({
        data: {
          userId: user.id,
          organizationId: input.organizationId,
          clockInTime: new Date(),
          clockInLat: input.latitude,
          clockInLng: input.longitude,
          clockInNote: input.note,
          status: 'CLOCKED_IN'
        },
        include: { user: true, organization: true }
      })

      return shift
    },

    clockOut: async (_: any, { input }: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!user) throw new Error('User not found')

      const shift = await prisma.shift.findFirst({
        where: { 
          id: input.shiftId,
          userId: user.id,
          status: 'CLOCKED_IN'
        }
      })

      if (!shift) {
        throw new Error('No active shift found')
      }

      const clockOutTime = new Date()
      const totalHours = (clockOutTime.getTime() - shift.clockInTime.getTime()) / (1000 * 60 * 60)

      const updatedShift = await prisma.shift.update({
        where: { id: shift.id },
        data: {
          status: 'CLOCKED_OUT',
          clockOutTime,
          clockOutLat: input.latitude,
          clockOutLng: input.longitude,
          clockOutNote: input.note,
          totalHours
        },
        include: { user: true, organization: true }
      })

      return updatedShift
    },

    createOrganization: async (_: any, { input }: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!user || user.role !== 'MANAGER') {
        throw new Error('Manager access required')
      }

      return await prisma.organization.create({
        data: {
          name: input.name,
          address: input.address,
          latitude: input.latitude,
          longitude: input.longitude,
          radiusKm: input.radiusKm || 2.0
        },
        include: { shifts: true }
      })
    },

    updateUserRole: async (_: any, { userId, role }: any, { req, res }: any) => {
      const session = await getSession(req, res)
      if (!session?.user) throw new Error('Not authenticated')

      const currentUser = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub }
      })

      if (!currentUser || currentUser.role !== 'MANAGER') {
        throw new Error('Manager access required')
      }

      return await prisma.user.update({
        where: { id: userId },
        data: { role },
        include: { shifts: true }
      })
    }
  }
}