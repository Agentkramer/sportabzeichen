const CACHE_NAME = 'sportabzeichen-v4';
const urlsToCache = [
  '/sportabzeichen/',
  '/sportabzeichen/index.html',
  '/sportabzeichen/manifest.json'
];

// Installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Aktivierung
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch-Strategie: Network first, dann Cache
self.addEventListener('fetch', event => {
  // Supabase-Anfragen immer über Netzwerk
  if (event.request.url.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Kopie im Cache speichern
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Offline: aus Cache laden
        return caches.match(event.request);
      })
  );
});
