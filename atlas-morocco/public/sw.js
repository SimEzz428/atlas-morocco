// Enhanced Service Worker for Atlas Morocco
const CACHE_NAME = 'atlas-morocco-v2';
const STATIC_CACHE_NAME = 'atlas-morocco-static-v2';
const DYNAMIC_CACHE_NAME = 'atlas-morocco-dynamic-v2';
const IMAGE_CACHE_NAME = 'atlas-morocco-images-v2';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/cities',
  '/plan',
  '/favorites',
  '/explore',
  '/auth/signin',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
];

// API routes to cache with network-first strategy
const API_ROUTES = [
  '/api/cities',
  '/api/signals/weather',
  '/api/signals/fx',
  '/api/unsplash',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        console.log('Image cache ready');
        return cache;
      })
    ]).then(() => {
      console.log('Static assets cached successfully');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Error caching static assets:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    // Cache first for static assets
    event.respondWith(cacheFirst(request));
  } else if (isImageRequest(request)) {
    // Cache first for images with long TTL
    event.respondWith(cacheFirstWithTTL(request, 24 * 60 * 60 * 1000)); // 24 hours
  } else if (isApiRoute(request)) {
    // Network first for API routes with short TTL
    event.respondWith(networkFirstWithTTL(request, 5 * 60 * 1000)); // 5 minutes
  } else if (isPageRequest(request)) {
    // Stale while revalidate for pages
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Network first for other requests
    event.respondWith(networkFirst(request));
  }
});

// Cache first strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response(JSON.stringify({ error: 'Offline', images: [] }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline', images: [] }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network first with TTL
async function networkFirstWithTTL(request, ttl) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const responseWithTTL = networkResponse.clone();
      responseWithTTL.headers.set('sw-cache-timestamp', Date.now().toString());
      responseWithTTL.headers.set('sw-cache-ttl', ttl.toString());
      cache.put(request, responseWithTTL);
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, checking cache TTL:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      const timestamp = cachedResponse.headers.get('sw-cache-timestamp');
      const ttl = cachedResponse.headers.get('sw-cache-ttl');
      
      if (timestamp && ttl) {
        const age = Date.now() - parseInt(timestamp);
        if (age < parseInt(ttl)) {
          return cachedResponse;
        }
      }
    }
    return new Response(JSON.stringify({ error: 'Offline', images: [] }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Return cached response if network fails
    return cachedResponse;
  });

  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/) || 
         url.hostname.includes('unsplash.com') ||
         url.hostname.includes('images.unsplash.com');
}

function isApiRoute(request) {
  const url = new URL(request.url);
  return API_ROUTES.some(route => url.pathname.startsWith(route));
}

function isPageRequest(request) {
  const url = new URL(request.url);
  return url.pathname === '/' || 
         url.pathname.startsWith('/cities/') ||
         url.pathname.startsWith('/plan') ||
         url.pathname.startsWith('/favorites') ||
         url.pathname.startsWith('/explore') ||
         url.pathname.startsWith('/auth/');
}

// Cache first with TTL strategy
async function cacheFirstWithTTL(request, ttl) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      const timestamp = cachedResponse.headers.get('sw-cache-timestamp');
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < ttl) {
          return cachedResponse;
        }
      }
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      const responseWithTTL = networkResponse.clone();
      responseWithTTL.headers.set('sw-cache-timestamp', Date.now().toString());
      cache.put(request, responseWithTTL);
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first with TTL strategy failed:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline', images: [] }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Performing background sync...');
  // Implement background sync logic here
  // For example, sync trip plans when back online
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore',
          icon: '/icons/icon-192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/icon-192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/cities')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});