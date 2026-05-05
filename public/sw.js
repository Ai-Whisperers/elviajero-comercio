const CACHE_NAME = 'elviajero-v2';
const urlsToCache = ['/', '/tienda', '/login', '/register'];

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request))
    return
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        if (event.request.url.startsWith(self.location.origin) &&
            event.request.url.includes('/_next/static/')) {
          return fetchResponse
        }
        return caches.open(CACHE_NAME).then((cache) => {
          try {
            if (event.request.url.startsWith(self.location.origin)) {
              cache.put(event.request, fetchResponse.clone())
            }
          } catch (e) {
            // silently ignore unsupported request methods
          }
          return fetchResponse
        })
      })
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
})
