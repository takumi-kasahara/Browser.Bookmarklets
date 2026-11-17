#!/usr/bin/env node
import { build } from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getRootDir } from './utils.ts';

(async () => {
  const rootDir = getRootDir();
  const srcDir = path.join(rootDir, 'src', 'scripts');
  const outDir = path.join(rootDir, 'bin');
  await fs.mkdir(outDir, { recursive: true });
  for (const entry of await fs.readdir(outDir)) {
    if (entry === '.gitignore') continue;
    await fs.rm(path.join(outDir, entry), { recursive: true, force: true });
  }

  const files = (
    await fs.readdir(srcDir, { recursive: true, withFileTypes: true })
  )
    .filter(x => x.isFile())
    .map((x): string => path.join(x.parentPath, x.name))
    .filter(x => !/\.test\.[cm]?[jt]sx?$/.test(x));
  for (const file of files) {
    const bundled = await build({
      entryPoints: [file],
      bundle: true,
      minify: true,
      write: false,
      legalComments: 'none',
      format: 'iife',
      target: 'esnext',
      platform: 'browser',
    });
    if (!bundled || !bundled.outputFiles?.at(0)?.text) continue;
    const binDir = path.join(path.dirname(file).replace(srcDir, outDir));
    if (binDir !== outDir)
      await fs.mkdir(path.join(binDir), { recursive: true });

    const fileName = `${path.basename(file, path.extname(file))}.min.js`;
    console.debug('create:', fileName);
    await fs.writeFile(
      path.join(binDir, fileName),
      bundled.outputFiles.at(0)?.text as string,
      'utf-8',
    );
  }
})();
