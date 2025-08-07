'use client'

import { useSession, signOut } from 'next-auth/react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import ClockInOut from '@/components/ClockInOut'
import { GET_ME, GET_CURRENT_SHIFT, GET_MY_SHIFTS } from '@/lib/graphql/queries'
import { Clock, History, ArrowLeft, User, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function CareWorkerPortal() {
  const { data: session, status } = useSession()
  const user = session?.user
  const authLoading = status === 'loading'
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('clock-in')

  const { data: userData, loading: userLoading } = useQuery(GET_ME, { skip: !user })
  const { data: currentShiftData } = useQuery(GET_CURRENT_SHIFT, { skip: !user })
  const { data: myShiftsData } = useQuery(GET_MY_SHIFTS, { skip: !user })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/api/auth/signin')
    }
  }, [authLoading, user, router])

  // Get user's shift history from the dedicated query
  const userShifts = myShiftsData?.myShifts || []

  if (authLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading Care Worker Portal...</p>
        </div>
      </div>
    )
  }

  if (!userData?.me) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Required</CardTitle>
            <CardDescription>
              Please sign in to access the Care Worker Portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/api/auth/signin">
              <Button className="w-full">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentShift = currentShiftData?.currentShift
  const isCurrentlyWorking = currentShift?.status === 'CLOCKED_IN'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Care Worker Portal
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {userData.me.name || userData.me.email}
                </span>
                <Badge variant="secondary">
                  Care Worker
                </Badge>
              </div>
              <Button variant="ghost" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Status Banner */}
      {isCurrentlyWorking && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Currently Clocked In</span>
              <span className="text-sm">
                at {currentShift?.organization?.name} since{' '}
                {new Date(currentShift?.clockInTime).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('clock-in')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'clock-in'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock className="inline mr-2 h-4 w-4" />
              Clock In/Out
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History className="inline mr-2 h-4 w-4" />
              My History
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="inline mr-2 h-4 w-4" />
              My Profile
            </button>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Clock In/Out Tab */}
        {activeTab === 'clock-in' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {userData.me.name?.split(' ')[0] || 'User'}!
              </h2>
              <p className="text-gray-600">
                {isCurrentlyWorking 
                  ? 'You are currently clocked in. Clock out when your shift ends.'
                  : 'Select your location and clock in to start your shift.'
                }
              </p>
            </div>

            <ClockInOut />

            {/* Current Shift Info */}
            {isCurrentlyWorking && currentShift && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Current Shift Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Location:</span>
                      <p>{currentShift.organization.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Clock In Time:</span>
                      <p>{new Date(currentShift.clockInTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Duration:</span>
                      <p>
                        {Math.round((Date.now() - new Date(currentShift.clockInTime).getTime()) / (1000 * 60))} minutes
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Status:</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                  {currentShift.clockInNote && (
                    <div>
                      <span className="font-medium text-gray-500">Clock In Note:</span>
                      <p className="text-sm text-gray-700 mt-1">{currentShift.clockInNote}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Shift History</CardTitle>
                <CardDescription>
                  View all your previous clock-in and clock-out records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userShifts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>No shift history found</p>
                    <p className="text-sm">Your shifts will appear here after you clock in</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Clock In</TableHead>
                        <TableHead>Clock Out</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userShifts.map((shift: any) => (
                        <TableRow key={shift.id}>
                          <TableCell className="font-medium">
                            {shift.organization.name}
                          </TableCell>
                          <TableCell>
                            {new Date(shift.clockInTime).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(shift.clockInTime).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            {shift.clockOutTime 
                              ? new Date(shift.clockOutTime).toLocaleTimeString()
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {shift.totalHours 
                              ? `${shift.totalHours.toFixed(2)}h`
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={shift.status === 'CLOCKED_IN' ? 'default' : 'secondary'}
                            >
                              {shift.status === 'CLOCKED_IN' ? 'Active' : 'Completed'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Shifts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {userShifts.length}
                  </div>
                  <p className="text-sm text-gray-500">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Hours This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {userShifts
                      .filter((shift: any) => shift.totalHours && new Date(shift.clockInTime).getMonth() === new Date().getMonth())
                      .reduce((total: number, shift: any) => total + shift.totalHours, 0)
                      .toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-500">Hours worked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Shift</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {userShifts.length > 0 
                      ? (userShifts
                          .filter((shift: any) => shift.totalHours)
                          .reduce((total: number, shift: any) => total + shift.totalHours, 0) / 
                        userShifts.filter((shift: any) => shift.totalHours).length
                        ).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <p className="text-sm text-gray-500">Hours per shift</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  My Profile
                </CardTitle>
                <CardDescription>
                  Your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg">{userData.me.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{userData.me.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <Badge variant="secondary" className="text-sm">
                      {userData.me.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-lg">
                      {new Date(userData.me.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-3">Preferences</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Location-based clock-in validation enabled
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Shift notifications enabled
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Optional notes allowed for clock-ins
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}