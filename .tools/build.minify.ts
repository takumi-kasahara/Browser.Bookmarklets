#!/usr/bin/env node
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

(async () => {
  const rootDir = getRootDir();
  const srcDir = path.join(rootDir, 'src', 'scripts');
  const outDir = path.join(rootDir, 'dist');
  if (fs.existsSync(outDir))
    fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(srcDir, { recursive: true, withFileTypes: true })
    .filter((x: fs.Dirent): boolean => x.isFile())
    .map((x: fs.Dirent): string => path.join(x.parentPath, x.name))
    .filter((x: string): boolean => !/\.test\.[cm]?[jt]sx?$/.test(x));
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
    const distDir = path.join(path.dirname(file).replace(srcDir, outDir));
    if (distDir !== outDir)
      fs.mkdirSync(path.join(distDir), { recursive: true });

    const fileName = `${path.basename(file, path.extname(file))}.min.js`;
    console.debug('create:', fileName);
    fs.writeFileSync(
      path.join(distDir, fileName),
      bundled.outputFiles.at(0)!.text,
      'utf-8',
    );
  }

  function getRootDir(): string {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(currentDir, '..');
  }
})();
