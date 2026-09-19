import { isNotEmptyString } from '../modules/IdentifierExtensions.js';
import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { extractUrlsFromSchema } from '../modules/SchemaExtensions.js';
import { extractUrlsFromSelection } from '../modules/SelectionExtensions.js';
import { equiv } from '../modules/WindowExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const urls = Array.from(
    new Set([
      ...extractUrlsFromSelection(document),
      ...extractUrlsFromSchema(document),
    ]),
  )
    .filter(isNotEmptyString)
    .filter(href => !equiv(location, href))
    .filter(href => {
      try {
        return /https?:/.test(new URL(href).protocol);
      }
      catch {
        return false;
      }
    })
    .sort(new Intl.Collator(undefined, { numeric: true }).compare);
  if (urls.length > 0)
    await copyToClipboard(`Copy ${urls.length} URL(s):`, urls.join('\n'));
})();
