(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const url = new URL('https://x.com/search');
  url.searchParams.set('q', `"${location.href}"`);
  location.href = url.href;
})();
