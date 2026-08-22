import { createAnchorElement } from '../modules/DocumentExtensions.js';
import { copyToClipboard } from '../modules/NavigatorExtensions.js';

(async () => {
  const gBrowser = (
    window as unknown as Window & {
      gBrowser?: {
        tabs?: Array<{ label?: string; canonicalUrl?: string }>;
      };
    }
  ).gBrowser;
  if (!gBrowser?.tabs) return;

  const tabs = gBrowser.tabs;
  const urls = tabs
    .map(tab => tab.canonicalUrl)
    .filter((u): u is string => Boolean(u));
  const anchors = tabs
    .filter((tab): tab is { label?: string; canonicalUrl: string } =>
      Boolean(tab.canonicalUrl),
    )
    .map(tab =>
      createAnchorElement(tab.canonicalUrl, tab.label ?? tab.canonicalUrl),
    );
  if (urls.length > 0)
    await copyToClipboard(
      `Copy ${urls.length} URL(s):`,
      new ClipboardItem({
        'text/plain': new Blob([urls.join('\n')]),
        'text/html': new Blob([anchors.join('<br>')]),
      }),
    );
})();
