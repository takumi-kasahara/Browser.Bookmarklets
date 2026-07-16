import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { extractUrlsFromSchema } from '../modules/SchemaExtensions.js';
import { extractUrlsFromSelection } from '../modules/SelectionExtensions.js';
(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const urls = Array.from(
    new Set([
      ...extractUrlsFromSelection(document),
      ...extractUrlsFromSchema(document),
    ]))
    .sort(new Intl.Collator(undefined, { numeric: true }).compare);
  if (urls.length > 0) await copyToClipboard(`Copy ${urls.length} URL(s):`, urls.join('\n'));
  else await copyToClipboard(`Copy ${urls.length} URL(s):`, location.href);
})();
