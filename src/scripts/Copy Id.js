import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { extractElement } from '../modules/HtmlExtensions.js';
import { extractObjects, tryParse } from '../modules/JsonExtensions.js';
import { is } from '../modules/WindowExtensions.js';
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
  const params = new URL(location.href).searchParams;
  const ids = Array.from(
    new Set([
      ...fromSchema(),
      ...ifAmazon(),
      ...ifOneDrive(),
      ...ifPixiv(),
      ...ifTwitter(),
      ...ifYouTube(),
    ]))
    .filter(isNotEmptyString)
    .sort(new Intl.Collator(undefined, { numeric: true }).compare);
  if (ids.length > 0) await copyToClipboard(`Copy ${ids.length} ID(s):`, ids.join('\n'));
  else console.warn('ID not found.');

  /**
   * @returns {string[]}
   */
  function fromSchema() {
    const collection = new Set();

    const idFromMicrodata = [document.documentElement, ...document.querySelectorAll('[itemscope]')]
      .filter(e => e instanceof HTMLElement)
      .flatMap(e => fromElement(extractElement(e, 'itemscope', 'itemprop'), e.getAttribute('itemtype') ?? ''));
    if (idFromMicrodata.length > 0) for (const id of idFromMicrodata) collection.add(id);

    const idFromRDFa = [document.documentElement, ...document.querySelectorAll('[typeof]')]
      .filter(e => e instanceof HTMLElement)
      .flatMap(e => fromElement(extractElement(e, 'typeof', 'property'), e.getAttribute('typeof') ?? ''));
    if (idFromRDFa.length > 0) for (const id of idFromRDFa) collection.add(id);

    const idFromLD = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .flatMap(e => extractObjects(tryParse(e.textContent.trim())))
      .flatMap(d => fromJson(d));
    if (idFromLD.length > 0) for (const id of idFromLD) collection.add(id);

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
          if (Object.hasOwn(data, 'identifier')) {
            const identifier = data['identifier'];
            values.add(String(identifier));
          }
      }
      return values.size > 0 ? Array.from(values).filter(Boolean) : [];
    }
    /**
     * @param {Record<string, unknown>} data
     * @returns {string[]}
     */
    function fromJson(data) {
      const values = new Set();
      if (Object.hasOwn(data, 'identifier')) {
        const identifier = data['identifier'];
        values.add(String(identifier));
      }
      return values.size > 0 ? Array.from(values).filter(Boolean) : [];
    }
  }
  function ifAmazon() {
    if (!is('amazon.co.jp')) return [];
    const e = document.querySelector('input#rufus-view-context');
    if (e instanceof HTMLInputElement) {
      try {
        return [String(JSON.parse(e.value).asin)];
      }
      catch (e) {
        if (e instanceof Error) console.warn(e.message, e);
        else console.warn(e);
      }
    }
    // /dp/:ASIN
    const dp = path.indexOf('dp');
    if (dp > -1) return path.at(dp + 1) ? [path.at(dp + 1)] : [];
    // /gp/product/:ASIN
    const gp = path.indexOf('product');
    if (gp > -1) return path.at(gp + 1) ? [path.at(gp + 1)] : [];

    const node = params.get('node');
    return node ? [node] : [];
  }
  function ifOneDrive() {
    if (!is('onedrive.live.com')) return [];
    return [
      document.querySelector('.ms-Breadcrumb-item')?.textContent.trim(),
      document.getElementById('__details-panel-title')?.textContent.trim(),
      document.getElementById('__photo-view-photo-main')?.dataset?.automationid,
      params.get('id'),
      params.get('photosData'),
    ].filter(Boolean);
  }
  function ifPixiv() {
    if (!is('pixiv.net')) return [];
    // /*/artworks/:illust_id
    // /*/users/:user_id
    const segment = [
      'artworks',
      'users',
    ].find(s => path.indexOf(s) > -1);
    if (!segment) return [];
    const id = path.at(path.indexOf(segment) + 1);
    return id ? [id] : [];
  }
  function ifTwitter() {
    if (!is('x.com')) return [];
    return path.at(1) === 'status' && path.at(2) ? [path.at(2)] : [];
  }
  function ifYouTube() {
    if (is('youtu.be')) return path.at(1) ? [path.at(1)] : [];
    if (!(is('youtube.com') || is('m.youtube.com'))) return [];
    // shorts/:id
    if (path.at(1) === 'shorts') return path.at(2) ? [path.at(2)] : [];
    return [
      params.get('v'),
      params.get('list'),
    ].filter(Boolean);
  }
})();
