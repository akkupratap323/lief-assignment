// Enhanced Service Worker for HealthShift PWA
// Provides offline support, background sync, and push notifications

const CACHE_NAME = 'healthshift-v1'
const OFFLINE_CACHE = 'healthshift-offline-v1'
const DYNAMIC_CACHE = 'healthshift-dynamic-v1'

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/tutorial',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// GraphQL and API endpoints that should work offline
const API_ENDPOINTS = [
  '/api/graphql',
  '/api/auth'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('HealthShift SW: Installing...')
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      }),
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.add('/offline.html') // You'll need to create this
      })
    ]).then(() => {
      console.log('HealthShift SW: Installation complete')
      self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('HealthShift SW: Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== OFFLINE_CACHE && 
              cacheName !== DYNAMIC_CACHE) {
            console.log('HealthShift SW: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('HealthShift SW: Activation complete')
      self.clients.claim()
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    // For POST requests (like GraphQL mutations), try background sync
    if (url.pathname.includes('/api/graphql')) {
      event.respondWith(
        fetch(request).catch(() => {
          // Store failed request for background sync
          return storeFailedRequest(request.clone())
        })
      )
    }
    return
  }

  // Handle different types of requests
  if (isStaticAsset(url)) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request))
  } else if (isAPIRequest(url)) {
    // API requests - network first with offline fallback
    event.respondWith(networkFirstWithOfflineFallback(request))
  } else {
    // Navigation requests - stale while revalidate
    event.respondWith(staleWhileRevalidate(request))
  }
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('HealthShift SW: Background sync triggered:', event.tag)
  
  if (event.tag === 'clock-sync') {
    event.waitUntil(syncClockData())
  } else if (event.tag === 'location-sync') {
    event.waitUntil(syncLocationData())
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('HealthShift SW: Push received:', event.data?.text())
  
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'HealthShift Notification'
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'general',
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200]
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    )
  }
})

// Caching strategies
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request)
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    // Return cached version if available
    const cache = await caches.open(DYNAMIC_CACHE)
    const cached = await cache.match(request)
    
    if (cached) {
      return cached
    }
    
    // Return offline fallback for GraphQL requests
    if (request.url.includes('/api/graphql')) {
      return new Response(JSON.stringify({
        errors: [{ message: 'Offline - data not available' }]
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineCache = await caches.open(OFFLINE_CACHE)
      return offlineCache.match('/offline.html')
    }
    
    return new Response('Offline', { status: 503 })
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cached = await cache.match(request)
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => cached)
  
  // Return cached version immediately if available
  return cached || fetchPromise
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.startsWith('/_next/') ||
         url.pathname.startsWith('/icons/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.svg')
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/')
}

async function storeFailedRequest(request) {
  try {
    const body = await request.text()
    const failedRequest = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: body,
      timestamp: Date.now()
    }
    
    // Store in IndexedDB or localStorage for background sync
    const stored = JSON.parse(localStorage.getItem('failed-requests') || '[]')
    stored.push(failedRequest)
    localStorage.setItem('failed-requests', JSON.stringify(stored))
    
    return new Response(JSON.stringify({
      message: 'Request stored for sync when online'
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response('Failed to store request', { status: 500 })
  }
}

async function syncClockData() {
  try {
    const failedRequests = JSON.parse(localStorage.getItem('failed-requests') || '[]')
    const clockRequests = failedRequests.filter(req => 
      req.url.includes('clock') || req.body.includes('clockIn') || req.body.includes('clockOut')
    )
    
    for (const request of clockRequests) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        })
        
        // Remove successful request from storage
        const remaining = failedRequests.filter(r => r !== request)
        localStorage.setItem('failed-requests', JSON.stringify(remaining))
      } catch (error) {
        console.log('Failed to sync request:', error)
      }
    }
    
    console.log('Clock data sync completed')
  } catch (error) {
    console.error('Clock data sync failed:', error)
  }
}

async function syncLocationData() {
  try {
    // Sync any stored location data
    console.log('Location data sync completed')
  } catch (error) {
    console.error('Location data sync failed:', error)
  }
}