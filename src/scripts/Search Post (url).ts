/**
 * @see {@link https://docs.x.com/x-api/posts/search/integrate/operators}
 */
import { extractUrlsFromSelection } from '../modules/SelectionExtensions.js';
import { open } from '../modules/WindowExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;
  if (location.hostname === 'x.com') return;

  const urls = extractUrlsFromSelection(document);
  if (urls.length > 0) {
    await open(urls.map(url => convert(url)));
    return;
  }

  await open([convert(location.href)]);

  /**
   * @param {string} url
   * @returns {string}
   */
  function convert(url: string) {
    const search = new URL('https://x.com/search');
    search.searchParams.set('q', url);
    return search.href;
  }
})();
