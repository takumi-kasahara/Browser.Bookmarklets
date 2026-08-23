import { toAmazon, toCalil } from './IdentifierExtensions.js';

/**
 * Convert a selected plain-text token (ASIN or ISBN) into a URL.
 *
 * @param {Document} document
 * @returns {string[]}
 */
export function extractUrlsFromSelection(document: Document): string[] {
  const text = document.getSelection?.()?.toString().trim() ?? '';
  if (!text) return [];
  const url = toCalil(text) || toAmazon(text);
  return url ? [url] : [];
}
