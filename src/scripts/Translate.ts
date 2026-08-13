import { from, is, tryFetch } from '../modules/WindowExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const url = await translateUrl();
  if (url && url.href !== location.href) location.assign(url);

  async function translateUrl(): Promise<URL | null> {
    const path = location.pathname.split('/');
    const url = new URL(location.href);
    if (is('translate.goog')) {
      const e = document.querySelector('[data-source-url]');
      return e instanceof HTMLElement && e.dataset.sourceUrl
        ? new URL(e.dataset.sourceUrl)
        : null;
    }
    const alt_ja = alt('ja');
    if (!lang('ja') && alt_ja) return to(alt_ja);
    const alt_en = alt('en');
    if (!lang('en') && alt_en) return to(alt_en);
    if (is('android.com') || is('google.com') || is('google')) {
      if (!lang('ja') && url.searchParams.get('hl') !== 'ja') return replaceParam('hl', 'ja');
      if (!lang('en') && url.searchParams.get('hl') !== 'en') return replaceParam('hl', 'en');
    }
    if (is('steampowered.com')) {
      if (!lang('ja') && url.searchParams.get('l') !== 'japanese') return replaceParam('l', 'japanese');
      if (!lang('en') && url.searchParams.get('l') !== 'english') return replaceParam('l', 'english');
    }
    if (url.searchParams.has('lang')) {
      if (!lang('ja') && url.searchParams.get('lang') !== 'ja') return replaceParam('lang', 'ja');
      if (!lang('en') && url.searchParams.get('lang') !== 'en') return replaceParam('lang', 'en');
    }
    if (url.searchParams.has('locale')) {
      if (!lang('ja') && url.searchParams.get('locale') !== 'ja') return replaceParam('locale', 'ja');
      if (!lang('en') && url.searchParams.get('locale') !== 'en') return replaceParam('locale', 'en');
    }
    const LCID_en = /^en(?:-[A-Za-z0-9]{2,})?$/i;
    if (of(LCID_en) > -1) return replacePath(of(LCID_en), 'ja', 'ja-jp', 'ja-JP', 'ja_jp');
    const LCID_ja = /^ja(?:-[A-Za-z0-9]{2,})?$/i;
    if (of(LCID_ja) > -1) return replacePath(of(LCID_ja), 'en', 'en-us', 'en-US', 'en_us');
    if (!lang('ja')) return null;
    return null;

    /**
     * @param {string} tag
     */
    function lang(tag: string): HTMLHtmlElement | null {
      const e = document.querySelector(`html[lang|="${tag}"]`);
      return e instanceof HTMLHtmlElement ? e : null;
    }
    /**
     * @param {string} tag
     */
    function alt(tag: string): HTMLAnchorElement | HTMLLinkElement | null {
      if (is('wikipedia.org')) {
        const e = document.querySelector(`a[hreflang|="${tag}"]`);
        return e instanceof HTMLAnchorElement ? e : null;
      }
      if (tag === 'en') {
        const e = document.querySelector('link[rel="alternate"][hreflang="x-default"]')
          ?? document.querySelector('link[rel="alternate"][hreflang="en-us"]')
          ?? document.querySelector('link[rel="alternate"][hreflang="en"]');
        return e instanceof HTMLLinkElement ? e : null;
      }
      const e = document.querySelector(`link[rel="alternate"][hreflang|="${tag}"]`);
      return e instanceof HTMLLinkElement ? e : null;
    }
    /**
     * @param {RegExp} regex
     */
    function of(regex: RegExp): number {
      return path.findIndex(segment => regex.test(segment));
    }
    /**
     * @param {URL | HTMLAnchorElement | HTMLLinkElement} urlLike
     */
    async function to(urlLike: URL | HTMLAnchorElement | HTMLLinkElement): Promise<URL | null> {
      const url = from(urlLike);
      if (location.origin !== url.origin) return url;
      const result = await tryFetch(url);
      return result.exists ? new URL(result.url) : null;
    }
    /**
     * @param {string} name
     * @param {string} value
     */
    async function replaceParam(name: string, value: string): Promise<URL | null> {
      url.searchParams.set(name, value);
      const result = await tryFetch(url);
      return result.exists ? new URL(result.url) : null;
    }
    /**
     * @param {number} index
     * @param {...string} replaceValues
     */
    async function replacePath(index: number, ...replaceValues: string[]): Promise<URL | null> {
      for (const replaceValue of replaceValues) {
        path[index] = replaceValue;
        url.pathname = path.join('/');
        const result = await tryFetch(url);
        if (result.exists) return new URL(result.url);
      }
      return null;
    }
  }
})();
