const CACHE = "viajero-v1"
const urls = ["/", "/tienda", "/login", "/register", "/mi-cuenta", "/faq", "/contacto", "/nosotros", "/blog"]

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(urls)))
  self.skipWaiting()
})

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
      if (e.request.url.startsWith(self.location.origin) && e.request.method === "GET") {
        const clone = res.clone()
        caches.open(CACHE).then((c) => c.put(e.request, clone))
      }
      return res
    }))
  )
})
