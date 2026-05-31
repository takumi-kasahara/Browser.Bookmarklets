---
description: 'JavaScript coding conventions for bookmarklet source and build scripts'
applyTo: 'src/**/*.js, .tools/**/*.js'
---

# JavaScript Coding Conventions

Apply these conventions when writing new bookmarklets or modifying existing code.

## Compatibility Requirements

1. Use latest ECMAScript features. Target modern JavaScript syntax.
2. Target latest Firefox.
3. Avoid deprecated APIs. Use current Web APIs only.
4. Use ES module imports/exports.

## Variable Declarations

1. Start variable names with nouns (for example: `elementCount`, `pageUrl`, `userData`).
2. Use `const` by default. Use `let` only when reassignment is necessary.
3. Minimize scope. Declare variables as close to usage as possible.
4. Avoid reassignment when possible.

## Function Definitions

1. Start function names with verbs (for example: `copyToClipboard()`, `fetchData()`, `validateInput()`).
2. Use `function` declarations and place helper functions at the end of the file.
3. Prefer pure functions with minimal side effects.
4. Add JSDoc type hints for parameters.
5. Let VS Code infer return types.

### Example

``` javascript
/**
 * @param {string} url
 * @param {string} text
 */
export function createAnchorElement(url, text) {
	const a = document.createElement('a');
	a.href = url;
	a.rel = 'noreferrer';
	a.target = '_blank';
	a.setHTML(text ? text : url);
	return a.outerHTML;
}
```

## Array Operations

1. Use `Array.prototype.at()` for array element access.
2. Use `for...of` for iteration instead of index-based loops.

### Example

``` javascript
// Good
for (const item of items) {
	console.log(item);
}
// Bad
for (let i = 0; i < items.length; i++) {
	console.log(items[i]);
}
```
