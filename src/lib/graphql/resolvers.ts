import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
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
    me: async (_: any, __: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) return null
      
      return await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' },
        include: { shifts: true }
      })
    },

    currentShift: async (_: any, __: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
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

    myShifts: async (_: any, __: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
      })

      if (!user) throw new Error('User not found')

      return await prisma.shift.findMany({
        where: { userId: user.id },
        include: { user: true, organization: true },
        orderBy: { createdAt: 'desc' }
      })
    },

    allActiveShifts: async (_: any, __: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
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

    allShifts: async (_: any, __: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
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

    dashboardStats: async (_: any, __: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
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
      
      // Debug logging
      console.log('Perimeter Check Debug:', {
        organizationId,
        userLocation: { latitude, longitude },
        orgLocation: { latitude: org.latitude, longitude: org.longitude },
        calculatedDistance: distance,
        allowedRadius: org.radiusKm,
        isWithin: distance <= org.radiusKm
      })
      
      // Add a small buffer (100 meters) for GPS accuracy issues
      const bufferKm = 0.1 // 100 meters buffer
      return distance <= (org.radiusKm + bufferKm)
    }
  },

  Mutation: {
    clockIn: async (_: any, { input }: any) => {
      console.log('ClockIn mutation called with input:', input)
      const session = await getServerSession(authOptions)
      console.log('Session:', session)
      if (!session?.user) throw new Error('Not authenticated')

      let user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
      })
      console.log('Found user:', user)

      if (!user) {
        user = await prisma.user.create({
          data: {
            auth0Id: session.user.email || '',
            email: session.user.email || '',
            name: session.user.name || undefined,
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

      // Location validation
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
          
          // Add a small buffer (100 meters) for GPS accuracy issues
          const bufferKm = 0.1 // 100 meters buffer
          
          console.log('Clock-in Location Validation:', {
            distance,
            allowedRadius: org.radiusKm,
            withBuffer: org.radiusKm + bufferKm,
            isAllowed: distance <= (org.radiusKm + bufferKm)
          })
          
          if (distance > (org.radiusKm + bufferKm)) {
            throw new Error(`Outside allowed perimeter. You are ${distance.toFixed(2)}km away from the location (allowed: ${org.radiusKm}km)`)
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

    clockOut: async (_: any, { input }: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
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

    createOrganization: async (_: any, { input }: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
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
          radiusKm: input.radiusKm || 5.0 // Increased default radius to 5km
        },
        include: { shifts: true }
      })
    },

    updateUserRole: async (_: any, { userId, role }: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const currentUser = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
      })

      if (!currentUser || currentUser.role !== 'MANAGER') {
        throw new Error('Manager access required')
      }

      return await prisma.user.update({
        where: { id: userId },
        data: { role },
        include: { shifts: true }
      })
    },

    updateOrganization: async (_: any, { id, input }: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
      })

      if (!user || user.role !== 'MANAGER') {
        throw new Error('Manager access required')
      }

      return await prisma.organization.update({
        where: { id },
        data: {
          name: input.name,
          address: input.address,
          latitude: input.latitude,
          longitude: input.longitude,
          radiusKm: input.radiusKm
        },
        include: { shifts: true }
      })
    },

    deleteOrganization: async (_: any, { id }: any) => {
      const session = await getServerSession(authOptions)
      if (!session?.user) throw new Error('Not authenticated')

      const user = await prisma.user.findUnique({
        where: { auth0Id: session.user.email || '' }
      })

      if (!user || user.role !== 'MANAGER') {
        throw new Error('Manager access required')
      }

      // Check if organization has active shifts
      const activeShifts = await prisma.shift.count({
        where: { 
          organizationId: id,
          status: 'CLOCKED_IN'
        }
      })

      if (activeShifts > 0) {
        throw new Error('Cannot delete organization with active shifts')
      }

      return await prisma.organization.delete({
        where: { id }
      })
    }
  }
}