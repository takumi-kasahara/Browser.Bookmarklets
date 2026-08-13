import { extractAmazonAsin, extractYouTubePlaylistId, extractYouTubeVideoId, isNotEmptyString } from '../modules/IdentifierExtensions.js';
import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { extractIdsFromSchema } from '../modules/SchemaExtensions.js';
import { is } from '../modules/WindowExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const path = location.pathname.split('/');
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
    const asin = extractAmazonAsin(document);
    return asin ? [asin] : [];
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
    return [
      extractYouTubeVideoId(location.href),
      extractYouTubePlaylistId(location.href),
    ].filter((x): x is string => Boolean(x));
  }
})();
