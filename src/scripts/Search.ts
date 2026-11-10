(async () => {
  /**
   * @see {@link https://duckduckgo.com/duckduckgo-help-pages/results/syntax}
   */
  if (!/^https?:$/.test(location.protocol)) return;
  if (location.hostname === 'duckduckgo.com') return;

  const url = new URL('https://duckduckgo.com/');
  url.searchParams.set('q', `site:${location.hostname}`);
  // NOTE Specifying `noreferrer` results in an error page.
  window.open(url, '_blank', 'noopener');
})();
