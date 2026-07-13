import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { transformAsync } from '@babel/core';
import commonJsPlugin from '@babel/plugin-transform-modules-commonjs';
import solidPreset from 'babel-preset-solid';

const packageRoot = resolve(process.argv[2] ?? '.');

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(filename);
      continue;
    }
    if (!entry.name.endsWith('.jsx')) continue;

    const source = await readFile(filename, 'utf8');
    const result = await transformAsync(source, {
      filename,
      presets: [[solidPreset, { generate: 'dom', hydratable: true }]],
      plugins: filename.includes(`${join('dist', 'cjs')}`) ? [commonJsPlugin] : [],
      sourceMaps: false,
      babelrc: false,
      configFile: false,
    });
    if (!result?.code) throw new Error(`Unable to compile ${filename}.`);

    const output = join(dirname(filename), `${entry.name.slice(0, -4)}.js`);
    await writeFile(output, `${result.code}\n`, 'utf8');
    await rm(filename);
    await rm(`${filename}.map`, { force: true });
  }
}

await visit(join(packageRoot, 'dist', 'esm'));
await visit(join(packageRoot, 'dist', 'cjs'));
console.log(`Compiled Solid JSX output for ${packageRoot}`);
