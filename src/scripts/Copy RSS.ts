import { createAnchorElement } from '../modules/DocumentExtensions.js';
import { copyToClipboard } from '../modules/NavigatorExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const links = Array.from(document.querySelectorAll('link'))
    .filter(e => e instanceof HTMLLinkElement)
    .filter(e => e.rel === 'alternate')
    .filter(e => e.type === 'application/atom+xml' || e.type === 'application/rss+xml');
  if (links.length > 0) {
    const urls = links.map(e => e.href);
    const anchors = links.map(e => createAnchorElement(e.href, e.title || e.href));
    await copyToClipboard(`Copy ${urls.length} RSS URL(s):`,
      new ClipboardItem({
        'text/plain': new Blob([urls.join('\n')]),
        'text/html': new Blob([anchors.join('<br>')]),
      }),
    );
  }
  else console.warn('RSS not found.');
})();
