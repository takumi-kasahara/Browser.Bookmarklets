import { copyToClipboard } from '../modules/NavigatorExtensions';

(async () => {
  if (!/^https?:$/.test(location.protocol) || location.protocol === 'file:')
    return;

  const tables = Array.from(document.querySelectorAll('table'));
  if (tables.length === 0) {
    console.warn('Table not found.');
    return;
  }
  const text = tables
    .filter(e => e instanceof HTMLTableElement)
    .map(e => e.outerText)
    .join('\n');
  const html = tables
    .filter(e => e instanceof HTMLTableElement)
    .map(e => e.outerHTML)
    .join('\n');
  await copyToClipboard(
    `Copy ${tables.length} Table(s):`,
    new ClipboardItem({
      'text/plain': new Blob([text]),
      'text/html': new Blob([html]),
    }),
  );
})();
