import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await visit(path);
    else if (entry.name.endsWith('.js')) {
      const source = await readFile(path, 'utf8');
      const rewritten = source.replace(/(from\s+['"]|import\s*(?:\(\s*)?['"])(\.\.?\/[^'"\n]+?)(['"]\s*\)?)/g, (match, open, specifier, close) => {
        if (/\.(?:css|js|json|mjs|svelte|svg)$/.test(specifier)) return match;
        const base = resolve(dirname(path), specifier);
        if (existsSync(`${base}.js`)) return `${open}${specifier}.js${close}`;
        if (existsSync(join(base, 'index.js'))) return `${open}${specifier}/index.js${close}`;
        return match;
      });
      if (rewritten !== source) await writeFile(path, rewritten, 'utf8');
    }
  }
}
await visit(root);
