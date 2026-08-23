import {
  extractAmazonAsin,
  extractYouTubePlaylistId,
  extractYouTubeVideoId,
  isNotEmptyString,
  toCalil,
  toKeepa,
} from '../modules/IdentifierExtensions.js';
import { extractUrlsFromSchema } from '../modules/SchemaExtensions.js';
import { extractUrlsFromSelection } from '../modules/SelectionExtensions.js';
import { is, open } from '../modules/WindowExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const path = location.pathname.split('/');
  const urls = Array.from(
    new Set([
      ...extractUrlsFromSelection(document),
      ...extractUrlsFromSchema(document),
      ...ifAmazon(),
      ...ifDLsite(),
      ...ifPixiv(),
      ...ifRakuten(),
      ...ifSteam(),
      ...ifYouTube(),
    ]),
  )
    .filter(isNotEmptyString)
    .filter(url => url !== location.href)
    .sort(new Intl.Collator(undefined, { numeric: true }).compare);
  if (urls.length > 0) await open(urls);
  else console.warn('URL not found.');

  function ifAmazon(): string[] {
    if (!is('amazon.co.jp')) return [];
    const asin = extractAmazonAsin(document);
    if (!asin) return [];
    const url = toCalil(asin) ?? toKeepa(asin);
    return url ? [url] : [];
  }
  function ifDLsite(): string[] {
    if (!is('dlsite.com')) return [];
    const origin = 'https://dlwatcher.com';
    const product_id = document.querySelector(
      '#work_buy_box_wrapper > [data-product_id]',
    );
    if (product_id instanceof HTMLElement)
      return [`${origin}/product/${product_id.dataset.product_id}`];
    const maker_id = document.querySelector('#main_inner [data-follow-key]');
    if (maker_id instanceof HTMLElement)
      return [`${origin}/maker/${maker_id.dataset.followKey}`];
    return [];
  }
  function ifPixiv(): string[] {
    if (!is('pixiv.net')) return [];
    if (location.pathname === '/history.php') {
      const ids = performance
        .getEntriesByType('resource')
        .filter(e => e instanceof PerformanceResourceTiming)
        .filter(e => e.initiatorType === 'fetch')
        .sort((a, b) => b.responseEnd - a.responseEnd)
        .map(e => new URL(e.name))
        .filter(
          u =>
            u.origin === location.origin
            && u.pathname === '/ajax/illust/detail',
        )
        .map(u => u.searchParams.get('illust_ids'))
        .find(Boolean);
      if (!ids) return [];
      return ids
        .split(',')
        .filter(Boolean)
        .map(id => `https://www.pixiv.net/artworks/${id}`);
    }
    if (location.pathname === '/ranking.php')
      return Array.from(
        document.querySelectorAll('.ranking-image-item > a.work'),
      )
        .filter(e => e instanceof HTMLAnchorElement)
        .map(a => a.href);
    return Array.from(
      document.querySelectorAll('a[data-gtm-value][data-gtm-user-id]'),
    )
      .filter(e => e instanceof HTMLAnchorElement)
      .filter(a => a.origin === location.origin)
      .map(a => a.href);
  }
  function ifRakuten(): string[] {
    if (!is('rakuten.co.jp')) return [];
    const coupon = new URLPattern({
      hostname: 'coupon.rakuten.co.jp',
      search: 'getkey=:getkey',
    });
    const campaign = new URLPattern({
      search: 'scid=wi_pym_cpn_list',
    });
    return Array.from(document.getElementsByTagName('a'))
      .filter(a => coupon.test(a.href) || campaign.test(a.href))
      .map(a => a.href);
  }
  function ifSteam(): string[] {
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
  function ifYouTube(): string[] {
    if (!is('youtube.com')) return [];
    const url = new URL(location.href);
    if (url.hostname === 'www.youtube.com') {
      url.hostname = 'music.youtube.com';
      const videoId = extractYouTubeVideoId(url.href);
      if (videoId) {
        url.pathname = `/watch`;
        url.searchParams.set('v', videoId);
        return [url.href];
      }
      const playlistId = extractYouTubePlaylistId(url.href);
      if (playlistId) {
        url.pathname = `/playlist`;
        url.searchParams.set('list', playlistId);
        return [url.href];
      }
      return [url.href];
    }
    else if (url.hostname === 'music.youtube.com') {
      url.hostname = 'www.youtube.com';
      return [url.href];
    }
    return [];
  }
})();
