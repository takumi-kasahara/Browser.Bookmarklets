import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @returns {string} the absolute path to the project root directory
 */
export function getRootDir(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, '..');
}
