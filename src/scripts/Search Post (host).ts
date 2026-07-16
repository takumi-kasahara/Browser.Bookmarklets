(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const url = new URL('https://x.com/search');
  url.searchParams.set('q', `url:${location.hostname}`);
  location.href = url.href;
})();
