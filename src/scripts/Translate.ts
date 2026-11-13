import { from, is, tryFetch } from '../modules/WindowExtensions';

(async () => {
  if (!/^https?:$/.test(location.protocol)) return;

  const url = await translateUrl();
  if (url && url.href !== location.href) {
    console.info('Translated:', url);
    location.assign(url);
  }

  async function translateUrl(): Promise<URL | null> {
    const path = location.pathname.split('/');
    const url = new URL(location.href);
    if (is('translate.goog')) {
      const e = document.querySelector('[data-source-url]');
      return e instanceof HTMLElement && e.dataset.sourceUrl
        ? new URL(e.dataset.sourceUrl)
        : null;
    }
    const alt_ja = await alt('ja');
    if (!lang('ja') && alt_ja) return alt_ja;
    const alt_en = await alt('en');
    if (!lang('en') && alt_en) return alt_en;
    if (is('android.com') || is('google.com') || is('google')) {
      if (!lang('ja') && url.searchParams.get('hl') !== 'ja')
        return replaceParam('hl', 'ja');
      if (!lang('en') && url.searchParams.get('hl') !== 'en')
        return replaceParam('hl', 'en');
    }
    if (is('steampowered.com')) {
      if (!lang('ja') && url.searchParams.get('l') !== 'japanese')
        return replaceParam('l', 'japanese');
      if (!lang('en') && url.searchParams.get('l') !== 'english')
        return replaceParam('l', 'english');
    }
    if (url.searchParams.has('lang')) {
      if (!lang('ja') && url.searchParams.get('lang') !== 'ja')
        return replaceParam('lang', 'ja');
      if (!lang('en') && url.searchParams.get('lang') !== 'en')
        return replaceParam('lang', 'en');
    }
    if (url.searchParams.has('locale')) {
      if (!lang('ja') && url.searchParams.get('locale') !== 'ja')
        return replaceParam('locale', 'ja');
      if (!lang('en') && url.searchParams.get('locale') !== 'en')
        return replaceParam('locale', 'en');
    }
    const LCID_en = /^en(?:-[A-Za-z0-9]{2,})?$/i;
    const enIndex = of(LCID_en);
    if (enIndex > -1)
      return replacePath(enIndex, 'ja', 'ja-jp', 'ja-JP', 'ja_jp');
    const LCID_ja = /^ja(?:-[A-Za-z0-9]{2,})?$/i;
    const jaIndex = of(LCID_ja);
    if (jaIndex > -1) {
      const removed = await removePath(jaIndex);
      if (removed) return removed;
      return replacePath(jaIndex, 'en', 'en-us', 'en-US', 'en_us');
    }
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
    async function alt(tag: string): Promise<URL | null> {
      if (tag === 'en') {
        const es = [
          document.querySelector('link[rel="alternate"][hreflang="x-default"]'),
          document.querySelector('link[rel="alternate"][hreflang="en-us"]'),
          document.querySelector('link[rel="alternate"][hreflang="en"]'),
          ...Array.from(
            document.querySelectorAll('link[rel="alternate"][hreflang|="en"]'),
          ),
        ].filter(e => e instanceof HTMLLinkElement);
        for (const e of es) {
          if (from(e).origin !== location.origin) return new URL(e.href);
          const result = await tryFetch(e);
          if (result.exists) return new URL(result.url);
        }
      } else {
        const e = document.querySelector(
          `link[rel="alternate"][hreflang|="${tag}"]`,
        );
        if (e instanceof HTMLLinkElement) {
          if (from(e).origin !== location.origin) return new URL(e.href);
          const result = await tryFetch(e);
          if (result.exists) return new URL(result.url);
        }
      }
      const es = (
        tag === 'en'
          ? [
              document.querySelector('a[hreflang="en-us"]'),
              document.querySelector('a[hreflang="en"]'),
              ...Array.from(document.querySelectorAll('a[hreflang|=en]')),
            ]
          : Array.from(document.querySelectorAll(`a[hreflang|=${tag}]`))
      ).filter(e => e instanceof HTMLAnchorElement);
      for (const e of es) {
        if (from(e).origin !== location.origin) return new URL(e.href);
        const result = await tryFetch(e);
        if (result.exists) return new URL(result.url);
      }
      return null;
    }
    /**
     * @param {RegExp} regex
     */
    function of(regex: RegExp): number {
      return path.findIndex(segment => regex.test(segment));
    }
    /**
     * @param {string} name
     * @param {string} value
     */
    async function replaceParam(
      name: string,
      value: string,
    ): Promise<URL | null> {
      url.searchParams.set(name, value);
      const result = await tryFetch(url);
      return result.exists ? new URL(result.url) : null;
    }
    /**
     * @param {number} index
     */
    async function removePath(index: number): Promise<URL | null> {
      url.pathname = path.toSpliced(index, 1).join('/');
      const result = await tryFetch(url);
      return result.exists ? new URL(result.url) : null;
    }
    /**
     * @param {number} index
     * @param {...string} replaceValues
     */
    async function replacePath(
      index: number,
      ...replaceValues: string[]
    ): Promise<URL | null> {
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
