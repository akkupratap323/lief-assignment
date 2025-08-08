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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  HealthShift
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => signIn('google')} className="text-sm sm:text-base px-3 sm:px-4">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Healthcare Workforce
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                Streamline your healthcare team management with intelligent location-based shift tracking, 
                real-time analytics, and seamless workflow automation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
              <Button 
                size="lg" 
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto" 
                onClick={() => signIn('google')}
              >
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Get Started Free
              </Button>
              <Link href="/tutorial" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-2 w-full">
                  <BarChart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Tutorial
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">5min</div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage your team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for healthcare organizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Smart Clock In/Out</CardTitle>
                <CardDescription className="text-gray-600">
                  GPS-verified location tracking with intelligent perimeter checking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Real-time GPS verification
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Customizable geofences
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Shift notes and comments
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Team Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete oversight and control of your healthcare workforce
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Live activity monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Role-based permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Shift history tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Analytics & Insights</CardTitle>
                <CardDescription className="text-gray-600">
                  Data-driven insights to optimize your workforce efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Performance metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Custom reports
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Trend analysis
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <Card className="max-w-4xl mx-auto border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Transform Your Healthcare Team Management?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of healthcare organizations already using HealthShift to streamline their operations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50" onClick={() => signIn('google')}>
                  Start Free Trial
                </Button>
                <Link href="/tutorial">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-blue-200 mt-6">
                No credit card required • Setup in 5 minutes • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 py-8">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-800">HealthShift</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2024 HealthShift. Streamlining healthcare workforce management.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HealthShift
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {userData?.me?.name || userData?.me?.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userData?.me?.role?.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <Button variant="ghost" onClick={() => signOut()} className="text-gray-600 hover:text-gray-900">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Welcome Section */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome back,
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {userData?.me?.name?.split(' ')[0] || 'User'}!
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose your workspace to access powerful tools designed for healthcare workforce management
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Manager Card - Show for all users but indicate access level */}
            <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm cursor-pointer group hover:-translate-y-1 ${
              userData?.me?.role !== 'MANAGER' ? 'opacity-75' : ''
            }`} onClick={() => window.location.href = '/manager'}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-center">
                  Manager Dashboard
                  {userData?.me?.role !== 'MANAGER' && (
                    <div className="text-xs font-normal text-amber-600 mt-1">Manager Access Required</div>
                  )}
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-base">
                  Complete workforce management and analytics platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-600 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Configure location perimeters and geofences</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Monitor real-time staff activity and status</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Access detailed records and time tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span>Generate comprehensive analytics and reports</span>
                  </div>
                </div>
                <Button className={`w-full py-3 text-base ${
                  userData?.me?.role === 'MANAGER'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                }`}>
                  {userData?.me?.role === 'MANAGER' ? 'Access Manager Dashboard' : 'Manager Access Required'}
                </Button>
              </CardContent>
            </Card>

            {/* Care Worker Card */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm cursor-pointer group hover:-translate-y-1" onClick={() => window.location.href = '/care-worker'}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-center">
                  Care Worker Portal
                  {userData?.me?.role === 'MANAGER' && (
                    <div className="text-xs font-normal text-blue-600 mt-1">Also Available to Managers</div>
                  )}
                </CardTitle>
                <CardDescription className="text-center text-gray-600 text-base">
                  Streamlined shift management and time tracking
                  {userData?.me?.role === 'MANAGER' && (
                    <span className="block text-blue-600 text-sm mt-1">Experience the care worker interface</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-600 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Location-verified clock in and clock out</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Add notes and comments to your shifts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>View your personal work history and records</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>Receive smart location-based notifications</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 text-base">
                  Access Care Worker Portal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-16">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need help getting started?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tutorial">
                  <Button variant="outline" className="px-6 py-2">
                    <BarChart className="mr-2 h-4 w-4" />
                    View Tutorial
                  </Button>
                </Link>
                <Link href="/tutorial">
                  <Button variant="ghost" className="px-6 py-2 text-gray-600">
                    <BarChart className="mr-2 h-4 w-4" />
                    Tutorial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
