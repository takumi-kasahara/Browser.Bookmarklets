import { describe, expect, it } from 'vitest';
import { fromASIN, fromISBN, isNotEmptyString } from './IdentifierExtensions.js';

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
