# Browser Bookmarklets

A collection of utility browser bookmarklets.

## ️ Project Structure

```plaintext
src/
├── modules/  # Reusable utility functions
├── scripts/  # Bookmarklet scripts
└── console/  # Firefox-specific scripts
bin/             # Built and minified bookmarklets (generated)
pages/           # Installation and distribution pages
```

## 📝 Installation

Drag and drop the bookmarklet links from the [installation page](./pages/Bookmarklets.html) to your browser's bookmarks bar.

## 🚀 Development

```bash
npm install
```

### Build

```bash
npm run build
```

### Output

- `bin/*.min.js`
  - Minified bookmarklets ready to use
- `pages/Bookmarklets.html`
  - Installation page with bookmarklet links

## ⚙️ Compatibility

- Target Environment: Latest Firefox
- JavaScript: Latest ECMAScript features
- Browser APIs: No deprecated APIs
- Protocols: Handles `file://`, `http://` and `https://` protocols

## 📄 License

See [LICENSE](LICENSE)
