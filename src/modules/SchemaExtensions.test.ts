import { beforeEach, describe, expect, it } from 'vitest';
import { extractIdsFromSchema, extractUrlsFromSchema } from './SchemaExtensions.js';

function setDocument(html: string): void {
  document.documentElement.innerHTML = html;
}

describe('extractUrlsFromSchema', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: new URL('https://example.com/'),
    });
  });

  it('returns empty array when no schema data', () => {
    setDocument('<html><body><p>no schema</p></body></html>');
    expect(extractUrlsFromSchema(document)).toEqual([]);
  });

  it('extracts url from JSON-LD', () => {
    setDocument(`<html><body>
      <script type="application/ld+json">{"url":"https://example.com/page"}</script>
    </body></html>`);
    expect(extractUrlsFromSchema(document)).toEqual(['https://example.com/page']);
  });

  it('extracts @id from VideoObject in JSON-LD', () => {
    setDocument(`<html><body>
      <script type="application/ld+json">{"@type":"VideoObject","@id":"https://example.com/video/1"}</script>
    </body></html>`);
    expect(extractUrlsFromSchema(document)).toEqual(['https://example.com/video/1']);
  });

  it('extracts identifier as x.com user URL when origin is x.com', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: new URL('https://x.com/'),
    });
    setDocument(`<html><body>
      <script type="application/ld+json">{"identifier":"123456789"}</script>
    </body></html>`);
    expect(extractUrlsFromSchema(document)).toEqual(['https://x.com/i/user/123456789']);
  });

  it('does not extract identifier when origin is not x.com', () => {
    setDocument(`<html><body>
      <script type="application/ld+json">{"identifier":"123456789"}</script>
    </body></html>`);
    expect(extractUrlsFromSchema(document)).toEqual([]);
  });

  it('handles array of @type in JSON-LD', () => {
    setDocument(`<html><body>
      <script type="application/ld+json">{"@type":["Thing","VideoObject"],"@id":"https://example.com/v"}</script>
    </body></html>`);
    expect(extractUrlsFromSchema(document)).toEqual(['https://example.com/v']);
  });

  it('extracts from multiple JSON-LD scripts', () => {
    setDocument(`<html><body>
      <script type="application/ld+json">{"url":"https://example.com/a"}</script>
      <script type="application/ld+json">{"url":"https://example.com/b"}</script>
    </body></html>`);
    expect(extractUrlsFromSchema(document).sort()).toEqual([
      'https://example.com/a',
      'https://example.com/b',
    ]);
  });

  it('extracts identifier from microdata url property', () => {
    setDocument(`<html><body>
      <div itemscope itemtype="https://schema.org/Book">
        <span itemprop="identifier">MD-URL</span>
      </div>
    </body></html>`);
    expect(extractUrlsFromSchema(document)).toEqual([]);
  });

  it('extracts identifier from RDFa property', () => {
    setDocument(`<html><body>
      <div typeof="schema:Book">
        <span property="identifier">RDF-URL</span>
      </div>
    </body></html>`);
    expect(extractUrlsFromSchema(document)).toEqual([]);
  });
});

describe('extractIdsFromSchema', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: new URL('https://example.com/'),
    });
  });

  it('returns empty array when no schema data', () => {
    setDocument('<html><body><p>no schema</p></body></html>');
    expect(extractIdsFromSchema(document)).toEqual([]);
  });

  it('extracts identifier from JSON-LD', () => {
    setDocument(`<html><body>
      <script type="application/ld+json">{"identifier":"ID123"}</script>
    </body></html>`);
    expect(extractIdsFromSchema(document)).toEqual(['ID123']);
  });

  it('extracts identifier from microdata', () => {
    setDocument(`<html><body>
      <div itemscope itemtype="https://schema.org/Book">
        <span itemprop="identifier">MD123</span>
      </div>
    </body></html>`);
    expect(extractIdsFromSchema(document)).toEqual(['MD123']);
  });

  it('extracts identifier from RDFa', () => {
    setDocument(`<html><body>
      <div typeof="schema:Book">
        <span property="identifier">RDF123</span>
      </div>
    </body></html>`);
    expect(extractIdsFromSchema(document)).toEqual(['RDF123']);
  });

  it('does not extract url field as id', () => {
    setDocument(`<html><body>
      <script type="application/ld+json">{"url":"https://example.com/page"}</script>
    </body></html>`);
    expect(extractIdsFromSchema(document)).toEqual([]);
  });
});
