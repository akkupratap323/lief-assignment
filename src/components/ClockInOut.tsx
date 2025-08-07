'use client'

import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAppContext } from '@/contexts/AppContext'
import { useToast } from '@/contexts/ToastContext'
import { CLOCK_IN, CLOCK_OUT } from '@/lib/graphql/mutations'
import { GET_CURRENT_SHIFT, GET_ORGANIZATIONS, IS_WITHIN_PERIMETER } from '@/lib/graphql/queries'
import { Clock, MapPin, AlertCircle } from 'lucide-react'

interface Organization {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  radiusKm: number
}

export default function ClockInOut() {
  const { data: session } = useSession()
  const user = session?.user
  const { state } = useAppContext()
  const { success, error } = useToast()
  const [note, setNote] = useState('')
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [withinPerimeter, setWithinPerimeter] = useState<boolean | null>(null)

  const { data: currentShiftData, refetch: refetchCurrentShift } = useQuery(GET_CURRENT_SHIFT, {
    skip: !user,
  })

  const { data: organizationsData } = useQuery(GET_ORGANIZATIONS)

  const [clockInMutation, { loading: clockingIn }] = useMutation(CLOCK_IN, {
    onCompleted: (data) => {
      setNote('')
      success(`Successfully clocked in at ${data.clockIn.organization.name}!`)
      refetchCurrentShift()
    },
  })

  const [clockOutMutation, { loading: clockingOut }] = useMutation(CLOCK_OUT, {
    onCompleted: (data) => {
      setNote('')
      const totalHours = data.clockOut.totalHours ? ` Total hours: ${data.clockOut.totalHours.toFixed(1)}h` : ''
      success(`Successfully clocked out from ${data.clockOut.organization.name}!${totalHours}`)
      refetchCurrentShift()
    },
  })

  const { data: perimeterData, refetch: checkPerimeter } = useQuery(IS_WITHIN_PERIMETER, {
    variables: {
      organizationId: selectedOrgId,
      latitude: state.location.latitude,
      longitude: state.location.longitude,
    },
    skip: !selectedOrgId || !state.location.latitude || !state.location.longitude,
  })

  useEffect(() => {
    if (perimeterData) {
      setWithinPerimeter(perimeterData.isWithinPerimeter)
    }
  }, [perimeterData])

  useEffect(() => {
    if (selectedOrgId && state.location.latitude && state.location.longitude) {
      checkPerimeter()
    }
  }, [selectedOrgId, state.location.latitude, state.location.longitude, checkPerimeter])

  const handleClockIn = async () => {
    if (!selectedOrgId) {
      error('Please select an organization')
      return
    }

    if (withinPerimeter === false) {
      error('You are outside the allowed perimeter for this location. Please move closer to the workplace or contact your manager.')
      return
    }

    try {
      await clockInMutation({
        variables: {
          input: {
            organizationId: selectedOrgId,
            latitude: state.location.latitude || 0.0,
            longitude: state.location.longitude || 0.0,
            note: note.trim() || undefined,
          },
        },
      })
      // Success handled in onCompleted
    } catch (err: any) {
      console.error('Clock in error:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))
      error(`Failed to clock in: ${err.message || 'Please try again.'}`)
    }
  }

  const handleClockOut = async () => {
    if (!currentShiftData?.currentShift) {
      error('No active shift found')
      return
    }

    try {
      await clockOutMutation({
        variables: {
          input: {
            shiftId: currentShiftData.currentShift.id,
            latitude: state.location.latitude || 0.0,
            longitude: state.location.longitude || 0.0,
            note: note.trim() || undefined,
          },
        },
      })
      // Success handled in onCompleted
    } catch (err: any) {
      console.error('Clock out error:', err)
      error(`Failed to clock out: ${err.message || 'Please try again.'}`)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be signed in to clock in or out of shifts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => signIn('google')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentShift = currentShiftData?.currentShift
  const isCurrentlyWorking = currentShift?.status === 'CLOCKED_IN'
  const organizations = organizationsData?.organizations || []

  return (
    <div className="space-y-6">
      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.location.error ? (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>Location access denied: {state.location.error}</span>
            </div>
          ) : state.location.latitude && state.location.longitude ? (
            <div className="flex items-center gap-2 text-green-600">
              <MapPin className="h-4 w-4" />
              <span>
                Location detected: {state.location.latitude.toFixed(4)}, {state.location.longitude.toFixed(4)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>Detecting location...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Shift Status */}
      {isCurrentlyWorking && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Shift
              <Badge variant="secondary">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{currentShift.organization.name}</p>
              <p className="text-sm text-muted-foreground">{currentShift.organization.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Clocked in at:</p>
              <p className="text-sm text-muted-foreground">
                {new Date(currentShift.clockInTime).toLocaleString()}
              </p>
            </div>
            {currentShift.clockInNote && (
              <div>
                <p className="text-sm font-medium">Note:</p>
                <p className="text-sm text-muted-foreground">{currentShift.clockInNote}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Clock In/Out Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {isCurrentlyWorking ? 'Clock Out' : 'Clock In'}
          </CardTitle>
          <CardDescription>
            {isCurrentlyWorking 
              ? 'End your current shift' 
              : 'Start a new shift at your workplace'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCurrentlyWorking && (
            <div className="space-y-2">
              <Label htmlFor="organization">Select Organization</Label>
              <select
                id="organization"
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a workplace...</option>
                {organizations.map((org: Organization) => (
                  <option key={org.id} value={org.id}>
                    {org.name} - {org.address}
                  </option>
                ))}
              </select>
              
              {selectedOrgId && state.location.latitude && state.location.longitude && (
                <div className="mt-2 space-y-1">
                  {withinPerimeter === null ? (
                    <div className="flex items-center gap-2 text-yellow-600 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      Checking location...
                    </div>
                  ) : withinPerimeter ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Within allowed area
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Outside allowed perimeter
                      </div>
                      <div className="text-xs text-gray-500 ml-4">
                        Your location: {state.location.latitude.toFixed(4)}, {state.location.longitude.toFixed(4)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Input
              id="note"
              type="text"
              placeholder="Add a note about your shift..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
            />
          </div>

          <Button
            onClick={isCurrentlyWorking ? handleClockOut : handleClockIn}
            disabled={
              clockingIn || 
              clockingOut || 
              (!isCurrentlyWorking && (!selectedOrgId || withinPerimeter === false))
            }
            className="w-full"
            variant={isCurrentlyWorking ? "destructive" : "default"}
          >
            {clockingIn || clockingOut ? (
              'Processing...'
            ) : isCurrentlyWorking ? (
              'Clock Out'
            ) : (
              'Clock In'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}