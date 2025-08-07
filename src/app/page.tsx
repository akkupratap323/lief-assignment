'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ClockInOut from '@/components/ClockInOut'
import { GET_ME } from '@/lib/graphql/queries'
import { Clock, Users, BarChart } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const user = session?.user
  const isLoading = status === 'loading'
  const { data: userData } = useQuery(GET_ME, { skip: !user })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Healthcare Shift Tracker
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your healthcare workforce management with location-based shift tracking
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => signIn('google')}>
                Get Started
              </Button>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div id="features" className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Smart Clock In/Out
                </CardTitle>
                <CardDescription>
                  Location-based shift tracking with perimeter checking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• GPS-verified clock in/out</li>
                  <li>• Configurable location perimeters</li>
                  <li>• Optional notes for shifts</li>
                  <li>• Real-time status updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Management
                </CardTitle>
                <CardDescription>
                  Complete oversight of your healthcare team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• View all active shifts</li>
                  <li>• Staff shift history</li>
                  <li>• Role-based access control</li>
                  <li>• Real-time notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  Insights into your workforce patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Average hours per day</li>
                  <li>• Daily clock-in statistics</li>
                  <li>• Weekly hours by staff</li>
                  <li>• Comprehensive reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Ready to Get Started?</CardTitle>
                <CardDescription>
                  Join healthcare organizations using our platform to manage shifts efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="w-full" onClick={() => signIn('google')}>
                  Sign In with Google
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Secure authentication with Google and email login options
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Healthcare Shift Tracker
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {userData?.me?.name || userData?.me?.email}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {userData?.me?.role?.toLowerCase().replace('_', ' ')}
                </span>
              </div>
              <Button variant="ghost" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome, {userData?.me?.name?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose your workspace to get started
            </p>
          </div>


          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Manager Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/manager'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 justify-center text-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                  Manager Dashboard
                </CardTitle>
                <CardDescription className="text-center">
                  Manage staff, set locations, and view analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Set location perimeter (geofence) for clock-ins
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    View who is currently clocked in
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    See detailed clock-in/out records
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Access analytics and reports
                  </div>
                </div>
                <Button className="w-full mt-6">
                  Access Manager Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Care Worker Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/care-worker'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 justify-center text-xl">
                  <Clock className="h-6 w-6 text-green-600" />
                  Care Worker Portal
                </CardTitle>
                <CardDescription className="text-center">
                  Clock in/out and manage your shifts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Clock in and out within allowed perimeter
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Provide optional notes when clocking
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    View your own clock-in/out history
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Get location-based notifications
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Access Care Worker Portal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
