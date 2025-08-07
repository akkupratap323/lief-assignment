'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ClockInOut from '@/components/ClockInOut'
import { GET_ME } from '@/lib/graphql/queries'
import { Clock, Users, BarChart } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { user, isLoading } = useUser()
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
              <a href="/api/auth/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </a>
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
                <a href="/api/auth/login">
                  <Button size="lg" className="w-full">
                    Sign In with Auth0
                  </Button>
                </a>
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

  const isManager = userData?.me?.role === 'MANAGER'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Healthcare Shift Tracker
            </h1>
            <div className="flex items-center gap-4">
              {isManager && (
                <Link href="/dashboard">
                  <Button variant="outline">Manager Dashboard</Button>
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {userData?.me?.name || userData?.me?.email}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {userData?.me?.role?.toLowerCase().replace('_', ' ')}
                </span>
              </div>
              <a href="/api/auth/logout">
                <Button variant="ghost">Sign Out</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userData?.me?.name?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-gray-600">
              Track your shifts and manage your work hours efficiently.
            </p>
          </div>

          <ClockInOut />
        </div>
      </main>
    </div>
  )
}
