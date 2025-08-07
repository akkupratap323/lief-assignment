'use client'

import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAppContext } from '@/contexts/AppContext'
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
  const { user } = useUser()
  const { state } = useAppContext()
  const [note, setNote] = useState('')
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [withinPerimeter, setWithinPerimeter] = useState<boolean | null>(null)

  const { data: currentShiftData, refetch: refetchCurrentShift } = useQuery(GET_CURRENT_SHIFT, {
    skip: !user,
  })

  const { data: organizationsData } = useQuery(GET_ORGANIZATIONS)

  const [clockInMutation, { loading: clockingIn }] = useMutation(CLOCK_IN, {
    onCompleted: () => {
      setNote('')
      refetchCurrentShift()
    },
  })

  const [clockOutMutation, { loading: clockingOut }] = useMutation(CLOCK_OUT, {
    onCompleted: () => {
      setNote('')
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
    if (!selectedOrgId || !state.location.latitude || !state.location.longitude) {
      alert('Please select an organization and enable location access')
      return
    }

    if (withinPerimeter === false) {
      alert('You are outside the allowed perimeter for this location')
      return
    }

    try {
      await clockInMutation({
        variables: {
          input: {
            organizationId: selectedOrgId,
            latitude: state.location.latitude,
            longitude: state.location.longitude,
            note: note.trim() || undefined,
          },
        },
      })
      alert('Successfully clocked in!')
    } catch (error) {
      console.error('Clock in error:', error)
      alert('Failed to clock in. Please try again.')
    }
  }

  const handleClockOut = async () => {
    if (!currentShiftData?.currentShift) {
      alert('No active shift found')
      return
    }

    try {
      await clockOutMutation({
        variables: {
          input: {
            shiftId: currentShiftData.currentShift.id,
            latitude: state.location.latitude,
            longitude: state.location.longitude,
            note: note.trim() || undefined,
          },
        },
      })
      alert('Successfully clocked out!')
    } catch (error) {
      console.error('Clock out error:', error)
      alert('Failed to clock out. Please try again.')
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
            <a href="/api/auth/login">
              <Button className="w-full">Sign In</Button>
            </a>
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
                <div className="mt-2">
                  {withinPerimeter === null ? (
                    <div className="text-sm text-gray-500">Checking location perimeter...</div>
                  ) : withinPerimeter ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Within allowed area
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Outside allowed area - cannot clock in
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
              (!isCurrentlyWorking && (!selectedOrgId || withinPerimeter === false)) ||
              !state.location.latitude ||
              !state.location.longitude
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