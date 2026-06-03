const CACHE_NAME = 'uha-trials-v6_8';
const FILES_TO_CACHE = [
  '/uha_field_trials_v6_8.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// When the app is first installed, cache all the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Clean up old cached versions when we update
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// When the app tries to load something, check the cache first
// If we have it cached, use that. If not, try the internet.
self.addEventListener('fetch', event => {
  // Always try to get the xlsx library from the internet (it's big and external)
  if (event.request.url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
