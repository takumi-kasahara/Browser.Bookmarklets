#!/usr/bin/env node
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import { getRootDir } from './utils.ts';

interface Bookmarklet {
  name: string;
  href: string;
}

(async () => {
  const rootDir = getRootDir();
  const distRoot = path.join(rootDir, 'dist');
  const outputPath = path.join(rootDir, 'pages', 'Bookmarklets.html');
  const bookmarklets = collectBookmarklets(distRoot);
  const config = await resolveConfig(outputPath);
  const code = await format(generate(bookmarklets), {
    ...config,
    filepath: outputPath,
    parser: 'html',
  });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, code, 'utf-8');
  console.debug('created:', outputPath);

  function collectBookmarklets(dir: string): Bookmarklet[] {
    const bookmarklets: Bookmarklet[] = [];
    const files = fs.readdirSync(dir, { recursive: true, withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith('.min.js')) continue;
      const absPath = path.join(file.parentPath, file.name);
      const relPath = path.relative(dir, absPath);
      const code = fs.readFileSync(absPath, 'utf-8');
      bookmarklets.push({
        name: computeEntryName(relPath),
        href: `javascript:${encodeURIComponent(code.trim())}`,
      });
    }
    return bookmarklets.sort((a: Bookmarklet, b: Bookmarklet): number =>
      a.name.localeCompare(b.name),
    );
  }
  function computeEntryName(relPath: string): string {
    return relPath.replace(/\.min\.js$/, '');
  }
  function generate(bookmarklets: Bookmarklet[]): string {
    const dom = new JSDOM();
    const { document } = dom.window;
    const doctype = document.implementation.createDocumentType('html', '', '');
    document.insertBefore(doctype, document.documentElement);
    document.documentElement.lang = 'en';

    const meta = document.createElement('meta');
    meta.setAttribute('charset', 'UTF-8');
    document.head.append(meta);

    const title = document.createElement('title');
    title.textContent = 'Bookmarklets';
    document.head.append(title);

    const list = document.createElement('ul');
    for (const bookmarklet of bookmarklets) {
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.setAttribute('href', bookmarklet.href);
      anchor.textContent = bookmarklet.name;
      item.append(anchor);
      list.append(item);
    }
    document.body.append(list);

    return dom.serialize();
  }
})();
