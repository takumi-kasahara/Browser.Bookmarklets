import { copyToClipboard } from '../modules/NavigatorExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const table = document.querySelector('table');
  if (table instanceof HTMLTableElement) {
    const text = table.outerText;
    const html = table.outerHTML;
    await copyToClipboard(
      `Copy table:`,
      new ClipboardItem({
        'text/plain': new Blob([text]),
        'text/html': new Blob([html]),
      }),
    );
  }
  else console.warn('Table not found.');
})();
