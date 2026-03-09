/**
 * Service Worker - Arte en mis manos
 * Versión robusta que no falla si algún archivo no existe
 */

const CACHE_NAME = 'arte-en-mis-manos-v1.0.3';
const RUNTIME_CACHE = 'arte-runtime-v1.0.2';

// Archivos esenciales a cachear
const PRECACHE_URLS = [
    '/Arte-en-mis-manos/',
    '/Arte-en-mis-manos/index.html',
    '/Arte-en-mis-manos/manifest.json',
    '/Arte-en-mis-manos/assets/css/styles.css',
    '/Arte-en-mis-manos/assets/css/components.css',
    '/Arte-en-mis-manos/assets/css/responsive.css',
    '/Arte-en-mis-manos/assets/js/app.js',
    '/Arte-en-mis-manos/assets/js/ui.js',
    '/Arte-en-mis-manos/assets/js/booking.js',
    '/Arte-en-mis-manos/assets/js/api.js',
    '/Arte-en-mis-manos/assets/js/auth.js'
];

// Install event - cachear archivos INDIVIDUALMENTE (sin fallar)
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] 🔧 Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[ServiceWorker] 📦 Caching app shell');
                
                // Cachear cada archivo individualmente, ignorando errores
                const cachePromises = PRECACHE_URLS.map(url => {
                    return cache.add(url)
                        .then(() => {
                            console.log('[ServiceWorker] ✅ Cached:', url);
                        })
                        .catch(err => {
                            console.warn('[ServiceWorker] ⚠️ Failed to cache:', url, err);
                        });
                });
                
                return Promise.all(cachePromises);
            })
            .then(() => {
                console.log('[ServiceWorker] ✅ Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[ServiceWorker] ❌ Install failed:', error);
            })
    );
});

// Activate event - limpiar cachés antiguas
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] 🚀 Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('[ServiceWorker] 🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[ServiceWorker] ✅ Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - estrategia de cache
self.addEventListener('fetch', (event) => {
    // Ignorar solicitudes no-HTTP
    if (!event.request.url.startsWith('http')) {
        return;
    }

    // Ignorar solicitudes POST/PUT/DELETE
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si está en caché, devolverlo
                if (response) {
                    return response;
                }

                // Si no, pedirlo a la red
                return fetch(event.request)
                    .then(fetchResponse => {
                        // No cachear si no es una respuesta válida
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // Cachear la respuesta en runtime
                        const responseToCache = fetchResponse.clone();
                        caches.open(RUNTIME_CACHE)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    })
                    .catch(error => {
                        console.log('[ServiceWorker] ⚠️ Fetch failed:', event.request.url);
                        // Aquí podrías devolver una página offline
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

console.log('[ServiceWorker] 📱 Loaded and ready!');
