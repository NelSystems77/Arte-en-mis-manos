/**
 * Service Worker
 * Handles caching and offline functionality
 */

const CACHE_NAME = 'arte-en-mis-manos-v1.0.0';
const RUNTIME_CACHE = 'arte-runtime-v1.0.0';

// Files to cache immediately
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/styles.css',
    '/assets/css/components.css',
    '/assets/css/responsive.css',
    '/assets/js/app.js',
    '/assets/js/ui.js',
    '/assets/js/booking.js',
    '/assets/js/api.js',
    '/assets/js/auth.js',
    '/admin/dashboard.html',
    '/admin/services.html',
    '/admin/appointments.html',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[ServiceWorker] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[ServiceWorker] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[ServiceWorker] Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        // Cache Google Fonts
        if (event.request.url.includes('fonts.googleapis.com') || 
            event.request.url.includes('fonts.gstatic.com')) {
            event.respondWith(
                caches.match(event.request).then(response => {
                    return response || fetch(event.request).then(fetchResponse => {
                        return caches.open(RUNTIME_CACHE).then(cache => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    });
                })
            );
        }
        return;
    }

    // Network first strategy for API calls
    if (event.request.url.includes('/api/')) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Cache first strategy for assets
    if (event.request.url.includes('/assets/')) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    // Stale while revalidate for HTML pages
    event.respondWith(staleWhileRevalidate(event.request));
});

/**
 * Cache First Strategy
 * Good for: Static assets (CSS, JS, images)
 */
function cacheFirst(request) {
    return caches.match(request).then(response => {
        if (response) {
            return response;
        }
        
        return fetch(request).then(fetchResponse => {
            return caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
            });
        }).catch(() => {
            // Return offline page if available
            return caches.match('/offline.html');
        });
    });
}

/**
 * Network First Strategy
 * Good for: API calls, dynamic content
 */
function networkFirst(request) {
    return fetch(request).then(fetchResponse => {
        return caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
        });
    }).catch(() => {
        return caches.match(request);
    });
}

/**
 * Stale While Revalidate Strategy
 * Good for: HTML pages, frequently updated content
 */
function staleWhileRevalidate(request) {
    return caches.open(RUNTIME_CACHE).then(cache => {
        return cache.match(request).then(response => {
            const fetchPromise = fetch(request).then(fetchResponse => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
            });
            
            return response || fetchPromise;
        });
    });
}

// Background Sync
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync:', event.tag);
    
    if (event.tag === 'sync-appointments') {
        event.waitUntil(syncAppointments());
    }
});

/**
 * Sync Appointments with Backend
 */
async function syncAppointments() {
    try {
        // Get pending appointments from IndexedDB
        // Send to backend
        console.log('[ServiceWorker] Syncing appointments...');
        return Promise.resolve();
    } catch (error) {
        console.error('[ServiceWorker] Sync failed:', error);
        return Promise.reject(error);
    }
}

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-96x96.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver',
                icon: '/assets/icons/icon-96x96.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/assets/icons/icon-96x96.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Arte en mis manos', options)
    );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification click:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message from client
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE).then(cache => {
                return cache.addAll(event.data.urls);
            })
        );
    }
});

console.log('[ServiceWorker] Loaded and ready!');
