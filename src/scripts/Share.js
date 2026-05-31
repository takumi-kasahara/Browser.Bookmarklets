(() => {
  if (!/https?:/.test(location.protocol)) return;

  const url = new URL('https://x.com/intent/compose');
  if (location.origin === url.origin) return;

  const canonical = document.querySelector('link[rel="canonical"]');
  const href = canonical instanceof HTMLLinkElement && canonical.href ? canonical.href : location.href;
  url.searchParams.set('text', href);
  window.open(url, '_blank', 'noreferrer');
})();
