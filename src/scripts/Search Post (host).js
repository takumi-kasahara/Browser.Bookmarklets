(() => {
  if (!/https?:/.test(location.protocol)) return;

  const url = new URL('https://x.com/search');
  if (location.origin === url.origin) return;

  url.searchParams.set('q', `url:${location.hostname}`);
  window.open(url, '_blank', 'noreferrer');
})();
