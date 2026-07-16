(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const url = new URL('https://duckduckgo.com/');
  url.searchParams.set('q', `site:${location.hostname}`);
  location.href = url.href;
})();
