import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const family = process.argv[2];

if (!family) {
  throw new Error('Usage: node tools/build-ui-css.mjs <family>');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const baseCssPath = path.join(repoRoot, 'ui', family, 'src', 'css', 'ui.css');
const workbenchCssPath = path.join(repoRoot, 'ui', 'vanilla', 'src', 'css', 'workbench.css');
const outputPath = path.join(repoRoot, 'ui', family, 'dist', 'ui.css');

const [baseCss, workbenchCss] = await Promise.all([
  readFile(baseCssPath, 'utf8'),
  readFile(workbenchCssPath, 'utf8'),
]);

await writeFile(outputPath, `${baseCss.trimEnd()}\n\n${workbenchCss.trimStart()}\n`);
