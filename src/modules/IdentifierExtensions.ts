import { is } from './WindowExtensions';

/**
 * @param {unknown} value
 * @returns {value is string}
 */
export function isNotEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Extract the Amazon ASIN from the current page.
 *
 * @param {Document} document
 * @param {string} [href=location.href]
 * @returns {string | null}
 */
export function extractAmazonAsin(
  document: Document,
  href: string = location.href,
): string | null {
  const e = document.querySelector('input#rufus-view-context');
  if (e instanceof HTMLInputElement) {
    try {
      const asin = JSON.parse(e.value).asin;
      if (asin) return String(asin);
    }
    catch (e) {
      if (e instanceof Error) console.warn(e.message, e);
      else console.warn(e);
    }
  }

  const patterns = [
    new URLPattern({ pathname: '/dp/:asin' }),
    new URLPattern({ pathname: '/gp/product/:asin' }),
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(href);
    const asin = match?.pathname.groups.asin;
    if (asin) return asin;
  }
  return null;
}

/**
 * Extract the YouTube video ID from the current page.
 *
 * @param {string} [href=location.href]
 * @returns {string | null}
 */
export function extractYouTubeVideoId(
  href: string = location.href,
): string | null {
  const url = new URL(href);
  if (url.hostname === 'youtu.be') {
    const id = url.pathname.split('/').at(1);
    return id || null;
  }
  if (is('youtube.com')) {
    const path = url.pathname.split('/');
    if (path.at(1) === 'shorts') return path.at(2) || null;
    return url.searchParams.get('v') || null;
  }
  return null;
}

/**
 * Extract the YouTube playlist ID from the current page.
 *
 * @param {string} [href=location.href]
 * @returns {string | null}
 */
export function extractYouTubePlaylistId(
  href: string = location.href,
): string | null {
  const url = new URL(href);
  if (!is('youtube.com')) return null;
  return url.searchParams.get('list');
}

/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
export function toAmazon(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value.trim().toUpperCase();
  return /^[A-Z0-9]{10}$/.test(cleaned)
    ? `https://www.amazon.co.jp/dp/${cleaned}`
    : null;
}

/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
export function toKeepa(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value.trim().toUpperCase();
  return /^[A-Z0-9]{10}$/.test(cleaned)
    ? `https://keepa.com/#!product/5-${cleaned}`
    : null;
}

/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
export function toCalil(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value.replaceAll(/[-\s]/g, '').toUpperCase();
  return /^\d{9}(?:\d|X)$|^\d{13}$/.test(cleaned)
    ? `https://calil.jp/book/${cleaned}`
    : null;
}
