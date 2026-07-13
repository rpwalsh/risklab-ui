import { createRequire } from 'node:module';
import { mkdtemp, mkdir, rm, access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const workspaceSpecs = [
  { name: '@risklab/ui', workspace: 'packages/ui' },
  { name: '@risklab/ui-data', workspace: 'packages/ui-data' },
  { name: '@risklab/workbench', workspace: 'packages/workbench' },
  { name: '@risklab/ui-vanilla', workspace: 'ui/vanilla' },
  { name: '@risklab/ui-react', workspace: 'ui/react' },
  { name: '@risklab/ui-vue', workspace: 'ui/vue' },
  { name: '@risklab/ui-svelte', workspace: 'ui/svelte' },
  { name: '@risklab/ui-angular', workspace: 'ui/angular' },
  { name: '@risklab/ui-lit', workspace: 'ui/lit' },
  { name: '@risklab/ui-solid', workspace: 'ui/solid' },
];

const uiPackageNames = workspaceSpecs.map((spec) => spec.name);
const uiFrameworkNames = uiPackageNames.filter((name) => name.startsWith('@risklab/ui-') && name !== '@risklab/ui-data');

const scenarios = [
  {
    name: 'ui-core-only',
    install: ['@risklab/ui-data', '@risklab/ui'],
    resolve: ['@risklab/ui', '@risklab/ui/vanilla', '@risklab/ui/auto', '@risklab/ui/css'],
    installed: ['@risklab/ui-data', '@risklab/ui'],
    missing: ['@risklab/ui-react', 'react', 'react-dom'],
  },
  {
    name: 'workbench-shell',
    install: ['@risklab/workbench'],
    resolve: ['@risklab/workbench', '@risklab/workbench/state', '@risklab/workbench/theme', '@risklab/workbench/css'],
    installed: ['@risklab/workbench', 'react'],
    missing: ['@risklab/ui-react', '@risklab/charts-react'],
  },
  {
    name: 'ui-framework-packages',
    install: ['@risklab/ui-data', ...uiFrameworkNames],
    resolve: uiFrameworkNames,
    installed: [
      ...uiFrameworkNames,
      'react',
      'react-dom',
      'vue',
      'svelte',
      '@angular/core',
      '@angular/common',
      'lit',
      'solid-js',
    ],
    missing: ['@risklab/ui'],
  },
];

async function run() {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'risklab-ui-install-smoke-'));
  const tarballDir = path.join(tempRoot, 'tarballs');
  await mkdir(tarballDir, { recursive: true });

  try {
    await assertNoInstallDependencies();
    await execNpm(['run', 'build:all'], repoRoot);

    const tarballs = new Map();

    for (const spec of workspaceSpecs) {
      tarballs.set(spec.name, await packWorkspace(spec, tarballDir));
    }
    for (const scenario of scenarios) {
      await runScenario({ scenario, tarballs, tempRoot });
    }

    console.log(`Smoke install checks passed (${scenarios.length} scenarios).`);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function packWorkspace(spec, tarballDir) {
  const args = ['pack', '--pack-destination', tarballDir, `--workspace=${spec.workspace}`];
  const { stdout } = await execNpm(args, repoRoot);
  const filename = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  if (!filename) {
    throw new Error(`Unable to determine tarball filename for ${spec.name}.`);
  }

  return path.join(tarballDir, filename);
}

async function assertNoInstallDependencies() {
  for (const spec of workspaceSpecs) {
    const manifestPath = path.join(repoRoot, spec.workspace, 'package.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const dependencyNames = Object.keys(manifest.dependencies ?? {});

    const unexpected = dependencyNames.filter((name) => name !== '@risklab/ui-data');
    if (unexpected.length > 0) {
      throw new Error(`${spec.name} declares unexpected install dependencies: ${unexpected.join(', ')}`);
    }
  }
}

async function runScenario({ scenario, tarballs, tempRoot }) {
  const projectDir = path.join(tempRoot, scenario.name);
  await mkdir(projectDir, { recursive: true });

  await execNpm(['init', '-y'], projectDir);

  const installArgs = [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    'jsdom@^26.0.0',
    ...scenario.install.map((name) => tarballs.get(name)),
  ];

  await execNpm(installArgs, projectDir);

  const projectRequire = createRequire(path.join(projectDir, 'package.json'));

  for (const specifier of scenario.resolve ?? []) {
    try {
      projectRequire.resolve(specifier);
    } catch (error) {
      throw new Error(`Scenario "${scenario.name}" could not resolve "${specifier}": ${formatError(error)}`);
    }
  }

  for (const packageName of scenario.installed ?? []) {
    const manifestPath = path.join(projectDir, 'node_modules', ...packageName.split('/'), 'package.json');
    try {
      await access(manifestPath);
    } catch {
      throw new Error(`Scenario "${scenario.name}" is missing installed package "${packageName}".`);
    }
  }

  for (const packageName of scenario.missing ?? []) {
    const manifestPath = path.join(projectDir, 'node_modules', ...packageName.split('/'), 'package.json');
    try {
      await access(manifestPath);
      throw new Error(`Scenario "${scenario.name}" unexpectedly installed "${packageName}".`);
    } catch (error) {
      if (isUnexpectedInstallError(error)) {
        throw error;
      }
    }
  }

  const manifest = JSON.parse(await readFile(path.join(projectDir, 'package.json'), 'utf8'));
  await executeEntrypoints(projectDir, scenario.resolve ?? []);
  console.log(`Verified ${scenario.name}: ${Object.keys(manifest.dependencies ?? {}).length} installed dependencies.`);
}

async function executeEntrypoints(projectDir, specifiers) {
  const executable = specifiers.filter((name) => !name.endsWith('/css') && !name.includes('svelte'));
  await writeFile(path.join(projectDir, 'verify-esm.mjs'), `
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const key of ['window','document','Document','customElements','HTMLElement','Element','Node','Event','CustomEvent','MutationObserver','ShadowRoot','CSSStyleSheet']) if (key in dom.window) globalThis[key] = dom.window[key];
const name = process.argv[2];
const value = await import(name);
if (!value) throw new Error('Empty ESM entrypoint: '+name);
`, 'utf8');
  for (const name of executable) await execNode(['--conditions=browser', 'verify-esm.mjs', name], projectDir);
  const cjs = executable;
  await writeFile(path.join(projectDir, 'verify-cjs.cjs'), `
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const key of ['window','document','Document','customElements','HTMLElement','Element','Node','Event','CustomEvent','MutationObserver','ShadowRoot','CSSStyleSheet']) if (key in dom.window) globalThis[key] = dom.window[key];
const name = process.argv[2];
const value = require(name);
if (!value) throw new Error('Empty CommonJS entrypoint: '+name);
`, 'utf8');
  for (const name of cjs) await execNode(['--conditions=browser', 'verify-cjs.cjs', name], projectDir);
  console.log(`Executed ${executable.length} ESM and ${cjs.length} CommonJS entrypoints.`);

  if (specifiers.some((name) => name.includes('svelte'))) {
    await writeFile(path.join(projectDir, 'verify-svelte.mjs'), `
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { compile } from 'svelte/compiler';
const root = join(process.cwd(), 'node_modules', '@risklab', 'ui-svelte', 'dist');
async function collect(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const target = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await collect(target));
    else if (entry.name.endsWith('.svelte')) files.push(target);
  }
  return files;
}
const files = await collect(root);
if (!files.length) throw new Error('No packaged Svelte components found.');
for (const file of files) compile(await readFile(file, 'utf8'), { filename: file, generate: 'client', dev: false });
console.log('Compiled '+files.length+' installed Svelte components.');
`, 'utf8');
    await execNode(['verify-svelte.mjs'], projectDir);
  }
}

function isUnexpectedInstallError(error) {
  return !(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT');
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

async function execNpm(args, cwd) {
  return await new Promise((resolve, reject) => {
    const child = spawn(npmCommand, args, {
      cwd,
      env: process.env,
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      const stdoutText = stdout ? `\nSTDOUT:\n${stdout}` : '';
      const stderrText = stderr ? `\nSTDERR:\n${stderr}` : '';
      reject(new Error(`npm ${args.join(' ')} failed in ${cwd}.${stdoutText}${stderrText}`));
    });
  });
}

async function execNode(args, cwd) {
  return await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = ''; let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += String(chunk); });
    child.stderr.on('data', (chunk) => { stderr += String(chunk); });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`node ${args.join(' ')} failed in ${cwd}.\n${stdout}\n${stderr}`)));
  });
}

await run();
