/**
 * @see {@link https://docs.x.com/x-api/posts/search/integrate/operators}
 */
(async () => {
  if (!/https?:/.test(location.protocol)) return;
  if (location.hostname === 'x.com') return;

  const url = new URL('https://x.com/search');
  url.searchParams.set('q', location.href);
  window.open(url, '_blank', 'noreferrer');
})();
