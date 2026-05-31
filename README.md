# Browser Bookmarklets

A collection of utility bookmarklets for modern browsers (especially Firefox) that extend web browsing capabilities with quick access to common tasks like copying URLs, searching, and translating web content.

## 📦 Features

### Copy Utilities

- Copy Host: Extract and copy the hostname pattern (with wildcard support for subdomains)
- Copy Link: Copy the current page URL
- Copy Title: Copy the current page title
- Copy ID: Extract and copy element IDs from the page
- Copy Table: Copy table data in a structured format

### Search Utilities

- Search on DuckDuckGo: Open DuckDuckGo search with selected text
- Search on Twitter for host: Search for domain mentions on Twitter
- Search on Twitter for url: Search for URL mentions on Twitter

### Content Utilities

- Share on Twitter: Share the current page on Twitter
- Translate Auto: Auto-detect language and translate
- Translate by Google: Translate using Google Translate
- Open: Open links with various protocols

### Developer Tools

- Chrome userChrome.js: Firefox user chrome customizations
- Helper utilities: Tools for collecting links, inspecting attributes, and watching mutations

## 🛠️ Project Structure

``` plaintext
src/
├── modules/                     # Reusable utility functions
│   ├── DocumentExtensions.js   # DOM manipulation helpers
│   ├── HtmlExtensions.js       # HTML utilities
│   ├── JsonExtensions.js       # JSON utilities
│   ├── NavigatorExtensions.js  # Navigator API extensions
│   └── WindowExtensions.js     # Window utility functions
└── scripts/                     # Bookmarklet scripts
    ├── Copy*.js                 # Copy utilities
    ├── Search*.js               # Search utilities
    ├── Translate*.js            # Translation tools
    └── console/                 # Firefox-specific scripts
dist/                               # Built and minified bookmarklets (generated)
pages/                              # Installation and distribution pages
```

## 🚀 Development

### Prerequisites

- Node.js with npm

### Installation

``` bash
npm install
```

### Build

``` bash
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
