import { copyToClipboard } from '../modules/NavigatorExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const title = document.title.trim();
  if (title) await copyToClipboard(`Copy title:`, title);
  else console.warn('Title not found.');
})();
