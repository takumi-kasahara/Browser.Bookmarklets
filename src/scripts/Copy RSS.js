import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { createAnchorElement } from '../modules/DocumentExtensions.js';
(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const links = Array.from(document.getElementsByTagName('link'))
    .filter(x => x.type === 'application/atom+xml' || x.type === 'application/rss+xml')
    .filter(x => x.href);
  if (links.length > 0) {
    const text = links.map(x => x.href).join('\n');
    const html = links.map(x => createAnchorElement(x.href, x.getAttribute('title')?.trim() ?? x.href)).join('<br>');
    await copyToClipboard(
      `Copy ${links.length} Link(s):`,
      new ClipboardItem({
        'text/plain': new Blob([text]),
        'text/html': new Blob([html]),
      }));
  }
  else console.warn('RSS not found.');
})();
