import { is } from '../modules/WindowExtensions.js';

(() => {
  if (!/https?:/.test(location.protocol)) return;
  if (is('translate.google.com')) return;

  const selectedText = document.getSelection?.()?.toString().trim() ?? '';
  if (selectedText) {
    const tl = /[\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Han}]/u.test(selectedText);
    window.open(`https://translate.google.com/?sl=auto&tl=${tl}&text=${encodeURIComponent(selectedText)}&op=translate`, '_blank', 'noreferrer');
    return;
  }
  if (is('translate.goog')) {
    const e = document.querySelector('[data-source-url]');
    if (e instanceof HTMLElement && e.dataset.sourceUrl)
      window.open(e.dataset.sourceUrl, '_blank', 'noreferrer');
  }
  window.open(`https://translate.google.com/translate?sl=auto&tl=ja&u=${location.href}`, '_blank', 'noreferrer');
})();
