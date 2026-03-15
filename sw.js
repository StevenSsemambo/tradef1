/* ═══════════════════════════════════════════════════════
   TradeBaby Pro — Service Worker v8
   Offline-first with stale-while-revalidate
   ═══════════════════════════════════════════════════════ */

const CACHE_NAME = 'tradebaby-pro-v8';
const OFFLINE_URL = './index.html';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap',
];

// ── INSTALL: Pre-cache core assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          PRECACHE.map(url => cache.add(url).catch(e => console.log('Cache miss:', url)))
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: Clean old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: Stale-while-revalidate + offline fallback ──
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip chrome-extension and non-http
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => null);

        // Return cached immediately, update in background
        if (cached) {
          fetchPromise.catch(() => {}); // Background update
          return cached;
        }

        // No cache — try network
        return fetchPromise.then(response => {
          if (response) return response;
          // Complete offline fallback
          return cache.match(OFFLINE_URL) || new Response(
            `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>TradeBaby Pro</title></head>
            <body style="background:#0A0A0F;color:#C9A84C;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;text-align:center">
            <div><div style="font-size:48px">📈</div><h2>TradeBaby Pro</h2><p style="color:#9B9891">Loading from cache...</p>
            <button onclick="location.reload()" style="background:#C9A84C;color:#0A0A0F;border:none;padding:12px 24px;border-radius:8px;font-weight:700;cursor:pointer;margin-top:16px">Retry</button></div>
            </body></html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      });
    })
  );
});

// ── MESSAGE: Force update ──
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
  if (event.data === 'clearCache') {
    caches.delete(CACHE_NAME).then(() => console.log('Cache cleared'));
  }
});

// ── PUSH NOTIFICATIONS ──
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'TradeBaby Pro', body: 'Time to learn!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      tag: 'tradebaby',
      renotify: true,
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('./'));
});
