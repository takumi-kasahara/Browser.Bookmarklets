import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  extractAmazonAsin,
  extractYouTubePlaylistId,
  extractYouTubeVideoId,
  toAmazon,
  toCalil,
} from '../src/modules/IdentifierExtensions.js';

describe('toAmazon', () => {
  it('returns Amazon URL for valid 10-char ASIN', () => {
    expect(toAmazon('1234567890')).toBe(
      'https://www.amazon.co.jp/dp/1234567890',
    );
    expect(toAmazon('B0ABCDEFGH')).toBe(
      'https://www.amazon.co.jp/dp/B0ABCDEFGH',
    );
  });

  it('trims and uppercases input', () => {
    expect(toAmazon(' 123456789x ')).toBe(
      'https://www.amazon.co.jp/dp/123456789X',
    );
  });

  it('returns null for invalid ASIN', () => {
    expect(toAmazon('')).toBeNull();
    expect(toAmazon('123456789')).toBeNull();
    expect(toAmazon('12345678901')).toBeNull();
    expect(toAmazon('123456789A1')).toBeNull();
  });
});

describe('extractAmazonAsin', () => {
  it('returns ASIN from rufus-view-context input', () => {
    const document = new DOMParser().parseFromString(
      '<input id="rufus-view-context" value="{&quot;asin&quot;:&quot;B012345678&quot;}">',
      'text/html',
    );
    expect(extractAmazonAsin(document)).toBe('B012345678');
  });

  it('returns null when rufus-view-context has no asin', () => {
    const document = new DOMParser().parseFromString(
      '<input id="rufus-view-context" value="{}">',
      'text/html',
    );
    expect(extractAmazonAsin(document)).toBeNull();
  });

  it('returns ASIN from /dp/:asin pathname', () => {
    const document = new DOMParser().parseFromString('', 'text/html');
    expect(
      extractAmazonAsin(document, 'https://www.amazon.co.jp/dp/B012345678'),
    ).toBe('B012345678');
  });

  it('returns ASIN from /gp/product/:asin pathname', () => {
    const document = new DOMParser().parseFromString('', 'text/html');
    expect(
      extractAmazonAsin(
        document,
        'https://www.amazon.co.jp/gp/product/B012345678',
      ),
    ).toBe('B012345678');
  });

  it('returns null when no ASIN is found', () => {
    const document = new DOMParser().parseFromString('', 'text/html');
    expect(extractAmazonAsin(document, 'https://www.amazon.co.jp/')).toBeNull();
  });
});

describe('extractYouTubeVideoId', () => {
  beforeEach(() => {
    vi.stubGlobal('location', new URL('https://www.youtube.com/'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns video id from youtu.be', () => {
    expect(extractYouTubeVideoId('https://youtu.be/foo')).toBe('foo');
  });

  it('returns video id from watch?v=', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=foo')).toBe(
      'foo',
    );
    expect(extractYouTubeVideoId('https://m.youtube.com/watch?v=foo')).toBe(
      'foo',
    );
  });

  it('returns video id from shorts', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/shorts/foo')).toBe(
      'foo',
    );
    expect(extractYouTubeVideoId('https://m.youtube.com/shorts/foo')).toBe(
      'foo',
    );
  });

  it('returns null for non-YouTube URLs', () => {
    expect(extractYouTubeVideoId('https://example.com/')).toBeNull();
  });

  it('returns null when video id is missing', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch')).toBeNull();
    expect(extractYouTubeVideoId('https://www.youtube.com/shorts/')).toBeNull();
  });
});

describe('extractYouTubePlaylistId', () => {
  beforeEach(() => {
    vi.stubGlobal('location', new URL('https://www.youtube.com/'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns playlist id from list=', () => {
    expect(
      extractYouTubePlaylistId('https://www.youtube.com/watch?v=foo&list=bar'),
    ).toBe('bar');
    expect(
      extractYouTubePlaylistId('https://m.youtube.com/watch?v=foo&list=bar'),
    ).toBe('bar');
  });

  it('returns null for non-YouTube URLs', () => {
    expect(extractYouTubePlaylistId('https://example.com/')).toBeNull();
  });

  it('returns null when playlist id is missing', () => {
    expect(
      extractYouTubePlaylistId('https://www.youtube.com/watch?v=foo'),
    ).toBeNull();
  });
});

describe('toCalil', () => {
  it('returns Calil URL for valid 10-digit ISBN', () => {
    expect(toCalil('1234567890')).toBe('https://calil.jp/book/1234567890');
  });

  it('returns Calil URL for valid 10-digit ISBN with X check digit', () => {
    expect(toCalil('123456789X')).toBe('https://calil.jp/book/123456789X');
  });

  it('returns Calil URL for valid 13-digit ISBN', () => {
    expect(toCalil('9781234567890')).toBe(
      'https://calil.jp/book/9781234567890',
    );
  });

  it('strips hyphens and whitespace', () => {
    expect(toCalil('978-1-234-56789-0')).toBe(
      'https://calil.jp/book/9781234567890',
    );
    expect(toCalil('978 1 234 56789 0')).toBe(
      'https://calil.jp/book/9781234567890',
    );
  });

  it('uppercases input', () => {
    expect(toCalil('978123456x')).toBe('https://calil.jp/book/978123456X');
  });

  it('returns null for invalid ISBN', () => {
    expect(toCalil('')).toBeNull();
    expect(toCalil('123456789')).toBeNull();
    expect(toCalil('978123456789')).toBeNull();
    expect(toCalil('ABCDEFGHIJ')).toBeNull();
  });
});
