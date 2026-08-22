import { toAmazon, toCalil } from './IdentifierExtensions.js';

/**
 * Collect anchor hrefs within the current text selection.
 *
 * @param {Document} document
 * @returns {string[]}
 */
export function extractUrlsFromSelection(document: Document): string[] {
  const selection = document.getSelection?.();
  if (!selection) return [];
  const ranges = Array.from({ length: selection.rangeCount }, (_, i) =>
    selection.getRangeAt(i),
  );
  return ranges.flatMap(r => {
    const contents = r.cloneContents();
    const walker = document.createTreeWalker(contents, NodeFilter.SHOW_ELEMENT);
    const urls: string[] = [];
    while (walker.nextNode())
      if (walker.currentNode instanceof HTMLAnchorElement)
        urls.push(walker.currentNode.href);
    return urls;
  });
}

/**
 * Convert a selected plain-text token (ASIN or ISBN) into a URL.
 *
 * @param {Document} document
 * @returns {string[]}
 */
export function extractUrlsFromSelectionText(document: Document): string[] {
  const text = document.getSelection?.()?.toString().trim() ?? '';
  if (!text) return [];
  const url = toCalil(text) || toAmazon(text);
  return url ? [url] : [];
}
