import { beforeEach, describe, expect, it } from 'vitest';
import { extractUrlsFromSelection } from '../src/modules/SelectionExtensions.js';

describe('extractUrlsFromSelection', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><body></body></html>';
    window.getSelection()?.removeAllRanges();
  });

  it('returns empty array when nothing selected', () => {
    expect(extractUrlsFromSelection(document)).toEqual([]);
  });

  it('collects anchor hrefs within selection', () => {
    document.body.innerHTML = `
      <div id="container">
        <a href="https://example.com/a">A</a>
        <a href="https://example.com/b">B</a>
        <p>text</p>
      </div>`;
    const container = document.getElementById('container')!;
    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    expect(extractUrlsFromSelection(document).sort()).toEqual([
      'https://example.com/a',
      'https://example.com/b',
    ]);
  });

  it('ignores anchors outside selection', () => {
    document.body.innerHTML = `
      <a href="https://example.com/outside">Outside</a>
      <div id="container">
        <a href="https://example.com/inside">Inside</a>
      </div>`;
    const container = document.getElementById('container')!;
    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    expect(extractUrlsFromSelection(document)).toEqual([
      'https://example.com/inside',
    ]);
  });
});

describe('extractUrlsFromSelectionText', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><body></body></html>';
    window.getSelection()?.removeAllRanges();
  });

  it('returns empty array when nothing selected', () => {
    expect(extractUrlsFromSelection(document)).toEqual([]);
  });

  it('converts selected ASIN text to Amazon URL', () => {
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(document.body);
    selection.addRange(range);
    selection.toString = () => 'B0ABCDEFGH';
    expect(extractUrlsFromSelection(document)).toEqual([
      'https://www.amazon.co.jp/dp/B0ABCDEFGH',
    ]);
  });

  it('converts selected ISBN text to Calil URL', () => {
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(document.body);
    selection.addRange(range);
    selection.toString = () => '9781234567890';
    expect(extractUrlsFromSelection(document)).toEqual([
      'https://calil.jp/book/9781234567890',
    ]);
  });

  it('returns empty array for non-ASIN/ISBN text', () => {
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(document.body);
    selection.addRange(range);
    selection.toString = () => 'hello world';
    expect(extractUrlsFromSelection(document)).toEqual([]);
  });
});
