'use client'

import { useEffect, useState, useRef } from 'react'
import { locationService, GeofenceEvent, Organization } from '@/lib/locationService'

interface UseGeofencingOptions {
  autoStart?: boolean
  onEnterPerimeter?: (event: GeofenceEvent) => void
  onExitPerimeter?: (event: GeofenceEvent) => void
}

export function useGeofencing(organizations: Organization[], options: UseGeofencingOptions = {}) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(locationService.getCurrentLocation())
  const [isInsidePerimeter, setIsInsidePerimeter] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const callbackRef = useRef<((event: GeofenceEvent) => void) | null>(null)

  // Create callback function
  useEffect(() => {
    callbackRef.current = (event: GeofenceEvent) => {
      if (event.type === 'enter') {
        setIsInsidePerimeter(true)
        options.onEnterPerimeter?.(event)
      } else if (event.type === 'exit') {
        setIsInsidePerimeter(false)
        options.onExitPerimeter?.(event)
      }
      setCurrentLocation(event.location)
    }
  }, [options.onEnterPerimeter, options.onExitPerimeter])

  // Set up organizations and callback
  useEffect(() => {
    locationService.setOrganizations(organizations)
    
    if (callbackRef.current) {
      locationService.addGeofenceCallback(callbackRef.current)
    }

    return () => {
      if (callbackRef.current) {
        locationService.removeGeofenceCallback(callbackRef.current)
      }
    }
  }, [organizations])

  // Auto-start if requested
  useEffect(() => {
    if (options.autoStart && organizations.length > 0) {
      startTracking()
    }
  }, [options.autoStart, organizations])

  const startTracking = async () => {
    try {
      setError(null)
      await locationService.startTracking()
      setIsTracking(true)
      setPermissionGranted(true)
      setCurrentLocation(locationService.getCurrentLocation())
      setIsInsidePerimeter(locationService.isInsideAnyPerimeter())
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start location tracking'
      setError(errorMessage)
      setIsTracking(false)
      setPermissionGranted(false)
      console.error('Error starting location tracking:', error)
    }
  }

  const stopTracking = () => {
    locationService.stopTracking()
    setIsTracking(false)
    setIsInsidePerimeter(false)
    setCurrentLocation(null)
  }

  const requestPermission = async () => {
    try {
      const granted = await locationService.requestBackgroundPermission()
      setPermissionGranted(granted)
      return granted
    } catch (error) {
      setPermissionGranted(false)
      console.error('Error requesting location permission:', error)
      return false
    }
  }

  return {
    isTracking,
    currentLocation,
    isInsidePerimeter,
    permissionGranted,
    error,
    startTracking,
    stopTracking,
    requestPermission,
    perimetersInside: locationService.getPerimetersUserIsInside()
  }
}