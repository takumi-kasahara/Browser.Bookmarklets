import {
  collectAnchorElements,
  createAnchorElement,
} from '../modules/DocumentExtensions.js';
import { copyToClipboard } from '../modules/NavigatorExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const COLLECTOR = Symbol.for('__CollectUrlObserver__');
  const COLLECTED = Symbol.for('__CollectedUrls__');
  const state = window as unknown as Window & { [key: symbol]: unknown };
  const collectedState = state[COLLECTED];
  const collectorState = state[COLLECTOR];
  if (
    collectedState instanceof Set
    && collectorState instanceof MutationObserver
  ) {
    if (!window.confirm('Stop collecting?')) return;
    collectorState.disconnect();
    state[COLLECTOR] = null;
    const collection = collectedState;
    const urls = Array.from(collection)
      .filter((a): a is HTMLAnchorElement => a instanceof HTMLAnchorElement)
      .map(a => a.href)
      .sort(new Intl.Collator(undefined, { numeric: true }).compare);
    const anchors = Array.from(collection)
      .filter((a): a is HTMLAnchorElement => a instanceof HTMLAnchorElement)
      .map(a => createAnchorElement(a.href, a.innerHTML.trim()));
    if (urls.length > 0)
      await copyToClipboard(
        `Copy ${urls.length} URL(s):`,
        new ClipboardItem({
          'text/plain': new Blob([urls.join('\n')]),
          'text/html': new Blob([anchors.join('<br>')]),
        }),
      );
  }
  else {
    if (!window.confirm('Start collecting cross-origin links?')) return;
    const collection = new Set(
      collectAnchorElements(document.body, location.origin, false),
    );
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations)
        switch (mutation.type) {
          case 'childList':
            for (const node of mutation.addedNodes)
              if (node instanceof HTMLElement) {
                if (
                  node instanceof HTMLAnchorElement
                  && node.origin !== location.origin
                )
                  collection.add(node);
                else
                  for (const a of collectAnchorElements(
                    node,
                    location.origin,
                    false,
                  ))
                    collection.add(a);
              }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    state[COLLECTED] = collection;
    state[COLLECTOR] = observer;
  }
})();
