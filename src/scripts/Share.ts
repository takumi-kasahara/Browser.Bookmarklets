/**
 * @see {@link https://docs.x.com/x-for-websites/post-button/guides/web-intent}
 */
(async () => {
  if (!/https?:/.test(location.protocol)) return;
  if (location.hostname === 'x.com') return;

  const canonical = document.querySelector('link[rel="canonical"]');
  const url
    = canonical instanceof HTMLLinkElement ? canonical.href : location.href;
  const intent = new URL('https://x.com/intent/tweet');
  intent.searchParams.set('url', url);
  window.open(intent, '_blank', 'noreferrer');
})();
