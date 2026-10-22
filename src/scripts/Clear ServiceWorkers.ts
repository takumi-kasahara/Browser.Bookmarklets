(async () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
  const registrations = await navigator.serviceWorker.getRegistrations();
  if (registrations.length === 0) return;
  console.debug('ServiceWorkers:', registrations);
  if (!window.confirm('Clear ServiceWorkers?')) return;
  await Promise.all(
    registrations.map(registration => registration.unregister()),
  );
})();
