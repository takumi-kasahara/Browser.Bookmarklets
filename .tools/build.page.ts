#!/usr/bin/env node
import { ESLint } from 'eslint';
import { JSDOM } from 'jsdom';
import fs from 'node:fs/promises';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import { getRootDir } from './utils.ts';

interface Bookmarklet {
  name: string;
  href: string;
}

(async () => {
  const rootDir = getRootDir();
  const binRoot = path.join(rootDir, 'bin');
  const outputPath = path.join(rootDir, 'pages', 'Bookmarklets.html');
  const bookmarklets = await collectBookmarklets(binRoot);
  const config = await resolveConfig(outputPath);
  const generated = await format(generate(bookmarklets), {
    ...config,
    filepath: outputPath,
    parser: 'html',
  });
  const eslint = new ESLint({ cwd: rootDir, fix: true });
  const eslintResults = await eslint.lintText(generated, {
    filePath: outputPath,
  });
  const eslintResult = eslintResults[0];
  if (eslintResult && eslintResult.errorCount > 0) {
    console.error(eslintResult.messages);
    throw new Error('ESLint failed for generated page');
  }
  const code = eslintResult?.output ?? generated;
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, code, 'utf-8');
  console.debug('created:', outputPath);

  async function collectBookmarklets(dir: string): Promise<Bookmarklet[]> {
    const bookmarklets: Bookmarklet[] = [];
    const files = await fs.readdir(dir, {
      recursive: true,
      withFileTypes: true,
    });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith('.min.js')) continue;
      const absPath = path.join(file.parentPath, file.name);
      const relPath = path.relative(dir, absPath);
      const code = await fs.readFile(absPath, 'utf-8');
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
