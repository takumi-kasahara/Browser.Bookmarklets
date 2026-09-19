import { toAmazon, toCalil } from './IdentifierExtensions.js';

/**
 * Convert a selected plain-text token (ASIN or ISBN) into a URL.
 * @param {Document} document
 * @returns {string[]}
 */
export function extractUrlsFromSelection(document: Document): string[] {
  const selection = document.getSelection?.();
  if (!selection || selection.rangeCount === 0) return [];

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const element
    = container instanceof Element ? container : container.parentElement;
  if (!element) return [];

  const anchors = Array.from(element.getElementsByTagName('a'));
  const found = anchors.filter(anchor => range.intersectsNode(anchor));
  if (found.length > 0) return found.map(a => a.href);

  const text = selection.toString().trim();
  if (!text) return [];
  const url = toCalil(text) || toAmazon(text);
  return url ? [url] : [];
}
