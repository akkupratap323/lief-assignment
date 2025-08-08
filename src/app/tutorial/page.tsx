'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, MapPin, BarChart3, ArrowLeft, Shield, Navigation, CheckCircle, PlayCircle, AlertCircle, Settings, UserCheck, Calendar, TrendingUp, Database, Smartphone, Globe, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function TutorialPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: PlayCircle },
    { id: 'getting-started', label: 'Getting Started', icon: CheckCircle },
    { id: 'manager-guide', label: 'Manager Guide', icon: Users },
    { id: 'care-worker-guide', label: 'Care Worker Guide', icon: UserCheck },
    { id: 'location-setup', label: 'Location Setup', icon: MapPin },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="responsive-container responsive-header">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  HealthShift Tutorial
                </span>
              </div>
            </div>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Tutorial Contents</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                            activeSection === item.id
                              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Complete
                    <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Application Guide
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Everything you need to know about using HealthShift to manage your healthcare workforce with intelligent location-based tracking and comprehensive analytics.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <Smartphone className="h-8 w-8 text-blue-600 mb-2" />
                      <CardTitle>Progressive Web App</CardTitle>
                      <CardDescription>
                        Install HealthShift on any device for native app-like experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Works offline when needed</li>
                        <li>• Fast loading and responsive</li>
                        <li>• Install on mobile or desktop</li>
                        <li>• Push notifications support</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <Globe className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle>Location Intelligence</CardTitle>
                      <CardDescription>
                        GPS-powered location verification and geofencing technology
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Accurate location tracking</li>
                        <li>• Configurable perimeter zones</li>
                        <li>• Real-time verification</li>
                        <li>• Anti-fraud protection</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <Database className="h-8 w-8 text-purple-600 mb-2" />
                      <CardTitle>Real-time Analytics</CardTitle>
                      <CardDescription>
                        Comprehensive workforce insights and performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Live dashboard monitoring</li>
                        <li>• Detailed time tracking</li>
                        <li>• Custom report generation</li>
                        <li>• Trend analysis tools</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <Lock className="h-8 w-8 text-red-600 mb-2" />
                      <CardTitle>Enterprise Security</CardTitle>
                      <CardDescription>
                        Bank-level security with role-based access control
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• OAuth2 authentication</li>
                        <li>• Encrypted data storage</li>
                        <li>• HIPAA compliance ready</li>
                        <li>• Audit trail logging</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                      Jump to specific sections of this tutorial to learn about the features most important to your role.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button 
                        variant="secondary" 
                        className="bg-white text-blue-600 hover:bg-gray-50"
                        onClick={() => setActiveSection('getting-started')}
                      >
                        Getting Started
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-white text-white hover:bg-white/10"
                        onClick={() => setActiveSection('manager-guide')}
                      >
                        Manager Guide
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-white text-white hover:bg-white/10"
                        onClick={() => setActiveSection('care-worker-guide')}
                      >
                        Care Worker Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Getting Started Section */}
            {activeSection === 'getting-started' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Follow these simple steps to set up your HealthShift account and start managing your healthcare workforce efficiently.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                        <CardTitle>Sign In with Google</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Create your account using Google OAuth for secure, one-click authentication.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Why Google OAuth?</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• No need to remember additional passwords</li>
                          <li>• Industry-standard security protocols</li>
                          <li>• Quick and easy setup process</li>
                          <li>• Automatic account verification</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                        <CardTitle>Choose Your Role</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Select your workspace based on your responsibilities within the organization.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-blue-800 mb-2">Manager Dashboard</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Set up location perimeters</li>
                            <li>• Monitor all staff activity</li>
                            <li>• Access analytics and reports</li>
                            <li>• Manage organizational settings</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold text-green-800 mb-2">Care Worker Portal</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Clock in and out of shifts</li>
                            <li>• View personal work history</li>
                            <li>• Add notes to shift records</li>
                            <li>• Receive location notifications</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                        <CardTitle>Enable Location Services</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Allow location access for accurate time tracking and perimeter verification.
                      </p>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-800 mb-1">Important Note</h4>
                            <p className="text-sm text-amber-700">
                              Location services are essential for the clock in/out functionality. The app only accesses your location during work-related activities and does not track you outside of scheduled shifts.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                        <CardTitle>Install as PWA (Optional)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Install HealthShift on your device for a native app-like experience.
                      </p>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">📱 On Mobile (iOS/Android)</h4>
                          <ol className="text-sm text-gray-600 space-y-1">
                            <li>1. Open HealthShift in your mobile browser</li>
                            <li>2. Look for "Add to Home Screen" option</li>
                            <li>3. Tap "Add" to install the app</li>
                            <li>4. Launch from your home screen like any other app</li>
                          </ol>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">💻 On Desktop (Chrome/Edge)</h4>
                          <ol className="text-sm text-gray-600 space-y-1">
                            <li>1. Look for the install icon in the address bar</li>
                            <li>2. Click "Install HealthShift"</li>
                            <li>3. The app will open in its own window</li>
                            <li>4. Pin to taskbar for quick access</li>
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Manager Guide Section */}
            {activeSection === 'manager-guide' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Manager Guide</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Complete guide for healthcare facility managers to set up locations, monitor staff, and analyze workforce performance.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Settings className="h-6 w-6 text-blue-600" />
                        <CardTitle>Dashboard Overview</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Your manager dashboard provides three main sections to manage your healthcare workforce:
                      </p>
                      <div className="grid gap-4">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-800">Overview & Analytics</h4>
                            <p className="text-sm text-blue-700">Real-time staff status, daily metrics, and performance charts</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <Users className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-800">Staff Management</h4>
                            <p className="text-sm text-green-700">Detailed view of all clock-in/out records and shift history</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-purple-800">Location Management</h4>
                            <p className="text-sm text-purple-700">Set up and configure location perimeters for clock-in verification</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-green-600" />
                        <CardTitle>Setting Up Locations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Configure location perimeters to ensure staff can only clock in from authorized areas:
                      </p>
                      <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold text-green-800 mb-2">Step 1: Add Organization</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Enter organization name and address</li>
                            <li>• Use "Get My Location" button for automatic coordinates</li>
                            <li>• Or manually enter latitude and longitude</li>
                            <li>• Set perimeter radius (default: 5km)</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-blue-800 mb-2">Step 2: Test Perimeter</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Have staff members test clock-in from different locations</li>
                            <li>• Adjust radius if needed for optimal coverage</li>
                            <li>• Consider building size and parking areas</li>
                            <li>• Account for GPS accuracy variations</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-semibold text-purple-800 mb-2">Best Practices</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Start with larger radius and reduce if needed</li>
                            <li>• Consider multiple locations for large facilities</li>
                            <li>• Regular monitoring and adjustment</li>
                            <li>• Clear communication with staff about boundaries</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                        <CardTitle>Analytics & Reporting</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Leverage powerful analytics to optimize your workforce management:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">Key Metrics</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Currently clocked in staff count</li>
                            <li>• Daily clock-ins and activity</li>
                            <li>• Average hours per staff member</li>
                            <li>• Weekly and monthly trends</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">Visual Reports</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Interactive charts and graphs</li>
                            <li>• Shift pattern analysis</li>
                            <li>• Peak hours identification</li>
                            <li>• Performance comparisons</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Care Worker Guide Section */}
            {activeSection === 'care-worker-guide' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Care Worker Guide</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Simple step-by-step instructions for healthcare workers to track their shifts using location-based clock in/out functionality.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-green-600" />
                        <CardTitle>Clocking In</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Start your shift by clocking in from within your workplace perimeter:
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <h4 className="font-semibold">Arrive at Work Location</h4>
                            <p className="text-sm text-gray-600">Make sure you're within the designated work area perimeter set by your manager.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <h4 className="font-semibold">Open HealthShift App</h4>
                            <p className="text-sm text-gray-600">Launch the app and navigate to the Care Worker Portal.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <h4 className="font-semibold">Tap "Clock In"</h4>
                            <p className="text-sm text-gray-600">The app will verify your location and record your start time automatically.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <h4 className="font-semibold">Add Notes (Optional)</h4>
                            <p className="text-sm text-gray-600">Include any relevant information about your shift or work assignment.</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-800">Success Confirmation</h4>
                            <p className="text-sm text-green-700">You'll receive a confirmation message when successfully clocked in, along with timestamp and location verification.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                        <CardTitle>During Your Shift</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        While you're clocked in, the app provides several helpful features:
                      </p>
                      <div className="grid gap-4">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-800">Shift Timer</h4>
                            <p className="text-sm text-blue-700">View your current shift duration and start time</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <Navigation className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-purple-800">Location Status</h4>
                            <p className="text-sm text-purple-700">Monitor your location status relative to work perimeter</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-800">Break Reminders</h4>
                            <p className="text-sm text-amber-700">Optional notifications for break times and shift duration</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-red-600" />
                        <CardTitle>Clocking Out</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        End your shift properly to ensure accurate time tracking:
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <h4 className="font-semibold">Complete Your Tasks</h4>
                            <p className="text-sm text-gray-600">Finish all assigned duties and prepare to leave the work area.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <h4 className="font-semibold">Tap "Clock Out"</h4>
                            <p className="text-sm text-gray-600">Open the app and select the clock out option while still at work.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <h4 className="font-semibold">Add Shift Summary</h4>
                            <p className="text-sm text-gray-600">Include notes about your shift completion and any handoff information.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <h4 className="font-semibold">Verify Total Hours</h4>
                            <p className="text-sm text-gray-600">Review your total shift time before final submission.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-indigo-600" />
                        <CardTitle>Viewing Your History</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Access your personal work history and shift records:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">Recent Shifts</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Last 30 days of activity</li>
                            <li>• Clock in/out timestamps</li>
                            <li>• Total hours worked</li>
                            <li>• Shift notes and comments</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">Monthly Summary</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Total hours per month</li>
                            <li>• Average shift duration</li>
                            <li>• Number of shifts worked</li>
                            <li>• Performance trends</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Location Setup Section */}
            {activeSection === 'location-setup' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Location Setup</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Detailed guide on configuring location perimeters and understanding GPS-based verification for accurate time tracking.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Navigation className="h-6 w-6 text-blue-600" />
                        <CardTitle>How Location Verification Works</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        HealthShift uses GPS technology to ensure staff can only clock in from authorized work locations:
                      </p>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">🌐 GPS Accuracy</h4>
                          <p className="text-sm text-gray-600">
                            Modern smartphones provide GPS accuracy within 3-5 meters under optimal conditions. 
                            HealthShift accounts for GPS variance and environmental factors in location verification.
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-green-800 mb-2">🎯 Perimeter Zones</h4>
                          <p className="text-sm text-gray-600">
                            Each work location has a configurable radius (geofence) that defines the acceptable 
                            area for clock-ins. Staff must be within this zone to successfully record their shifts.
                          </p>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-purple-800 mb-2">🔒 Security Features</h4>
                          <p className="text-sm text-gray-600">
                            Location spoofing protection and real-time verification prevent fraudulent clock-ins 
                            from incorrect locations or GPS manipulation attempts.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Settings className="h-6 w-6 text-green-600" />
                        <CardTitle>Configuring Perimeter Settings</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Radius Guidelines</h4>
                          <div className="grid gap-3">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <span className="font-medium text-green-800">Small Clinic</span>
                              <span className="text-sm text-green-600">0.1 - 0.5 km radius</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <span className="font-medium text-blue-800">Medium Facility</span>
                              <span className="text-sm text-blue-600">0.5 - 2.0 km radius</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                              <span className="font-medium text-purple-800">Large Hospital</span>
                              <span className="text-sm text-purple-600">2.0 - 5.0 km radius</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                              <span className="font-medium text-amber-800">Campus/Multi-Building</span>
                              <span className="text-sm text-amber-600">5.0+ km radius</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Best Practices</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>Start with a larger radius and gradually reduce based on testing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>Consider parking areas and nearby buildings in radius calculation</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>Account for GPS signal variations in different areas of the facility</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>Test clock-ins from various points around the perimeter</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>Regularly review and adjust based on staff feedback</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                        <CardTitle>Troubleshooting Location Issues</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-semibold text-red-800 mb-2">Clock-in Denied</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Check if GPS/Location services are enabled</li>
                            <li>• Move to a different area within the facility</li>
                            <li>• Wait a few moments for GPS signal to improve</li>
                            <li>• Contact manager if consistently unable to clock in</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-4">
                          <h4 className="font-semibold text-amber-800 mb-2">Inconsistent Location Detection</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• GPS accuracy can vary based on weather and building structure</li>
                            <li>• Try moving closer to windows or outdoor areas</li>
                            <li>• Ensure location permissions are set to "Always" or "While Using App"</li>
                            <li>• Restart the app if location services seem unresponsive</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-blue-800 mb-2">Battery Optimization</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Location services may be limited by battery saving modes</li>
                            <li>• Add HealthShift to battery optimization exceptions</li>
                            <li>• Ensure adequate device battery level during shifts</li>
                            <li>• Consider keeping device plugged in during long shifts</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Analytics Section */}
            {activeSection === 'analytics' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics & Reports</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Comprehensive guide to understanding and utilizing HealthShift's analytics dashboard for workforce optimization and performance insights.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                        <CardTitle>Real-time Dashboard Metrics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Monitor your workforce in real-time with these key performance indicators:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">📊 Currently Clocked In</h4>
                            <p className="text-sm text-blue-700">
                              Live count of active staff members with detailed breakdown by location and role.
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">⏰ Daily Clock-ins</h4>
                            <p className="text-sm text-green-700">
                              Total number of clock-in events for the current day with hourly distribution.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-semibold text-purple-800 mb-2">⏱️ Average Hours</h4>
                            <p className="text-sm text-purple-700">
                              Average shift duration per staff member, calculated daily and weekly.
                            </p>
                          </div>
                          <div className="p-4 bg-amber-50 rounded-lg">
                            <h4 className="font-semibold text-amber-800 mb-2">📈 Trend Analysis</h4>
                            <p className="text-sm text-amber-700">
                              Week-over-week and month-over-month comparison of workforce metrics.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                        <CardTitle>Interactive Charts & Visualizations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Visualize workforce patterns and identify optimization opportunities:
                      </p>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">📊 Daily Activity Charts</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Hourly clock-in/out patterns throughout the day</li>
                            <li>• Peak activity periods and staffing levels</li>
                            <li>• Shift overlap visualization</li>
                            <li>• Break time distribution analysis</li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">📈 Weekly Trends</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Staff hours comparison across days of the week</li>
                            <li>• Attendance patterns and consistency metrics</li>
                            <li>• Location-based activity distribution</li>
                            <li>• Individual vs. team performance trends</li>
                          </ul>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">🎯 Performance Metrics</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Average shift duration by staff member</li>
                            <li>• Clock-in accuracy and timeliness scores</li>
                            <li>• Location compliance rates</li>
                            <li>• Overtime and schedule adherence tracking</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Database className="h-6 w-6 text-green-600" />
                        <CardTitle>Data Export & Custom Reports</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Generate detailed reports for payroll, compliance, and performance analysis:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">Available Report Types</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Daily attendance summaries</li>
                            <li>• Weekly timesheet reports</li>
                            <li>• Monthly performance analytics</li>
                            <li>• Custom date range reports</li>
                            <li>• Individual staff activity logs</li>
                            <li>• Location-specific analytics</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">Export Formats</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• CSV for spreadsheet analysis</li>
                            <li>• PDF for formal reporting</li>
                            <li>• JSON for system integration</li>
                            <li>• Email delivery scheduling</li>
                            <li>• Automated report generation</li>
                            <li>• API access for custom integrations</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Schedule weekly reports for consistent monitoring</li>
                          <li>• Use custom date ranges for payroll period alignment</li>
                          <li>• Export data for integration with HR systems</li>
                          <li>• Set up automated reports for compliance documentation</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Security & Privacy</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Understanding HealthShift's comprehensive security measures, privacy protection, and compliance standards for healthcare environments.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Lock className="h-6 w-6 text-red-600" />
                        <CardTitle>Data Protection & Encryption</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        HealthShift employs enterprise-grade security measures to protect sensitive healthcare workforce data:
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                          <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-red-800">End-to-End Encryption</h4>
                            <p className="text-sm text-red-700">All data transmitted between devices and servers is encrypted using TLS 1.3 protocol</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-800">Encrypted Storage</h4>
                            <p className="text-sm text-blue-700">Database encryption at rest with AES-256 standards for all stored information</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <UserCheck className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-800">Access Control</h4>
                            <p className="text-sm text-green-700">Role-based permissions ensure users only access data relevant to their responsibilities</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-blue-600" />
                        <CardTitle>Authentication & Identity Management</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Secure user authentication and identity verification protect against unauthorized access:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">OAuth2 Integration</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Google OAuth for secure sign-in</li>
                            <li>• Industry-standard authentication protocols</li>
                            <li>• No password storage on HealthShift servers</li>
                            <li>• Automatic session management</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800">Session Security</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Secure JWT token implementation</li>
                            <li>• Automatic session timeout</li>
                            <li>• Cross-site request protection</li>
                            <li>• Device-specific session tracking</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Navigation className="h-6 w-6 text-green-600" />
                        <CardTitle>Location Privacy Protection</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        HealthShift respects user privacy while providing necessary location verification:
                      </p>
                      <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold text-green-800 mb-2">Limited Collection</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Location data collected only during clock in/out events</li>
                            <li>• No continuous location tracking</li>
                            <li>• Precise coordinates not stored, only verification status</li>
                            <li>• Automatic data retention limits</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-blue-800 mb-2">User Control</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Clear permission requests for location access</li>
                            <li>• Ability to review location usage</li>
                            <li>• Transparent data collection policies</li>
                            <li>• Opt-out options where applicable</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-800">Important Note</h4>
                            <p className="text-sm text-amber-700">
                              Location services are essential for clock in/out verification. The app only accesses location during work-related activities and never tracks personal movement outside of shift times.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-purple-600" />
                        <CardTitle>Compliance & Standards</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        HealthShift is designed to meet healthcare industry compliance requirements:
                      </p>
                      <div className="grid gap-4">
                        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-purple-800">HIPAA Compliance Ready</h4>
                            <p className="text-sm text-purple-700">Architecture designed to support HIPAA-compliant implementations for healthcare organizations</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                          <Database className="h-5 w-5 text-indigo-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-indigo-800">Audit Trail Logging</h4>
                            <p className="text-sm text-indigo-700">Comprehensive logging of all user actions for compliance auditing and security monitoring</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                          <Globe className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-teal-800">Data Residency Control</h4>
                            <p className="text-sm text-teal-700">Configurable data storage locations to meet regional compliance requirements</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Troubleshooting Section */}
            {activeSection === 'troubleshooting' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Troubleshooting</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Common issues and solutions to help you get the most out of HealthShift. Find quick fixes and detailed troubleshooting steps.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <CardTitle>Clock In/Out Issues</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-semibold text-red-800 mb-2">❌ "Location verification failed"</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Possible Causes:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>GPS signal is weak or unavailable</li>
                              <li>You're outside the designated work perimeter</li>
                              <li>Location services are disabled</li>
                              <li>App doesn't have location permissions</li>
                            </ul>
                            <p><strong>Solutions:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Move closer to windows or outdoor areas</li>
                              <li>Check that location services are enabled in device settings</li>
                              <li>Verify HealthShift has location permission</li>
                              <li>Wait 30-60 seconds for GPS to improve accuracy</li>
                              <li>Contact manager if consistently unable to clock in from work location</li>
                            </ul>
                          </div>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-4">
                          <h4 className="font-semibold text-amber-800 mb-2">⚠️ Clock in button not working</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Quick Fixes:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Refresh the page or restart the app</li>
                              <li>Check internet connection</li>
                              <li>Clear browser cache (web version)</li>
                              <li>Update the app to latest version</li>
                              <li>Try using a different browser or device</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Navigation className="h-6 w-6 text-blue-600" />
                        <CardTitle>Location & GPS Problems</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-blue-800 mb-2">🌐 Inconsistent location detection</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Environmental Factors:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Tall buildings can block GPS satellites</li>
                              <li>Indoor locations may have reduced GPS accuracy</li>
                              <li>Weather conditions can affect signal strength</li>
                              <li>Metal structures may interfere with GPS</li>
                            </ul>
                            <p><strong>Optimization Steps:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Enable high-accuracy location mode</li>
                              <li>Ensure Wi-Fi is enabled (improves location accuracy)</li>
                              <li>Allow app to use location "all the time" or "while using app"</li>
                              <li>Restart device location services if GPS seems frozen</li>
                            </ul>
                          </div>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold text-green-800 mb-2">📱 Device-Specific Settings</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>iOS Settings:</strong></p>
                              <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Settings → Privacy → Location Services → ON</li>
                                <li>Find HealthShift → While Using App</li>
                                <li>Enable Precise Location</li>
                                <li>Disable Low Power Mode during shifts</li>
                              </ul>
                            </div>
                            <div>
                              <p><strong>Android Settings:</strong></p>
                              <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Settings → Location → ON</li>
                                <li>App Permissions → HealthShift → Location → Allow</li>
                                <li>Location Accuracy → High Accuracy</li>
                                <li>Battery Optimization → Exclude HealthShift</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-purple-600" />
                        <CardTitle>Login & Authentication Issues</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-semibold text-purple-800 mb-2">🔐 Google sign-in not working</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Common Solutions:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Ensure you're using a supported browser (Chrome, Safari, Firefox)</li>
                              <li>Disable popup blockers for HealthShift domain</li>
                              <li>Clear browser cookies and cache</li>
                              <li>Try signing in with incognito/private browsing mode</li>
                              <li>Ensure your Google account is active and accessible</li>
                            </ul>
                          </div>
                        </div>
                        <div className="border-l-4 border-indigo-500 pl-4">
                          <h4 className="font-semibold text-indigo-800 mb-2">🔄 Session keeps expiring</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Troubleshooting Steps:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Check if your device date and time are correct</li>
                              <li>Avoid using multiple browser tabs with HealthShift</li>
                              <li>Don't close the app during active shifts</li>
                              <li>Ensure stable internet connection</li>
                              <li>Contact support if problem persists</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Settings className="h-6 w-6 text-green-600" />
                        <CardTitle>Performance & Loading Issues</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold text-green-800 mb-2">🐌 App loading slowly</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Performance Optimization:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Check internet connection speed and stability</li>
                              <li>Close unnecessary browser tabs or apps</li>
                              <li>Clear browser cache and stored data</li>
                              <li>Restart your device if performance is consistently poor</li>
                              <li>Update your browser to the latest version</li>
                            </ul>
                          </div>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-4">
                          <h4 className="font-semibold text-orange-800 mb-2">📱 PWA installation problems</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Installation Troubleshooting:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Ensure you're using HTTPS (secure connection)</li>
                              <li>Check if your browser supports PWA installation</li>
                              <li>Clear browser data and try installing again</li>
                              <li>Look for install icon in address bar or browser menu</li>
                              <li>Use "Add to Home Screen" option on mobile devices</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Users className="h-6 w-6 text-blue-100 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Need Additional Help?</h3>
                          <p className="text-blue-100 mb-4">
                            If you're still experiencing issues after trying these solutions, our support team is here to help.
                          </p>
                          <div className="space-y-2 text-sm text-blue-100">
                            <p>📧 <strong>Email Support:</strong> Contact your system administrator</p>
                            <p>📞 <strong>Phone Support:</strong> Available during business hours</p>
                            <p>💬 <strong>In-App Help:</strong> Use the help section in your dashboard</p>
                            <p>📋 <strong>When contacting support, please include:</strong></p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                              <li>Device type and operating system version</li>
                              <li>Browser name and version (if using web version)</li>
                              <li>Description of the issue and steps to reproduce</li>
                              <li>Any error messages you received</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}