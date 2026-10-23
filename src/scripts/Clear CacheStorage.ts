(async () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
  const cacheNames = await window.caches.keys();
  if (cacheNames.length === 0) return;
  for (const cacheName of cacheNames) {
    try {
      const cache = await window.caches.open(cacheName);
      const requests = await cache.keys();
      const entries: Record<string, unknown[]> = {};
      for (const request of requests) {
        const responses = await cache.matchAll(request);
        const resolved = await Promise.all(
          responses.map(async response => {
            const text = response ? await response.text() : undefined;
            return response ? { request, response, text } : undefined;
          }),
        );
        const existing = entries[request.url];
        entries[request.url] = existing ? existing.concat(resolved) : resolved;
      }
      console.debug('CacheStorage:', cacheName, entries);
    } catch (e) {
      console.debug('CacheStorage:', cacheName, e);
    }
  }
  if (!window.confirm('Clear CacheStorage?')) return;
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
})();
