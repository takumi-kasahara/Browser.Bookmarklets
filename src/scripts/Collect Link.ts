import { collectAnchorElements } from '../modules/DocumentExtensions.js';
import { isNotEmptyString } from '../modules/IdentifierExtensions.js';
import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { extractUrlsFromSchema } from '../modules/SchemaExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const urls = Array.from(
    new Set([
      ...extractUrlsFromSchema(document),
      ...collectAnchorElements(document.body, location.origin, true).map(
        e => e.href,
      ),
      ...collectAnchorElements(document.body, location.origin, false).map(
        e => e.href,
      ),
    ]),
  )
    .filter(isNotEmptyString)
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
