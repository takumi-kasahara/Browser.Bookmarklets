import { describe, expect, it } from 'vitest';
import { extractAmazonAsin, extractYouTubePlaylistId, extractYouTubeVideoId, fromASIN, fromISBN, isNotEmptyString } from './IdentifierExtensions.js';

describe('isNotEmptyString', () => {
  it('returns true for non-empty string', () => {
    expect(isNotEmptyString('abc')).toBe(true);
    expect(isNotEmptyString(' ')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isNotEmptyString('')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isNotEmptyString(null)).toBe(false);
    expect(isNotEmptyString(undefined)).toBe(false);
    expect(isNotEmptyString(123)).toBe(false);
    expect(isNotEmptyString({})).toBe(false);
    expect(isNotEmptyString([])).toBe(false);
  });
});

describe('fromASIN', () => {
  it('returns Amazon URL for valid 10-char ASIN', () => {
    expect(fromASIN('1234567890')).toBe('https://www.amazon.co.jp/dp/1234567890');
    expect(fromASIN('B0ABCDEFGH')).toBe('https://www.amazon.co.jp/dp/B0ABCDEFGH');
  });

  it('trims and uppercases input', () => {
    expect(fromASIN(' 123456789x ')).toBe('https://www.amazon.co.jp/dp/123456789X');
  });

  it('returns null for invalid ASIN', () => {
    expect(fromASIN('')).toBeNull();
    expect(fromASIN(null)).toBeNull();
    expect(fromASIN(undefined)).toBeNull();
    expect(fromASIN('123456789')).toBeNull();
    expect(fromASIN('12345678901')).toBeNull();
    expect(fromASIN('123456789A1')).toBeNull();
  });
});

describe('extractAmazonAsin', () => {
  it('returns ASIN from rufus-view-context input', () => {
    const document = new DOMParser().parseFromString(
      '<input id="rufus-view-context" value="{&quot;asin&quot;:&quot;B012345678&quot;}">',
      'text/html');
    expect(extractAmazonAsin(document)).toBe('B012345678');
  });

  it('returns null when rufus-view-context has no asin', () => {
    const document = new DOMParser().parseFromString(
      '<input id="rufus-view-context" value="{}">',
      'text/html');
    expect(extractAmazonAsin(document)).toBeNull();
  });

  it('returns ASIN from /dp/:asin pathname', () => {
    const document = new DOMParser().parseFromString('', 'text/html');
    expect(extractAmazonAsin(document, 'https://www.amazon.co.jp/dp/B012345678')).toBe('B012345678');
  });

  it('returns ASIN from /gp/product/:asin pathname', () => {
    const document = new DOMParser().parseFromString('', 'text/html');
    expect(extractAmazonAsin(document, 'https://www.amazon.co.jp/gp/product/B012345678')).toBe('B012345678');
  });

  it('returns null when no ASIN is found', () => {
    const document = new DOMParser().parseFromString('', 'text/html');
    expect(extractAmazonAsin(document, 'https://www.amazon.co.jp/')).toBeNull();
  });
});

describe('extractYouTubeVideoId', () => {
  it('returns video id from youtu.be', () => {
    expect(extractYouTubeVideoId('https://youtu.be/abc123')).toBe('abc123');
  });

  it('returns video id from watch?v=', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=abc123')).toBe('abc123');
    expect(extractYouTubeVideoId('https://m.youtube.com/watch?v=abc123')).toBe('abc123');
  });

  it('returns video id from shorts', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/shorts/abc123')).toBe('abc123');
    expect(extractYouTubeVideoId('https://m.youtube.com/shorts/abc123')).toBe('abc123');
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
  it('returns playlist id from list=', () => {
    expect(extractYouTubePlaylistId('https://www.youtube.com/watch?v=abc123&list=PLabc')).toBe('PLabc');
    expect(extractYouTubePlaylistId('https://m.youtube.com/watch?v=abc123&list=PLabc')).toBe('PLabc');
  });

  it('returns null for non-YouTube URLs', () => {
    expect(extractYouTubePlaylistId('https://example.com/')).toBeNull();
  });

  it('returns null when playlist id is missing', () => {
    expect(extractYouTubePlaylistId('https://www.youtube.com/watch?v=abc123')).toBeNull();
  });
});

describe('fromISBN', () => {
  it('returns Calil URL for valid 10-digit ISBN', () => {
    expect(fromISBN('1234567890')).toBe('https://calil.jp/book/1234567890');
  });

  it('returns Calil URL for valid 10-digit ISBN with X check digit', () => {
    expect(fromISBN('123456789X')).toBe('https://calil.jp/book/123456789X');
  });

  it('returns Calil URL for valid 13-digit ISBN', () => {
    expect(fromISBN('9781234567890')).toBe('https://calil.jp/book/9781234567890');
  });

  it('strips hyphens and whitespace', () => {
    expect(fromISBN('978-1-234-56789-0')).toBe('https://calil.jp/book/9781234567890');
    expect(fromISBN('978 1 234 56789 0')).toBe('https://calil.jp/book/9781234567890');
  });

  it('uppercases input', () => {
    expect(fromISBN('978123456x')).toBe('https://calil.jp/book/978123456X');
  });

  it('returns null for invalid ISBN', () => {
    expect(fromISBN('')).toBeNull();
    expect(fromISBN(null)).toBeNull();
    expect(fromISBN(undefined)).toBeNull();
    expect(fromISBN('123456789')).toBeNull();
    expect(fromISBN('978123456789')).toBeNull();
    expect(fromISBN('ABCDEFGHIJ')).toBeNull();
  });
});
