import { isNotEmptyString } from '../modules/IdentifierExtensions.js';
import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { extractIdsFromSchema } from '../modules/SchemaExtensions.js';
import { is } from '../modules/WindowExtensions.js';
(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const path = location.pathname.split('/');
  const params = new URL(location.href).searchParams;
  const ids = Array.from(
    new Set([
      ...extractIdsFromSchema(document),
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
