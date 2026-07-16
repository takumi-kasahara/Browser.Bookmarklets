/**
 * @param {unknown} value
 * @returns {value is string}
 */
export function isNotEmptyString(value) {
  return typeof value === 'string' && value.length > 0;
}
/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
export function fromASIN(value) {
  if (!value) return null;
  const cleaned = value.trim().toUpperCase();
  return /^[A-Z0-9]{10}$/.test(cleaned) ? `https://www.amazon.co.jp/dp/${cleaned}` : null;
}
/**
 * @param {string | null | undefined} value
 * @returns {string | null}
 */
export function fromISBN(value) {
  if (!value) return null;
  const cleaned = value.replaceAll(/[-\s]/g, '').toUpperCase();
  return /^\d{9}(?:\d|X)$|^\d{13}$/.test(cleaned) ? `https://calil.jp/book/${cleaned}` : null;
}
