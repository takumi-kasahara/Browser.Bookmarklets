(async () => {
  if (!/https?:/.test(location.protocol)) return;
  if (location.hostname === 'duckduckgo.com') return;

  const url = new URL('https://duckduckgo.com/');
  url.searchParams.set('q', `site:${location.hostname}`);
  window.open(url, '_blank', 'noreferrer');
})();
