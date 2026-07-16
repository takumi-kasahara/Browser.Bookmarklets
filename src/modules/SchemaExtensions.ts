import { extractElement } from './HtmlExtensions.js';
import { extractObjects, tryParse } from './JsonExtensions.js';

/**
 * Extract candidate URLs from embedded structured data (microdata, RDFa, JSON-LD).
 *
 * @param {Document} document
 * @returns {string[]}
 */
export function extractUrlsFromSchema(document: Document): string[] {
  const collection = new Set<string>();
  const addAll = (urls: string[]) => {
    for (const url of urls)
      if (url) collection.add(url);
  };

  const urlFromMicrodata = [document.documentElement, ...document.querySelectorAll('[itemscope]')]
    .flatMap(e => fromElement(extractElement(e, 'itemscope', 'itemprop'), e.getAttribute('itemtype') ?? ''));
  if (urlFromMicrodata.length > 0) addAll(urlFromMicrodata);

  const urlFromRDFa = [document.documentElement, ...document.querySelectorAll('[typeof]')]
    .flatMap(e => fromElement(extractElement(e, 'typeof', 'property'), e.getAttribute('typeof') ?? ''));
  if (urlFromRDFa.length > 0) addAll(urlFromRDFa);

  const urlFromLD = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .flatMap(e => extractObjects(tryParse(e.textContent?.trim() ?? '')))
    .flatMap(d => fromJson(d));
  if (urlFromLD.length > 0) addAll(urlFromLD);

  return collection.size > 0 ? Array.from(collection) : [];

  /**
   * @param {Record<string, unknown> | null} data
   * @param {string} type
   * @returns {string[]}
   */
  function fromElement(data: Record<string, unknown> | null, type: string): string[] {
    if (!data) return [];
    const values = new Set<string>();
    switch (type) {
      default:
      // no-op
    }
    return values.size > 0 ? Array.from(values).filter(Boolean) : [];
  }
  /**
   * @param {Record<string, unknown>} data
   * @returns {string[]}
   */
  function fromJson(data: Record<string, unknown>): string[] {
    const values = new Set<string>();
    if (Object.hasOwn(data, 'url'))
      values.add(String(data.url));
    if (Object.hasOwn(data, 'identifier'))
      if (location.origin === 'https://x.com')
        values.add(`${location.origin}/i/user/${String(data.identifier)}`);
    if (Object.hasOwn(data, '@type'))
      for (const type of Array.isArray(data['@type']) ? data['@type'] : [data['@type']])
        switch (type) {
          case 'VideoObject':
            if (Object.hasOwn(data, '@id'))
              values.add(String(data['@id']));
        }
    return values.size > 0 ? Array.from(values).filter(Boolean) : [];
  }
}

/**
 * Extract candidate IDs from embedded structured data (microdata, RDFa, JSON-LD).
 *
 * @param {Document} document
 * @returns {string[]}
 */
export function extractIdsFromSchema(document: Document): string[] {
  const collection = new Set<string>();
  const addAll = (ids: string[]) => {
    for (const id of ids)
      if (id) collection.add(id);
  };

  const idFromMicrodata = [document.documentElement, ...document.querySelectorAll('[itemscope]')]
    .filter((e): e is HTMLElement => e instanceof HTMLElement)
    .flatMap(e => fromElement(extractElement(e, 'itemscope', 'itemprop'), e.getAttribute('itemtype') ?? ''));
  if (idFromMicrodata.length > 0) addAll(idFromMicrodata);

  const idFromRDFa = [document.documentElement, ...document.querySelectorAll('[typeof]')]
    .filter((e): e is HTMLElement => e instanceof HTMLElement)
    .flatMap(e => fromElement(extractElement(e, 'typeof', 'property'), e.getAttribute('typeof') ?? ''));
  if (idFromRDFa.length > 0) addAll(idFromRDFa);

  const idFromLD = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .flatMap(e => extractObjects(tryParse(e.textContent?.trim() ?? '')))
    .flatMap(d => fromJson(d));
  if (idFromLD.length > 0) addAll(idFromLD);

  return collection.size > 0 ? Array.from(collection) : [];

  /**
   * @param {Record<string, unknown> | null} data
   * @param {string} type
   * @returns {string[]}
   */
  function fromElement(data: Record<string, unknown> | null, type: string): string[] {
    if (!data) return [];
    const values = new Set<string>();
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
  function fromJson(data: Record<string, unknown>): string[] {
    const values = new Set<string>();
    if (Object.hasOwn(data, 'identifier')) {
      const identifier = data['identifier'];
      values.add(String(identifier));
    }
    return values.size > 0 ? Array.from(values).filter(Boolean) : [];
  }
}
