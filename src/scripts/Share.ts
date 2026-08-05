(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const canonical = document.querySelector('link[rel="canonical"]');
  const url = canonical instanceof HTMLLinkElement ? canonical.href : location.href;
  const intent = new URL('https://x.com/intent/compose');
  intent.searchParams.set('url', url);
  window.open(intent, '_blank', 'noreferrer');
})();
