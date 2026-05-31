import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { createAnchorElement } from '../modules/DocumentExtensions.js';
(async () => {
  const browserWindow = /** @type {Window & { gBrowser?: { tabs?: Array<{ label?: string, canonicalUrl?: string }> } }} */ (window);
  const tabs = browserWindow.gBrowser?.tabs ?? [];
  const text = tabs.map(t => String(t.label ?? '')).join('\n');
  const html = tabs
    .map(t => createAnchorElement(String(t.canonicalUrl ?? ''), String(t.label ?? '').trim()))
    .join('<br>');
  await copyToClipboard(
    `Copy ${tabs.length} Link(s):`,
    new ClipboardItem({
      'text/plain': new Blob([text]),
      'text/html': new Blob([html]),
    }));
})();
