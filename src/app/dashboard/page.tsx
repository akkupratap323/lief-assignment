'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { GET_ME, GET_ALL_ACTIVE_SHIFTS, GET_ALL_SHIFTS, GET_DASHBOARD_STATS } from '@/lib/graphql/queries'
import { Clock, Users, BarChart3, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import StatsCharts from '@/components/StatsCharts'

export default function Dashboard() {
  const { user, isLoading: authLoading } = useUser()
  const router = useRouter()
  
  const { data: userData, loading: userLoading } = useQuery(GET_ME, { skip: !user })
  const { data: activeShiftsData, loading: activeShiftsLoading } = useQuery(GET_ALL_ACTIVE_SHIFTS, { skip: !user })
  const { data: allShiftsData, loading: allShiftsLoading } = useQuery(GET_ALL_SHIFTS, { skip: !user })
  const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS, { skip: !user })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/api/auth/login')
    }
    if (userData?.me && userData.me.role !== 'MANAGER') {
      router.push('/')
    }
  }, [user, userData, authLoading, router])

  if (authLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !userData?.me || userData.me.role !== 'MANAGER') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need manager privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeShifts = activeShiftsData?.allActiveShifts || []
  const allShifts = allShiftsData?.allShifts || []
  const stats = statsData?.dashboardStats

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {userData.me.name || userData.me.email}
              </span>
              <a href="/api/auth/logout">
                <Button variant="ghost">Sign Out</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Currently Clocked In
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShifts.length}</div>
              <p className="text-xs text-muted-foreground">
                staff members on duty
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Hours/Day
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? stats.avgHoursPerDay.toFixed(1) : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                across all staff
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Clock-ins
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? stats.dailyClockIns : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                shifts started today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {stats && (
          <div className="mb-8">
            <StatsCharts stats={stats} />
          </div>
        )}

        {/* Active Shifts Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Currently Active Shifts</CardTitle>
            <CardDescription>
              Staff members who are currently clocked in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeShiftsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : activeShifts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No active shifts at the moment
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Clock In Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeShifts.map((shift: any) => {
                      const clockInTime = new Date(shift.clockInTime)
                      const now = new Date()
                      const duration = Math.floor((now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60))
                      const minutes = Math.floor(((now.getTime() - clockInTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))

                      return (
                        <TableRow key={shift.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{shift.user.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{shift.user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{shift.organization.name}</div>
                              {shift.organization.address && (
                                <div className="text-sm text-gray-500">{shift.organization.address}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {clockInTime.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {duration}h {minutes}m
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={shift.clockInNote}>
                              {shift.clockInNote || '-'}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Shifts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Shifts</CardTitle>
            <CardDescription>
              Complete history of all shift activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allShiftsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : allShifts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No shift data available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allShifts.slice(0, 50).map((shift: any) => (
                      <TableRow key={shift.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{shift.user.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{shift.user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{shift.organization.name}</div>
                            {shift.organization.address && (
                              <div className="text-sm text-gray-500">{shift.organization.address}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(shift.clockInTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {shift.clockOutTime 
                            ? new Date(shift.clockOutTime).toLocaleString() 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          {shift.totalHours 
                            ? `${shift.totalHours.toFixed(1)}h` 
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={shift.status === 'CLOCKED_IN' ? 'default' : 'secondary'}>
                            {shift.status.replace('_', ' ').toLowerCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}