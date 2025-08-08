// Service Worker utilities for enhanced PWA features

interface SyncData {
  type: 'CLOCK_IN' | 'CLOCK_OUT' | 'SHIFT_UPDATE'
  data: any
  timestamp: number
}

// Register service worker with enhanced features
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      console.log('Service Worker registered:', registration)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, prompt user to refresh
              if (confirm('New version available! Refresh to update?')) {
                window.location.reload()
              }
            }
          })
        }
      })
      
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }
  return null
}

// Background sync for offline actions
export const scheduleBackgroundSync = async (tag: string, data: SyncData) => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready
      
      // Store data for background sync
      const syncData = {
        ...data,
        id: Date.now().toString(),
        retryCount: 0
      }
      
      localStorage.setItem(`sync_${tag}_${syncData.id}`, JSON.stringify(syncData))
      
      // Schedule background sync (if supported)
      await (registration as any).sync?.register(tag)
      
      console.log('Background sync scheduled:', tag)
      return syncData.id
    } catch (error) {
      console.error('Background sync failed:', error)
      return null
    }
  }
  return null
}

// Push notification subscription
export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ) as BufferSource
      })
      
      console.log('Push subscription created:', subscription)
      return subscription
    } catch (error) {
      console.error('Push subscription failed:', error)
      return null
    }
  }
  return null
}

// Helper function for VAPID key conversion
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Check if app is running as installed PWA
export const isPWAInstalled = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

// Get PWA display mode
export const getPWADisplayMode = (): string => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone'
  }
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen'
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui'
  }
  return 'browser'
}

// Cache management
export const clearOldCaches = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    const oldCaches = cacheNames.filter(name => 
      !name.includes(getCurrentCacheVersion())
    )
    
    await Promise.all(
      oldCaches.map(cacheName => caches.delete(cacheName))
    )
    
    console.log('Old caches cleared:', oldCaches)
  }
}

// Get current cache version (you should update this when deploying)
const getCurrentCacheVersion = (): string => {
  return 'v1' // Update this when you want to force cache refresh
}

// Offline status detection
export const setupOfflineDetection = (
  onOnline: () => void,
  onOffline: () => void
) => {
  const handleOnline = () => {
    console.log('App is online')
    onOnline()
  }
  
  const handleOffline = () => {
    console.log('App is offline')
    onOffline()
  }
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Cleanup function
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

// Install app prompt
export const showInstallPrompt = (deferredPrompt: any) => {
  return new Promise<boolean>((resolve) => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: any) => {
        resolve(choiceResult.outcome === 'accepted')
        deferredPrompt = null
      })
    } else {
      resolve(false)
    }
  })
}