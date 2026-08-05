(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const url = new URL('https://x.com/search');
  url.searchParams.set('q', `"${location.href}"`);
  window.open(url, '_blank', 'noreferrer');
})();
