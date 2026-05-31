import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { createAnchorElement } from '../modules/DocumentExtensions.js';
(async () => {
  if (/https?:/.test(location.protocol))
    await copyToClipboard(
      'Copy Link:',
      new ClipboardItem({
        'text/plain': new Blob([location.href]),
        'text/html': new Blob([createAnchorElement(location.href, document.title.trim())]),
      }));
})();
