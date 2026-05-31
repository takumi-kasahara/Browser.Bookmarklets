import { extractElement } from '../modules/HtmlExtensions.js';
import { extractObjects, tryParse } from '../modules/JsonExtensions.js';
import { is, open } from '../modules/WindowExtensions.js';
/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isNotEmptyString(value) {
  return typeof value === 'string' && value.length > 0;
}
(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const path = location.pathname.split('/');
  const urls = Array.from(
    new Set([
      ...fromSelection(),
      ...fromSchema(),
      ...ifAmazon(),
      ...ifDLsite(),
      ...ifPixiv(),
      ...ifRakuten(),
      ...ifSteam(),
      ...ifYouTube(),
    ]))
    .filter(isNotEmptyString)
    .sort(new Intl.Collator(undefined, { numeric: true }).compare);
  if (urls.length > 0) await open(urls);
  else console.warn('URL not found.');

  /**
   * @param {string} value
   */
  function fromASIN(value) {
    if (!value) return null;
    const cleaned = value.trim().toUpperCase();
    return /^[A-Z0-9]{10}$/.test(cleaned) ? `https://www.amazon.co.jp/dp/${cleaned}` : null;
  }
  /**
   * @param {string} value
   */
  function fromISBN(value) {
    if (!value) return null;
    const cleaned = value.replaceAll(/[-\s]/g, '').toUpperCase();
    return /^\d{9}(?:\d|X)$|^\d{13}$/.test(cleaned) ? `https://calil.jp/book/${cleaned}` : null;
  }
  /**
   * @returns {string[]}
   */
  function fromSelection() {
    const text = window.getSelection()?.toString().trim() ?? '';
    if (!text) return [];
    const url = fromISBN(text) || fromASIN(text);
    return url ? [url] : [];
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
          /** @see {@link https://schema.org/asin} */
          if (Object.hasOwn(data, 'asin'))
            values.add(fromASIN(String(data['asin'])));
          /** @see {@link https://schema.org/isbn} */
          if (Object.hasOwn(data, 'isbn'))
            values.add(fromISBN(String(data['isbn'])));
          /** @see {@link https://schema.org/gtin} */
          if (Object.hasOwn(data, 'gtin'))
            values.add(fromISBN(String(data['gtin'])));
          /** @see {@link https://schema.org/gtin13} */
          if (Object.hasOwn(data, 'gtin13'))
            values.add(fromISBN(String(data['gtin13'])));
          /** @see {@link https://ogp.me/#type_book} */
          if (Object.hasOwn(data, 'books:isbn'))
            values.add(fromISBN(String(data['books:isbn'])));
      }
      return values.size > 0 ? Array.from(values).filter(Boolean) : [];
    }
    /**
     * @see {@link https://schema.org/Book}
     * @param {Record<string, unknown>} data
     * @returns {string[]}
     */
    function fromJson(data) {
      const values = new Set();
      /** @see {@link https://schema.org/asin} */
      if (Object.hasOwn(data, 'asin'))
        values.add(fromASIN(String(data['asin'])));
      /** @see {@link https://schema.org/isbn} */
      if (Object.hasOwn(data, 'isbn'))
        values.add(fromISBN(String(data['isbn'])));
      /** @see {@link https://schema.org/gtin} */
      if (Object.hasOwn(data, 'gtin'))
        values.add(fromISBN(String(data['gtin'])));
      /** @see {@link https://schema.org/gtin13} */
      if (Object.hasOwn(data, 'gtin13'))
        values.add(fromISBN(String(data['gtin13'])));
      return values.size > 0 ? Array.from(values).filter(Boolean) : [];
    }
  }
  function ifAmazon() {
    if (!is('amazon.co.jp')) return [];
    const e = document.querySelector('input#rufus-view-context');
    if (e instanceof HTMLInputElement)
      try {
        return [fromISBN(String(JSON.parse(e.value).asin))];
      }
      catch (e) {
        if (e instanceof Error) console.warn(e.message, e);
        else console.warn(e);
      }
    const patterns = [
      new URLPattern({ pathname: '/dp/:asin' }),
      new URLPattern({ pathname: '/gp/product/:asin' }),
    ];
    for (const pattern of patterns) {
      const match = pattern.exec(location.href);
      const asin = match?.pathname.groups.asin;
      if (asin) return [fromISBN(asin)];
    }
    return [];
  }
  function ifDLsite() {
    if (!is('dlsite.com')) return [];
    const origin = 'https://dlwatcher.com';
    const product_id = document.querySelector('#work_buy_box_wrapper > [data-product_id]');
    if (product_id instanceof HTMLElement)
      return [`${origin}/product/${product_id.dataset.product_id}`];
    const maker_id = document.querySelector('#main_inner [data-follow-key]');
    if (maker_id instanceof HTMLElement)
      return [`${origin}/maker/${maker_id.dataset.followKey}`];
    return [];
  }
  function ifPixiv() {
    if (!is('pixiv.net')) return [];
    if (location.pathname === '/history.php') {
      const ids = performance.getEntriesByType('resource')
        .filter(e => e instanceof PerformanceResourceTiming)
        .filter(e => e.initiatorType === 'fetch')
        .sort((a, b) => b.responseEnd - a.responseEnd)
        .map(e => new URL(e.name))
        .filter(u => u.origin === location.origin && u.pathname === '/ajax/illust/detail')
        .map(u => u.searchParams.get('illust_ids'))
        .find(Boolean);
      if (!ids) return [];
      return ids.split(',')
        .filter(Boolean)
        .map(id => `https://www.pixiv.net/artworks/${id}`);
    }
    if (location.pathname === '/ranking.php')
      return Array.from(document.querySelectorAll('.ranking-image-item > a.work'))
        .filter(e => e instanceof HTMLAnchorElement)
        .map(a => a.href);
    return Array.from(document.querySelectorAll('a[data-gtm-value][data-gtm-user-id]'))
      .filter(e => e instanceof HTMLAnchorElement)
      .filter(a => a.origin === location.origin)
      .map(a => a.href);
  }
  function ifRakuten() {
    if (!is('rakuten.co.jp')) return [];
    const coupon = new URLPattern({
      hostname: 'coupon.rakuten.co.jp',
      search: 'getkey=:getkey',
    });
    return Array.from(document.getElementsByTagName('a'))
      .filter(a => coupon.test(a.href))
      .map(a => a.href);
  }
  function ifSteam() {
    if (!(is('steampowered.com') || is('steamcommunity.com'))) return [];
    const segment = [
      'app',
      'bundle',
      'sub',
      'developer',
      'publisher',
      'franchise',
    ].find(s => path.indexOf(s) > -1);
    if (!segment) return [];
    const id = path.at(path.indexOf(segment) + 1);
    return id ? [`https://steamdb.info/${segment}/${id}/`] : [];
  }
  function ifYouTube() {
    if (!is('youtube.com')) return [];
    const url = new URL(location.href);
    switch (url.hostname) {
      case 'www.youtube.com':
        url.hostname = 'music.youtube.com';
        return [url.href];
      case 'music.youtube.com':
        url.hostname = 'www.youtube.com';
        return [url.href];
      default:
        return [];
    }
  }
})();
