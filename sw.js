const CACHE_NAME = 'sportabzeichen-v50';
const urlsToCache = [
  '/sportabzeichen/',
  '/sportabzeichen/index.html',
  '/sportabzeichen/manifest.json',
  '/sportabzeichen/styles.css',
  '/sportabzeichen/app.js',
  '/sportabzeichen/pruefung.js',
  '/sportabzeichen/aktionstag.js',
  '/sportabzeichen/sammelerfassung.js',
  // Rechtstexte: muessen auch offline erreichbar sein, sonst fuehrt der
  // Footer in der installierten PWA ohne Empfang ins Leere.
  '/sportabzeichen/impressum.html',
  '/sportabzeichen/datenschutz.html',
  // Selbst ausgelieferte Bibliothek (vorher cdn.jsdelivr.net).
  // Beim Versionswechsel hier den Dateinamen mitziehen.
  '/sportabzeichen/vendor/supabase-js-2.118.0.js',
  // Selbst ausgelieferte Schrift (vorher fonts.googleapis.com).
  '/sportabzeichen/fonts/ibm-plex-sans-v23-latin.woff2',
  '/sportabzeichen/fonts/ibm-plex-sans-v23-latin-ext.woff2',
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
