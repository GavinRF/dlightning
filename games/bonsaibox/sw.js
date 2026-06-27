// sw.template.js — BonsaiBox service worker SOURCE.
//
// This file is NOT served in dev. `build.mjs` reads it, replaces the version
// placeholder with a per-build stamp, and writes dist/sw.js. So the only
// place a registrable `sw.js` ever exists is a production build — local dev has no
// service worker by construction (and index.html's registration is also gated to
// non-localhost; see the inline script there). Edit caching behavior HERE.
//
// Scope note: in production the app lives at a sub-path (…/games/bonsaibox/). The
// worker registers with a relative URL, so its scope is that sub-path and every
// path below is relative to it. Keep the precache entries relative ('./', not '/').

const VERSION = '2026-06-27T14-58-54-135Z';
const CACHE = 'bonsaibox-' + VERSION;

// App shell: small, same-origin, must-have files. Kept minimal on purpose — one
// 404 fails the whole install, and the big GLBs/textures are handled at runtime
// (stale-while-revalidate) instead of bloating install. CDN deps (three/gsap) are
// cross-origin and also cached lazily at runtime so they survive offline.
const SHELL = [
  './',
  'index.html',
  'app.min.js',
  'app.min.css',
  'manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Let the page trigger an immediate takeover after an update (optional hook).
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // never cache mutations

  // Navigations (the HTML doc): network-first so a fresh deploy always wins when
  // online; fall back to the cached shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('index.html') || caches.match('./')))
    );
    return;
  }

  // Everything else (JS/CSS/GLB/textures/fonts + CDN deps): stale-while-revalidate.
  // Serve cache instantly when present, refresh the cache in the background so the
  // next load is current. Bounded staleness; never blocks on the network.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          // Cache OK same-origin and opaque cross-origin (CDN) responses.
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
