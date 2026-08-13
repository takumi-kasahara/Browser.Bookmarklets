import { is } from '../modules/WindowExtensions.js';

(() => {
  const selectedText = document.getSelection?.()?.toString().trim() ?? '';
  if (selectedText) {
    const tl = /[\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Han}]/u.test(selectedText) ? 'en' : 'ja';
    window.open(`https://translate.google.com/?sl=auto&tl=${tl}&text=${encodeURIComponent(selectedText)}&op=translate`, '_blank', 'noreferrer');
  }
  else if (location.hostname === 'translate.google.com')
    return;
  else if (is('translate.goog'))
    return;
  else if (!/https?:/.test(location.protocol))
    window.open(`https://translate.google.com/?sl=auto&tl=ja&op=translate}`, '_blank', 'noreferrer');
  else if (!document.querySelector('html[lang|=ja]'))
    window.open(`https://translate.google.com/translate?sl=auto&tl=ja&u=${location.href}`, '_blank', 'noreferrer');
})();
