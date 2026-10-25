import { createAnchorElement } from '../modules/DocumentExtensions';
import { copyToClipboard } from '../modules/NavigatorExtensions';

(async () => {
  if (!/^https?:$/.test(location.protocol)) return;

  const url = location.href;
  const title = document.title.trim();
  await copyToClipboard(
    `Copy link:`,
    new ClipboardItem({
      'text/plain': new Blob([`${title}\n${url}`]),
      'text/html': new Blob([createAnchorElement(url, title)]),
    }),
  );
})();
