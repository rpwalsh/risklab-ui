import type { CSSProperties } from 'react';

export type StyleValue = string | number | null | undefined;
export interface AtomicStyles { readonly [property: string]: StyleValue | AtomicStyles; }
export type AtomicStyleProp = AtomicStyles | string | undefined;
export interface SXResult { className: string; style: CSSProperties; }
export interface SXRuntimeOptions { nonce?: string; inject?: boolean; }

interface StyleLeaf { property: string; value: string | number; conditions: string[]; selectors: string[]; }

const UNITLESS = new Set(['animationIterationCount', 'aspectRatio', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth', 'columnCount', 'fillOpacity', 'flex', 'flexGrow', 'flexShrink', 'fontWeight', 'gridArea', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'lineClamp', 'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'shapeImageThreshold', 'stopOpacity', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'tabSize', 'widows', 'zIndex', 'zoom']);
const TIME_VALUES = new Set(['animationDelay', 'animationDuration', 'transitionDelay', 'transitionDuration']);
const ANGLE_VALUES = new Set(['rotate', 'offsetRotate']);
const PROPERTY = /^(?:--[a-zA-Z0-9_-]+|[a-zA-Z][a-zA-Z0-9]*)$/;
const CONDITION = /^@(media|supports|container|layer)\s+[^{}<>]+$/;
const SELECTOR = /^(?:&|[:.[#>+~*\s-])[^{}<>]*$/;

let runtimeOptions: SXRuntimeOptions = { inject: true };
let styleElement: HTMLStyleElement | null = null;
const rules = new Map<string, string>();
const signatures = new Map<string, string>();

export function configureSX(options: SXRuntimeOptions): void {
  runtimeOptions = { ...runtimeOptions, ...options };
  if (styleElement && runtimeOptions.nonce) styleElement.nonce = runtimeOptions.nonce;
}

export function getSXStyleSheetText(): string { return [...rules.values()].join('\n'); }

export function resetSXStyleSheet(): void {
  rules.clear();
  signatures.clear();
  styleElement?.remove();
  styleElement = null;
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function toKebab(property: string): string {
  if (property.startsWith('--')) return property;
  return property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^ms-/, '-ms-');
}

function formatValue(property: string, value: string | number): string {
  if (typeof value === 'string') {
    const hasUnsafeControl = [...value].some((character) => {
      const code = character.codePointAt(0) ?? 0;
      return code < 32 && character !== '\t' && character !== '\n' && character !== '\r';
    });
    if (/[{}<>;]/u.test(value) || hasUnsafeControl) throw new TypeError(`Unsafe CSS value for ${property}.`);
    return value;
  }
  if (!Number.isFinite(value)) throw new TypeError(`CSS value for ${property} must be finite.`);
  if (value === 0 || UNITLESS.has(property) || property.startsWith('--')) return String(value);
  if (TIME_VALUES.has(property)) return `${value}ms`;
  if (ANGLE_VALUES.has(property)) return `${value}deg`;
  return `${value}px`;
}

function flatten(style: AtomicStyles, conditions: string[] = [], selectors: string[] = []): StyleLeaf[] {
  const output: StyleLeaf[] = [];
  for (const [key, value] of Object.entries(style)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'object') {
      if (key.startsWith('@')) {
        if (!CONDITION.test(key)) throw new TypeError(`Unsupported CSS condition: ${key}`);
        output.push(...flatten(value, [...conditions, key], selectors));
      } else {
        if (!SELECTOR.test(key)) throw new TypeError(`Unsupported CSS selector: ${key}`);
        output.push(...flatten(value, conditions, [...selectors, key]));
      }
      continue;
    }
    if (!PROPERTY.test(key)) throw new TypeError(`Unsupported CSS property: ${key}`);
    output.push({ property: key, value, conditions, selectors });
  }
  return output;
}

function ensureStyleElement(): HTMLStyleElement | null {
  if (runtimeOptions.inject === false || typeof document === 'undefined') return null;
  if (styleElement?.isConnected) return styleElement;
  const target = document.createElement('style');
  target.dataset.risklabUi = 'runtime';
  if (runtimeOptions.nonce) target.nonce = runtimeOptions.nonce;
  document.head.appendChild(target);
  styleElement = target;
  return target;
}

function render(className: string, leaf: StyleLeaf): string {
  const classSelector = `.${className}`;
  const selector = leaf.selectors.reduce((current, nested) => nested.includes('&') ? nested.replaceAll('&', current) : `${current}${nested}`, classSelector);
  let text = `${selector}{${toKebab(leaf.property)}:${formatValue(leaf.property, leaf.value)}}`;
  for (const condition of [...leaf.conditions].reverse()) text = `${condition}{${text}}`;
  return text;
}

function mergeInto(target: Record<string, StyleValue | AtomicStyles>, source: AtomicStyles): void {
  for (const [key, value] of Object.entries(source)) {
    if (value === null || value === undefined) delete target[key];
    else if (typeof value === 'object') {
      const previous = target[key];
      const nested: Record<string, StyleValue | AtomicStyles> = typeof previous === 'object' && previous !== null ? { ...previous } : {};
      mergeInto(nested, value);
      target[key] = nested;
    } else target[key] = value;
  }
}

export function sx(...styles: ReadonlyArray<AtomicStyles | false | null | undefined>): SXResult {
  const merged: Record<string, StyleValue | AtomicStyles> = {};
  for (const style of styles) if (style) mergeInto(merged, style);
  const classNames: string[] = [];
  for (const leaf of flatten(merged)) {
    const signature = JSON.stringify([leaf.property, leaf.value, leaf.conditions, leaf.selectors]);
    const baseName = `rlx-ui-${stableHash(signature)}`;
    let className = baseName;
    let collision = 0;
    while (signatures.has(className) && signatures.get(className) !== signature) {
      collision += 1;
      className = `${baseName}-${collision}`;
    }
    if (!rules.has(className)) {
      const text = render(className, leaf);
      rules.set(className, text);
      signatures.set(className, signature);
      ensureStyleElement()?.append(document.createTextNode(`${text}\n`));
    }
    classNames.push(className);
  }
  return { className: classNames.join(' '), style: {} };
}

export function xstyle(base: AtomicStyles, ...overrides: ReadonlyArray<AtomicStyles | false | null | undefined>): AtomicStyles {
  const result: Record<string, StyleValue | AtomicStyles> = {};
  mergeInto(result, base);
  for (const override of overrides) if (override) mergeInto(result, override);
  return result;
}
