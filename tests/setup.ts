/**
 * Vitest setup for jsdom environment.
 *
 * jsdom does not implement every browser API the bookmarklets rely on.
 * This file installs minimal polyfills/mocks so module code can run under test.
 */

// jsdom lacks ClipboardItem (used by NavigatorExtensions.copyToClipboard).
if (typeof globalThis.ClipboardItem === 'undefined') {
  class ClipboardItemPolyfill {
    readonly types: ReadonlyArray<string>;
    readonly items: Record<string, Blob>;
    constructor(items: Record<string, Blob>) {
      this.items = items;
      this.types = Object.freeze(Object.keys(items));
    }
  }
  // @ts-expect-error - assigning polyfill to global
  globalThis.ClipboardItem = ClipboardItemPolyfill;
}

// jsdom lacks navigator.clipboard.writeText / write.
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async (_text: string): Promise<void> => {
        void _text;
      },
      write: async (_items: ClipboardItem[]): Promise<void> => {
        void _items;
      },
    },
  });
}

// jsdom lacks Element.setHTML; fall back to textContent so createAnchorElement works.
if (typeof HTMLElement.prototype.setHTML !== 'function') {
  HTMLElement.prototype.setHTML = function setHTML(text: string) {
    this.textContent = text;
  };
}

// jsdom does not compute HTMLAnchorElement.origin from href; derive it so
// DocumentExtensions.collectAnchorElements can filter by origin under test.
if (
  typeof Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'origin')
    ?.get !== 'function'
) {
  Object.defineProperty(HTMLAnchorElement.prototype, 'origin', {
    configurable: true,
    get() {
      try {
        return new URL(this.href).origin;
      }
      catch {
        return '';
      }
    },
  });
}

// jsdom lacks Range.intersectsNode; emulate it by checking whether the node
// overlaps the range's start/end container boundaries.
if (typeof Range.prototype.intersectsNode !== 'function') {
  Range.prototype.intersectsNode = function intersectsNode(
    node: Node,
  ): boolean {
    const compare = (a: Node, b: Node): number => {
      const position = a.compareDocumentPosition(b);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    };

    const start = this.startContainer;
    const end = this.endContainer;
    return compare(node, end) <= 0 && compare(node, start) >= 0;
  };
}
