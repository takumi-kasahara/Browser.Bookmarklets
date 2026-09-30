import { extractElement } from './HtmlExtensions.js';
import { toAmazon, toCalil } from './IdentifierExtensions.js';
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
    for (const url of urls) if (url) collection.add(url);
  };

  const urlFromMicrodata = [
    document.documentElement,
    ...document.querySelectorAll('[itemscope]'),
  ].flatMap(e =>
    fromElement(
      extractElement(e, 'itemscope', 'itemprop'),
      e.getAttribute('itemtype') ?? '',
    ),
  );
  if (urlFromMicrodata.length > 0) addAll(urlFromMicrodata);

  const urlFromRDFa = [
    document.documentElement,
    ...document.querySelectorAll('[typeof]'),
  ].flatMap(e =>
    fromElement(
      extractElement(e, 'typeof', 'property'),
      e.getAttribute('typeof') ?? '',
    ),
  );
  if (urlFromRDFa.length > 0) addAll(urlFromRDFa);

  const urlFromLD = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]'),
  )
    .flatMap(e => extractObjects(tryParse(e.textContent?.trim() ?? '')))
    .flatMap(d => fromJson(d));
  if (urlFromLD.length > 0) addAll(urlFromLD);

  return collection.size > 0 ? Array.from(collection) : [];

  /**
   * @param {Record<string, unknown> | null} data
   * @param {string} type
   * @returns {string[]}
   */
  function fromElement(
    data: Record<string, unknown> | null,
    type: string,
  ): string[] {
    if (!data) return [];
    const values = new Set<string>();
    switch (type) {
      default:
        /** @see {@link https://schema.org/asin} */
        if (Object.hasOwn(data, 'asin'))
          values.add(String(toAmazon(String(data['asin']))));
        /** @see {@link https://schema.org/isbn} */
        if (Object.hasOwn(data, 'isbn'))
          values.add(String(toCalil(String(data['isbn']))));
        /** @see {@link https://schema.org/gtin} */
        if (Object.hasOwn(data, 'gtin'))
          values.add(String(toCalil(String(data['gtin']))));
        /** @see {@link https://schema.org/gtin13} */
        if (Object.hasOwn(data, 'gtin13'))
          values.add(String(toCalil(String(data['gtin13']))));
        /** @see {@link https://ogp.me/#type_book} */
        if (Object.hasOwn(data, 'books:isbn'))
          values.add(String(toCalil(String(data['books:isbn']))));
    }
    return values.size > 0 ? Array.from(values).filter(Boolean) : [];
  }
  /**
   * @param {Record<string, unknown>} data
   * @returns {string[]}
   */
  function fromJson(data: Record<string, unknown>): string[] {
    const values = new Set<string>();
    if (Object.hasOwn(data, 'url')) values.add(String(data.url));
    if (Object.hasOwn(data, 'identifier'))
      if (location.origin === 'https://x.com')
        values.add(`${location.origin}/i/user/${String(data.identifier)}`);
    if (Object.hasOwn(data, '@type'))
      for (const type of Array.isArray(data['@type'])
        ? data['@type']
        : [data['@type']])
        switch (type) {
          case 'VideoObject':
            if (Object.hasOwn(data, '@id')) values.add(String(data['@id']));
        }
    if (Object.hasOwn(data, 'asin'))
      values.add(String(toAmazon(String(data['asin']))));
    /** @see {@link https://schema.org/isbn} */
    if (Object.hasOwn(data, 'isbn'))
      values.add(String(toCalil(String(data['isbn']))));
    /** @see {@link https://schema.org/gtin} */
    if (Object.hasOwn(data, 'gtin'))
      values.add(String(toCalil(String(data['gtin']))));
    /** @see {@link https://schema.org/gtin13} */
    if (Object.hasOwn(data, 'gtin13'))
      values.add(String(toCalil(String(data['gtin13']))));
    /** @see {@link https://ogp.me/#type_book} */
    if (Object.hasOwn(data, 'books:isbn'))
      values.add(String(toCalil(String(data['books:isbn']))));
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
    for (const id of ids) if (id) collection.add(id);
  };

  const idFromMicrodata = [
    document.documentElement,
    ...document.querySelectorAll('[itemscope]'),
  ]
    .filter((e): e is HTMLElement => e instanceof HTMLElement)
    .flatMap(e =>
      fromElement(
        extractElement(e, 'itemscope', 'itemprop'),
        e.getAttribute('itemtype') ?? '',
      ),
    );
  if (idFromMicrodata.length > 0) addAll(idFromMicrodata);

  const idFromRDFa = [
    document.documentElement,
    ...document.querySelectorAll('[typeof]'),
  ]
    .filter((e): e is HTMLElement => e instanceof HTMLElement)
    .flatMap(e =>
      fromElement(
        extractElement(e, 'typeof', 'property'),
        e.getAttribute('typeof') ?? '',
      ),
    );
  if (idFromRDFa.length > 0) addAll(idFromRDFa);

  const idFromLD = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]'),
  )
    .flatMap(e => extractObjects(tryParse(e.textContent?.trim() ?? '')))
    .flatMap(d => fromJson(d));
  if (idFromLD.length > 0) addAll(idFromLD);

  return collection.size > 0 ? Array.from(collection) : [];

  /**
   * @param {Record<string, unknown> | null} data
   * @param {string} type
   * @returns {string[]}
   */
  function fromElement(
    data: Record<string, unknown> | null,
    type: string,
  ): string[] {
    if (!data) return [];
    const values = new Set<string>();
    switch (type) {
      default:
        if (Object.hasOwn(data, 'identifier'))
          values.add(String(data['identifier']));
        /** @see {@link https://schema.org/asin} */
        if (Object.hasOwn(data, 'asin')) values.add(String(data['asin']));
        /** @see {@link https://schema.org/isbn} */
        if (Object.hasOwn(data, 'isbn')) values.add(String(data['isbn']));
        /** @see {@link https://schema.org/gtin} */
        if (Object.hasOwn(data, 'gtin')) values.add(String(data['gtin']));
        /** @see {@link https://schema.org/gtin13} */
        if (Object.hasOwn(data, 'gtin13')) values.add(String(data['gtin13']));
        /** @see {@link https://ogp.me/#type_book} */
        if (Object.hasOwn(data, 'books:isbn'))
          values.add(String(data['books:isbn']));
    }
    return values.size > 0 ? Array.from(values).filter(Boolean) : [];
  }
  /**
   * @param {Record<string, unknown>} data
   * @returns {string[]}
   */
  function fromJson(data: Record<string, unknown>): string[] {
    const values = new Set<string>();
    if (Object.hasOwn(data, 'identifier'))
      values.add(String(data['identifier']));
    if (Object.hasOwn(data, 'identifier'))
      values.add(String(data['identifier']));
    /** @see {@link https://schema.org/asin} */
    if (Object.hasOwn(data, 'asin')) values.add(String(data['asin']));
    /** @see {@link https://schema.org/isbn} */
    if (Object.hasOwn(data, 'isbn')) values.add(String(data['isbn']));
    /** @see {@link https://schema.org/gtin} */
    if (Object.hasOwn(data, 'gtin')) values.add(String(data['gtin']));
    /** @see {@link https://schema.org/gtin13} */
    if (Object.hasOwn(data, 'gtin13')) values.add(String(data['gtin13']));
    /** @see {@link https://ogp.me/#type_book} */
    if (Object.hasOwn(data, 'books:isbn'))
      values.add(String(data['books:isbn']));
    return values.size > 0 ? Array.from(values).filter(Boolean) : [];
  }
}
