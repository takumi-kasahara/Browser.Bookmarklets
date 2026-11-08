import { copyToClipboard } from '../modules/NavigatorExtensions';

(async () => {
  if (!/^https?:$/.test(location.protocol) || location.protocol === 'file:')
    return;

  const title = document.title.trim();
  if (title) await copyToClipboard(`Copy title:`, title);
  else console.warn('Title not found.');
})();
