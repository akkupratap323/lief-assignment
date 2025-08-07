interface Location {
  latitude: number
  longitude: number
}

interface Organization {
  id: string
  name: string
  latitude: number
  longitude: number
  radiusKm: number
}

interface GeofenceEvent {
  type: 'enter' | 'exit'
  organization: Organization
  location: Location
  timestamp: Date
}

type GeofenceCallback = (event: GeofenceEvent) => void

class LocationService {
  private watchId: number | null = null
  private organizations: Organization[] = []
  private currentLocation: Location | null = null
  private userInsidePerimeters: Set<string> = new Set()
  private callbacks: GeofenceCallback[] = []
  private isTracking = false
  private lastNotificationTime: { [key: string]: number } = {}
  private readonly NOTIFICATION_COOLDOWN = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.requestNotificationPermission()
  }

  private async requestNotificationPermission() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
      }
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private checkGeofences(location: Location) {
    const now = Date.now()
    
    for (const org of this.organizations) {
      const distance = this.calculateDistance(
        location.latitude, location.longitude,
        org.latitude, org.longitude
      )
      
      const isInside = distance <= org.radiusKm
      const wasInside = this.userInsidePerimeters.has(org.id)
      const lastNotification = this.lastNotificationTime[org.id] || 0
      const canNotify = now - lastNotification > this.NOTIFICATION_COOLDOWN

      if (isInside && !wasInside && canNotify) {
        // User entered perimeter
        this.userInsidePerimeters.add(org.id)
        this.lastNotificationTime[org.id] = now
        
        const event: GeofenceEvent = {
          type: 'enter',
          organization: org,
          location,
          timestamp: new Date()
        }
        
        this.notifyCallbacks(event)
        this.showNotification('Clock In Reminder', 
          `You've entered ${org.name}. Remember to clock in!`, 
          'clock-in'
        )
        
      } else if (!isInside && wasInside && canNotify) {
        // User exited perimeter
        this.userInsidePerimeters.delete(org.id)
        this.lastNotificationTime[org.id] = now
        
        const event: GeofenceEvent = {
          type: 'exit',
          organization: org,
          location,
          timestamp: new Date()
        }
        
        this.notifyCallbacks(event)
        this.showNotification('Clock Out Reminder', 
          `You've left ${org.name}. Don't forget to clock out!`, 
          'clock-out'
        )
      }
    }
  }

  private notifyCallbacks(event: GeofenceEvent) {
    this.callbacks.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('Error in geofence callback:', error)
      }
    })
  }

  private async showNotification(title: string, body: string, tag: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        // Try to use service worker registration for better support
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready
          if (registration.showNotification) {
            await registration.showNotification(title, {
              body,
              tag,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-72x72.png',
              vibrate: [200, 100, 200],
              requireInteraction: true,
              actions: [
                {
                  action: 'open-app',
                  title: 'Open HealthShift',
                  icon: '/icons/icon-72x72.png'
                },
                {
                  action: 'dismiss',
                  title: 'Dismiss'
                }
              ],
              data: {
                url: '/care-worker',
                timestamp: Date.now()
              }
            })
            return
          }
        }

        // Fallback to regular notification
        const notification = new Notification(title, {
          body,
          tag,
          icon: '/icons/icon-192x192.png',
          vibrate: [200, 100, 200],
          requireInteraction: true
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
          // Navigate to care worker page
          if (window.location.pathname !== '/care-worker') {
            window.location.href = '/care-worker'
          }
        }

        // Auto-close after 10 seconds
        setTimeout(() => {
          notification.close()
        }, 10000)

      } catch (error) {
        console.error('Error showing notification:', error)
      }
    }
  }

  public setOrganizations(organizations: Organization[]) {
    this.organizations = organizations
  }

  public addGeofenceCallback(callback: GeofenceCallback) {
    this.callbacks.push(callback)
  }

  public removeGeofenceCallback(callback: GeofenceCallback) {
    const index = this.callbacks.indexOf(callback)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }

  public startTracking(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isTracking) {
        resolve()
        return
      }

      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 30000 // 30 seconds cache
      }

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          
          this.currentLocation = location
          this.checkGeofences(location)
          
          if (!this.isTracking) {
            this.isTracking = true
            resolve()
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
          if (!this.isTracking) {
            reject(error)
          }
        },
        options
      )
    })
  }

  public stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
    this.isTracking = false
    this.userInsidePerimeters.clear()
  }

  public getCurrentLocation(): Location | null {
    return this.currentLocation
  }

  public isInsideAnyPerimeter(): boolean {
    return this.userInsidePerimeters.size > 0
  }

  public getPerimetersUserIsInside(): string[] {
    return Array.from(this.userInsidePerimeters)
  }

  // Request persistent permission for background location
  public async requestBackgroundPermission(): Promise<boolean> {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        if (result.state === 'granted') {
          return true
        }
      } catch (error) {
        console.error('Error checking permissions:', error)
      }
    }
    
    // Fallback - request location to prompt user
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  // For PWA installation prompt
  public async requestPWAInstall() {
    // This will be called from a component that has access to the beforeinstallprompt event
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
        return true
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return false
      }
    }
    return false
  }
}

export const locationService = new LocationService()
export type { Location, Organization, GeofenceEvent, GeofenceCallback }