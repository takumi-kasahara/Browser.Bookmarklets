import { getRubyPairs } from '../modules/HtmlExtensions.js';

(async () => {
  if (!/^https?:$/.test(location.protocol)) return;

  for (const ruby of document.querySelectorAll('ruby')) {
    const pairs = getRubyPairs(ruby);
    if (!pairs) continue;

    const replacement = document.createElement('span');
    replacement.textContent = pairs
      .map(([baseText, readingText]) => `｛${baseText}｜${readingText}｝`)
      .join('');
    ruby.replaceWith(replacement);
  }
})();
