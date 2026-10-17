// Retired service worker.
// The previous worker served cached pages and images first, so visitors kept seeing old deploys
// (and old JS chunks that no longer exist). Browsers re-check this file, so returning visitors pick up
// this version, which deletes every cache it created and unregisters itself.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
