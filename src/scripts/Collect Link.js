import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { extractElement } from '../modules/HtmlExtensions.js';
import { extractObjects, tryParse } from '../modules/JsonExtensions.js';
(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const urls = Array.from(
    new Set([
      ...fromSelection(),
      ...fromSchema(),
    ]))
    .sort(new Intl.Collator(undefined, { numeric: true }).compare);
  if (urls.length > 0) await copyToClipboard(`Copy ${urls.length} URL(s):`, urls.join('\n'));
  else await copyToClipboard(`Copy ${urls.length} URL(s):`, location.href);

  function fromSelection() {
    const selection = window.getSelection();
    if (!selection) return [];
    const ranges = Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i));
    return ranges.flatMap(r => {
      const contents = r.cloneContents();
      const walker = document.createTreeWalker(contents, NodeFilter.SHOW_ELEMENT);
      const urls = [];
      while (walker.nextNode())
        if (walker.currentNode instanceof HTMLAnchorElement)
          urls.push(walker.currentNode.href);
      return urls;
    });
  }
  /**
   * @returns {string[]}
   */
  function fromSchema() {
    const collection = new Set();

    const urlFromMicrodata = [document.documentElement, ...document.querySelectorAll('[itemscope]')]
      .flatMap(e => fromElement(extractElement(e, 'itemscope', 'itemprop'), e.getAttribute('itemtype') ?? ''));
    if (urlFromMicrodata.length > 0) for (const url of urlFromMicrodata) collection.add(url);

    const urlFromRDFa = [document.documentElement, ...document.querySelectorAll('[typeof]')]
      .flatMap(e => fromElement(extractElement(e, 'typeof', 'property'), e.getAttribute('typeof') ?? ''));
    if (urlFromRDFa.length > 0) for (const url of urlFromRDFa) collection.add(url);

    const urlFromLD = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .flatMap(e => extractObjects(tryParse(e.textContent.trim())))
      .flatMap(d => fromJson(d));
    if (urlFromLD.length > 0) for (const url of urlFromLD) collection.add(url);

    return collection.size > 0 ? Array.from(collection) : [];

    /**
    * @param {Record<string, unknown> | null} data
     * @param {string} type
     * @returns {string[]}
     */
    function fromElement(data, type) {
      if (!data) return [];
      const values = new Set();
      switch (type) {
        default:
        // no-op
      }
      return values.size > 0 ? Array.from(values).filter(Boolean) : [];
    }
    /**
    * @param {Record<string, unknown>} data
     * @returns {string[]}
     */
    function fromJson(data) {
      const values = new Set();
      if (Object.hasOwn(data, 'url'))
        values.add(String(data.url));
      if (Object.hasOwn(data, 'identifier'))
        if (location.origin === 'https://x.com')
          values.add(`${location.origin}/i/user/${String(data.identifier)}`);
      if (Object.hasOwn(data, '@type'))
        for (const type of Array.isArray(data['@type']) ? data['@type'] : [data['@type']])
          switch (type) {
            case 'VideoObject':
              if (Object.hasOwn(data, '@id'))
                values.add(String(data['@id']));
          }
      return values.size > 0 ? Array.from(values).filter(Boolean) : [];
    }
  }
})();
