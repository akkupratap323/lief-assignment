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
import GeofencingManager from '@/components/GeofencingManager'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 p-2 sm:px-3">
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Care Worker Portal</span>
                  <span className="sm:hidden">Portal</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {userData.me.name || userData.me.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    Care Worker
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="sm:hidden w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <Button variant="ghost" onClick={() => signOut()} className="text-gray-600 hover:text-gray-900 p-2 sm:px-3">
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden text-xs">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Status Banner */}
      {isCurrentlyWorking && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="font-semibold text-green-800 text-sm sm:text-base">Currently Clocked In</span>
              <span className="text-xs sm:text-sm text-green-700 bg-white/60 px-2 sm:px-3 py-1 rounded-full">
                <span className="hidden sm:inline">at {currentShift?.organization?.name} since </span>
                <span className="sm:hidden">Since </span>
                {new Date(currentShift?.clockInTime).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6">
          <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('clock-in')}
              className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === 'clock-in'
                  ? 'border-green-500 text-green-600 bg-green-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
              } rounded-t-lg`}
            >
              <Clock className="inline mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Clock In/Out</span>
              <span className="sm:hidden">Clock</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
              } rounded-t-lg`}
            >
              <History className="inline mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">My History</span>
              <span className="sm:hidden">History</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-purple-500 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
              } rounded-t-lg`}
            >
              <User className="inline mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">My Profile</span>
              <span className="sm:hidden">Profile</span>
            </button>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Clock In/Out Tab */}
        {activeTab === 'clock-in' && (
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Welcome back,
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {userData.me.name?.split(' ')[0] || userData.me.email?.split('@')[0] || 'User'}!
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto px-4">
                {isCurrentlyWorking 
                  ? 'You are currently clocked in. Clock out when your shift ends to record your work hours.'
                  : 'Select your work location and clock in to start tracking your shift.'
                }
              </p>
            </div>

            <ClockInOut />

            {/* Smart Location Tracking */}
            <GeofencingManager
              userId={userData?.me?.id}
              onLocationUpdate={(location) => {
                // Handle location updates if needed
                console.log('Location updated:', location)
              }}
              onPerimeterChange={(isInside, organizationNames) => {
                // Handle perimeter changes if needed
                console.log('Perimeter status:', { isInside, organizationNames })
              }}
            />

            {/* Current Shift Info */}
            {isCurrentlyWorking && currentShift && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-800">Current Shift Details</CardTitle>
                      <CardDescription className="text-gray-600">Active shift information and status</CardDescription>
                    </div>
                  </div>
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
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <History className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-800">My Shift History</CardTitle>
                    <CardDescription className="text-gray-600">
                      View all your previous clock-in and clock-out records
                    </CardDescription>
                  </div>
                </div>
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
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">Total Shifts</CardTitle>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    {userShifts.length}
                  </div>
                  <p className="text-sm text-gray-600">All time record</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">Hours This Month</CardTitle>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                    {userShifts
                      .filter((shift: any) => shift.totalHours && new Date(shift.clockInTime).getMonth() === new Date().getMonth())
                      .reduce((total: number, shift: any) => total + shift.totalHours, 0)
                      .toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">Hours worked</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">Average Shift</CardTitle>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <History className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    {userShifts.length > 0 
                      ? (userShifts
                          .filter((shift: any) => shift.totalHours)
                          .reduce((total: number, shift: any) => total + shift.totalHours, 0) / 
                        userShifts.filter((shift: any) => shift.totalHours).length
                        ).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <p className="text-sm text-gray-600">Hours per shift</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-800">My Profile</CardTitle>
                    <CardDescription className="text-gray-600">
                      Your account information and preferences
                    </CardDescription>
                  </div>
                </div>
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