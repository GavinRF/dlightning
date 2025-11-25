const CACHE_VERSION = 'oasea-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const OFFLINE_PAGE = '/games/oasea/offline.html';

// Critical assets to cache immediately
const STATIC_ASSETS = [
  '/games/oasea/offline.html'
];

// Maximum number of items to keep in dynamic cache
const DYNAMIC_CACHE_LIMIT = 50;

// Helper function to cache assets one by one
async function cacheAssets(cache, assets) {
  const results = { success: [], failed: [] };

  for (const asset of assets) {
    try {
      await cache.add(asset);
      results.success.push(asset);
      console.log(`[Service Worker] Cached: ${asset}`);
    } catch (error) {
      results.failed.push(asset);
      console.warn(`[Service Worker] Failed to cache ${asset}:`, error.message);
    }
  }

  return results;
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_VERSION);

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE);
        console.log('[Service Worker] Caching static assets');

        const results = await cacheAssets(cache, STATIC_ASSETS);
        console.log(`[Service Worker] Successfully cached ${results.success.length}/${STATIC_ASSETS.length} assets`);

        if (results.failed.length > 0) {
          console.warn('[Service Worker] Failed to cache:', results.failed);
        }

        await self.skipWaiting();
        console.log('[Service Worker] Installation complete');
      } catch (error) {
        console.error('[Service Worker] Installation error:', error);
        throw error;
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old versions of our caches
              return cacheName.startsWith('oasea-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle API requests - network first, then cache
  if (url.hostname.includes('supabase') || url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response
          const responseClone = response.clone();

          // Cache successful responses
          if (response.status === 200) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
              limitCacheSize(DYNAMIC_CACHE, DYNAMIC_CACHE_LIMIT);
            });
          }

          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request);
        })
    );
    return;
  }

  // Handle all other requests - cache first, then network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseClone = response.clone();

            // Cache the new resource
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
              limitCacheSize(DYNAMIC_CACHE, DYNAMIC_CACHE_LIMIT);
            });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, show offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match(OFFLINE_PAGE);
            }
          });
      })
  );
});

// Limit the size of a cache
function limitCacheSize(cacheName, maxItems) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => {
          limitCacheSize(cacheName, maxItems);
        });
      }
    });
  });
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('oasea-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});
