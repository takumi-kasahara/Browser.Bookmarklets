(() => {
  if (!/https?:/.test(location.protocol)) return;

  const url = new URL('https://x.com/search');
  if (location.origin === url.origin) return;

  const q = [
    location.href,
    location.href.replace(`${location.protocol}//`, ''),
  ].map(x => encodeURIComponent(x)).join('" OR "');
  url.searchParams.set('q', `"${q}"`);
  window.open(url, '_blank', 'noreferrer');
})();
