import { is } from '../modules/WindowExtensions.js';

(() => {
  const text = document.getSelection?.()?.toString().trim() ?? '';
  if (text) {
    const tl = /[\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Han}]/u.test(text)
      ? 'en'
      : 'ja';
    window.open(
      `https://translate.google.com/?sl=auto&tl=${tl}&text=${encodeURIComponent(text)}&op=translate`,
      '_blank',
      'noreferrer',
    );
  }
  else if (location.hostname === 'translate.google.com') return;
  else if (is('translate.goog')) {
    const e = document.querySelector('[data-source-url]');
    if (e instanceof HTMLElement && e.dataset.sourceUrl)
      location.href = e.dataset.sourceUrl;
  }
  else if (!/https?:/.test(location.protocol))
    location.href = 'https://translate.google.com/?sl=auto&tl=ja&op=translate';
  else if (!document.querySelector('html[lang|=ja]'))
    window.open(
      `https://translate.google.com/translate?sl=auto&tl=ja&u=${location.href}`,
      '_blank',
      'noreferrer',
    );
})();
