import { access, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const vanillaDist = path.join(repoRoot, 'ui', 'vanilla', 'dist');
const rootUiDist = path.join(repoRoot, 'packages', 'ui', 'dist');

try {
  await access(vanillaDist);
} catch {
  throw new Error('Build ui/vanilla first so @risklab/ui can copy its standalone dist.');
}

await rm(rootUiDist, { recursive: true, force: true });
await cp(vanillaDist, rootUiDist, { recursive: true });
