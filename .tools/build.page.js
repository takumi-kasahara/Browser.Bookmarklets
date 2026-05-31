#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escape } from '../src/modules/HtmlExtensions.js';
(() => {
  const rootDir = getRootDir();
  const distRoot = path.join(rootDir, 'dist');
  const outputPath = path.join(rootDir, 'pages', 'Bookmarklets.html');
  const bookmarklets = collectBookmarklets(distRoot);
  fs.writeFileSync(
    outputPath,
    generate(bookmarklets),
    'utf-8',
  );
  console.debug('created:', outputPath);

  function getRootDir() {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(currentDir, '..');
  }
  /**
   * @param {string} dir
   */
  function collectBookmarklets(dir) {
    const bookmarklets = [];
    const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith('.min.js')) continue;
      const absPath = path.join(file.parentPath ?? file.path, file.name);
      const relPath = path.relative(dir, absPath);
      const code = fs.readFileSync(absPath, 'utf-8');
      bookmarklets.push({
        name: computeEntryName(relPath),
        path: relPath,
        href: `javascript:${encodeURIComponent(code.trim())}`,
      });
    }
    return bookmarklets.sort((a, b) => {
      const aHasFolder = a.path.includes(path.sep) ? 1 : 0;
      const bHasFolder = b.path.includes(path.sep) ? 1 : 0;
      if (aHasFolder !== bHasFolder)
        return aHasFolder - bHasFolder;

      return a.path.localeCompare(b.path);
    });
  }
  /**
   * @param {string} relPath
   */
  function computeEntryName(relPath) {
    return relPath
      .replace(/\.min\.js$/, '')
      .replace(/\\/g, '/')
      .replace(/\//g, '>');
  }
  /**
   * @param {{name: string, href: string}[]} bookmarklets
   */
  function generate(bookmarklets) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Bookmarklets</title>
</head>
<body>
<ul>
${bookmarklets.map(b => `<li>
<a href="${b.href}">
${escape(b.name)}
</a>
</li>`).join('\n')}
</ul>
</body>
</html>
`;
  }
})();
