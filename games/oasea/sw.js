const CACHE_VERSION = 'oasea-v1.0.1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;   // models, audio, textures — never evicted
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`; // JS chunks, CSS, HTML — capped
const OFFLINE_PAGE = '/games/oasea/offline.html';

const DYNAMIC_CACHE_LIMIT = 60;

// Critical assets to cache immediately on install
const STATIC_ASSETS = [
  '/games/oasea/',
  '/games/oasea/offline.html'
];

// Asset path prefixes that go into the permanent asset cache
function isLargeAsset(url) {
  const path = url.pathname;
  return path.includes('/models/') ||
         path.includes('/sounds/') ||
         path.endsWith('.glb') ||
         path.endsWith('.mp3') ||
         path.endsWith('.ogg') ||
         path.endsWith('.wav') ||
         path.endsWith('.m4a') ||
         path.endsWith('.jpg') ||
         path.endsWith('.png') ||
         path.endsWith('.json') ||
         path.endsWith('.lottie');
}

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const keep = new Set([STATIC_CACHE, ASSET_CACHE, DYNAMIC_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith('oasea-') && !keep.has(name))
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Pass range requests through — audio/video streaming uses these and
  // partial responses (206) can't be safely cached or reconstructed.
  if (request.headers.get('range')) return;

  // Supabase / API — network first, fall back to cache
  if (url.hostname.includes('supabase') || url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clone);
              limitCacheSize(DYNAMIC_CACHE, DYNAMIC_CACHE_LIMIT);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Models, audio, textures — cache first, permanent (never evicted)
  if (isLargeAsset(url)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return new Response('Asset unavailable offline', { status: 503 });
        }
      })
    );
    return;
  }

  // JS chunks, CSS, HTML — cache first, then network, cap size
  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && response.status === 200 && response.type !== 'error') {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clone);
            limitCacheSize(DYNAMIC_CACHE, DYNAMIC_CACHE_LIMIT);
          });
        }
        return response;
      } catch {
        if (request.destination === 'document') {
          return caches.match(OFFLINE_PAGE);
        }
      }
    })
  );
});

function limitCacheSize(cacheName, maxItems) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxItems));
      }
    });
  });
}

// Messages from client
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => Promise.all(
        names.filter((n) => n.startsWith('oasea-')).map((n) => caches.delete(n))
      ))
    );
  }
});

// Push event — fired when the server sends a push message
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Oasea';
  const options = {
    body: data.body || 'A new daily island is ready!',
    icon: '/games/oasea/img/island-thumb.png',
    badge: '/games/oasea/img/island-thumb.png',
    tag: 'oasea-daily',   // collapses multiple daily notifications into one
    renotify: false,
    data: { url: data.url || '/games/oasea/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click — open or focus the game
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/games/oasea/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/games/oasea/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
