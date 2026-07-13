import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const baseCssPath = path.join(repoRoot, 'ui', 'react', 'src', 'css', 'ui.css');
const workbenchCssPath = path.join(repoRoot, 'ui', 'react', 'src', 'css', 'workbench.css');
const outputPath = path.join(repoRoot, 'ui', 'react', 'dist', 'ui.css');

const [baseCss, workbenchCss] = await Promise.all([
  readFile(baseCssPath, 'utf8'),
  readFile(workbenchCssPath, 'utf8'),
]);

await writeFile(outputPath, `${baseCss.trimEnd()}\n\n${workbenchCss.trimStart()}\n`);
