export {};

declare global {
  interface Element {
    /** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML} */
    setHTML(html: string, options?: { sanitizer?: Sanitizer }): void;
  }
}
