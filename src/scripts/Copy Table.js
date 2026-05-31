import { copyToClipboard } from '../modules/NavigatorExtensions.js';
(async () => {
  const ts = Array.from(document.querySelectorAll('table'));
  if (ts.length > 0)
    await copyToClipboard(`Copy ${ts.length} Table(s):`, new ClipboardItem({
      'text/plain': new Blob([ts.map(t => t.outerText).join('\n')]),
      'text/html': new Blob([ts.map(t => t.outerHTML).join('\n')]),
    }));
  else console.warn('Table not found.');
})();
