import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';

const root = resolve(process.argv[2] ?? '.');
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
function installDom() {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://localhost/' });
  for (const key of ['window', 'document', 'Document', 'customElements', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'MutationObserver', 'ShadowRoot', 'CSSStyleSheet']) {
    if (key in dom.window) globalThis[key] = dom.window[key];
  }
  return dom;
}

installDom();

const rootExport = manifest.exports?.['.'];
const esmPath = typeof rootExport === 'string' ? rootExport : rootExport?.import ?? rootExport?.default ?? manifest.module ?? manifest.svelte;
if (!esmPath) throw new Error(`${manifest.name} does not advertise an ESM entrypoint.`);
const esm = await import(pathToFileURL(resolve(root, esmPath)).href);
if (!esm || typeof esm !== 'object') throw new Error(`${manifest.name} returned an empty ESM module.`);

const cjsPath = typeof rootExport === 'object' ? rootExport.require : undefined;
if (cjsPath) {
  installDom();
  const require = createRequire(import.meta.url);
  const cjs = require(resolve(root, cjsPath));
  if (!cjs || (typeof cjs !== 'object' && typeof cjs !== 'function')) throw new Error(`${manifest.name} returned an empty CommonJS module.`);
}
console.log(`${manifest.name}: executed ESM${cjsPath ? ' and CommonJS' : ''} entrypoints.`);
