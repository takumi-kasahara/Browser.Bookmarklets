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
      ...ifPixiv(),
      ...ifTwitter(),
      ...ifYouTube(),
    ]))
    .filter(isNotEmptyString)
    .sort(new Intl.Collator(undefined, { numeric: true }).compare);
  if (ids.length > 0) await copyToClipboard(`Copy ${ids.length} ID(s):`, ids.join('\n'));
  else console.warn('ID not found.');

  function ifAmazon(): string[] {
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
    if (dp > -1) return path.at(dp + 1) ? [path.at(dp + 1)!] : [];
    // /gp/product/:ASIN
    const gp = path.indexOf('product');
    if (gp > -1) return path.at(gp + 1) ? [path.at(gp + 1)!] : [];

    const node = params.get('node');
    return node ? [node] : [];
  }
  function ifPixiv(): string[] {
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
  function ifTwitter(): string[] {
    if (!is('x.com')) return [];
    return path.at(1) === 'status' && path.at(2) ? [path.at(2)!] : [];
  }
  function ifYouTube(): string[] {
    // youtu.be/:video_id
    if (is('youtu.be')) return path.at(1) ? [path.at(1)!] : [];
    if (!(is('youtube.com') || is('m.youtube.com'))) return [];
    // shorts/:video_id
    if (path.at(1) === 'shorts') return path.at(2) ? [path.at(2)!] : [];
    return [
      // v=:video_id
      params.get('v'),
      // list=:playlist_id
      params.get('list'),
    ].filter((x): x is string => Boolean(x));
  }
})();
