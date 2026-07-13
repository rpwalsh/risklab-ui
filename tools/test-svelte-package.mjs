import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { compile } from 'svelte/compiler';

const root = resolve(process.argv[2] ?? '.', 'dist');

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(target));
    else if (entry.name.endsWith('.svelte')) files.push(target);
  }
  return files;
}

const components = await collect(root);
if (components.length === 0) throw new Error('The built Svelte package contains no components.');

for (const filename of components) {
  const source = await readFile(filename, 'utf8');
  const result = compile(source, { filename, generate: 'client', dev: false });
  if (!result.js?.code) throw new Error(`Svelte produced no client output for ${filename}.`);
}

console.log(`@risklab/ui-svelte: compiled ${components.length} packaged components.`);
