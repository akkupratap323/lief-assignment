'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Bell, BellOff, Play, Pause, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { useGeofencing } from '@/hooks/useGeofencing'
import { GET_ORGANIZATIONS } from '@/lib/graphql/queries'
import { useToast } from '@/contexts/ToastContext'

interface GeofencingManagerProps {
  userId?: string
  onLocationUpdate?: (location: { latitude: number; longitude: number } | null) => void
  onPerimeterChange?: (isInside: boolean, organizationNames: string[]) => void
}

export default function GeofencingManager({ 
  userId, 
  onLocationUpdate, 
  onPerimeterChange 
}: GeofencingManagerProps) {
  const { data: organizationsData, loading } = useQuery(GET_ORGANIZATIONS)
  const { success, error: showError } = useToast()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [lastNotification, setLastNotification] = useState<string | null>(null)

  const organizations = organizationsData?.organizations || []

  const {
    isTracking,
    currentLocation,
    isInsidePerimeter,
    permissionGranted,
    error,
    startTracking,
    stopTracking,
    requestPermission,
    perimetersInside
  } = useGeofencing(organizations, {
    autoStart: true,
    onEnterPerimeter: (event) => {
      const message = `Entered ${event.organization.name} - Remember to clock in!`
      setLastNotification(message)
      success(message)
      
      if (onPerimeterChange) {
        const orgNames = organizations
          .filter((org: any) => perimetersInside.includes(org.id))
          .map((org: any) => org.name)
        onPerimeterChange(true, orgNames)
      }
    },
    onExitPerimeter: (event) => {
      const message = `Left ${event.organization.name} - Don't forget to clock out!`
      setLastNotification(message)
      showError(message)
      
      if (onPerimeterChange) {
        const orgNames = organizations
          .filter((org: any) => perimetersInside.includes(org.id))
          .map((org: any) => org.name)
        onPerimeterChange(orgNames.length > 0, orgNames)
      }
    }
  })

  // Update parent component with location changes
  useEffect(() => {
    if (onLocationUpdate) {
      onLocationUpdate(currentLocation)
    }
  }, [currentLocation, onLocationUpdate])

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }, [])

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')
      
      if (permission === 'granted') {
        success('Notifications enabled! You\'ll receive clock in/out reminders.')
      } else {
        showError('Notifications denied. Enable in browser settings for reminders.')
      }
    }
  }

  const handleStartTracking = async () => {
    if (permissionGranted === false) {
      const granted = await requestPermission()
      if (!granted) {
        showError('Location permission is required for automatic notifications.')
        return
      }
    }
    
    await startTracking()
    success('Location tracking started. You\'ll get automatic reminders.')
  }

  const handleStopTracking = () => {
    stopTracking()
    success('Location tracking stopped.')
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading locations...</span>
        </CardContent>
      </Card>
    )
  }

  const currentPerimeterOrgs = organizations.filter((org: any) => 
    perimetersInside.includes(org.id)
  )

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <MapPin className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Smart Location Tracking
            </CardTitle>
            <CardDescription className="text-gray-600">
              Automatic clock in/out reminders based on your location
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Section */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">Location Tracking</span>
            </div>
            <Badge variant={isTracking ? 'default' : 'secondary'}>
              {isTracking ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <Badge variant={notificationsEnabled ? 'default' : 'secondary'}>
              {notificationsEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          {currentLocation && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Current Location</span>
              </div>
              <span className="text-sm text-gray-600">
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </span>
            </div>
          )}
        </div>

        {/* Perimeter Status */}
        {isInsidePerimeter && currentPerimeterOrgs.length > 0 && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>You're inside work area:</strong>{' '}
              {currentPerimeterOrgs.map((org: any) => org.name).join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Last Notification */}
        {lastNotification && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Latest reminder:</strong> {lastNotification}
            </AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="space-y-3">
          {!isTracking ? (
            <Button 
              onClick={handleStartTracking} 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Location Tracking
            </Button>
          ) : (
            <Button 
              onClick={handleStopTracking}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <Pause className="mr-2 h-4 w-4" />
              Stop Location Tracking
            </Button>
          )}

          {!notificationsEnabled && (
            <Button 
              onClick={handleEnableNotifications}
              variant="outline"
              className="w-full"
            >
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
          )}
        </div>

        {/* Available Locations */}
        {organizations.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">Monitored Locations</h4>
            <div className="space-y-2">
              {organizations.map((org: any) => (
                <div 
                  key={org.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    perimetersInside.includes(org.id)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{org.name}</div>
                    <div className="text-xs text-gray-500">
                      Radius: {org.radiusKm}km
                    </div>
                  </div>
                  {perimetersInside.includes(org.id) && (
                    <Badge variant="default" className="bg-green-600">
                      Inside
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center pt-2">
          Location tracking helps provide automatic clock in/out reminders.
          Your location is only used for work-related notifications.
        </div>
      </CardContent>
    </Card>
  )
}