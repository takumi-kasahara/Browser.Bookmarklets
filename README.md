# Browser Bookmarklets

A collection of utility bookmarklets for modern browsers (especially Firefox) that extend web browsing capabilities with quick access to common tasks like copying URLs, searching, and translating web content.

## ️ Project Structure

```plaintext
src/
├── modules/  # Reusable utility functions
├── scripts/  # Bookmarklet scripts
└── console/  # Firefox-specific scripts
dist/            # Built and minified bookmarklets (generated)
pages/           # Installation and distribution pages
```

## 🚀 Development

### Prerequisites

- Node.js with npm

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

This runs both minification and page generation:

- `npm run build:minify` - Bundles and minifies bookmarklets using esbuild
- `npm run build:page` - Generates the installation page

### Output

- `dist/`
  - Minified bookmarklets ready to use
- `pages/Bookmarklets.html`
  - Installation page with bookmarklet links

## ⚙️ Compatibility

- Target Environment: Latest Firefox
- JavaScript: Latest ECMAScript features
- Browser APIs: No deprecated APIs
- Protocols: Handles both `http://` and `https://` protocols

## 📄 License

See [LICENSE](LICENSE)
