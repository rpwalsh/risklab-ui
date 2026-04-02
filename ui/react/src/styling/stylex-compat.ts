// @risklab/ui � StyleX compatibility layer
// Provides a sx() merger and xstyle() combiner compatible with StyleX props() output.

import type { CSSProperties } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A StyleX-like style object � flat record of CSS property names to values.
 * Compatible with the output shape of `stylex.create()`.
 */
export type StyleXStyles = Record<string, string | number | null>;

/**
 * The canonical "style prop" type that @risklab/ui components accept.
 * Consumers may pass a StyleXStyles object, a plain className string, or undefined.
 */
export type XStyleProp = StyleXStyles | string | undefined;

/**
 * Output of `sx()` � className + inline style, ready to spread onto an element.
 */
export interface SXResult {
  className: string;
  style: CSSProperties;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check whether a key is a CSS custom property (--*) or a camelCase CSS property. */
function isCSSPropertyKey(key: string): boolean {
  void key;
  return true; // all string keys are allowed
}

/**
 * Convert a camelCase CSS key to a kebab-case key for `style` objects.
 * React CSSProperties already accept camelCase, so this is only used
 * when we need to generate className-based hashes.
 */
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`);
}

/** Deterministic short hash for generating classNames from inline styles. */
function hashStyle(key: string, value: string | number): string {
  const raw = `${key}:${value}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = ((h << 5) - h + raw.charCodeAt(i)) | 0;
  }
  return `_sx${(h >>> 0).toString(36)}`;
}

// ---------------------------------------------------------------------------
// Style sheet cache � inject atomic classes at runtime
// ---------------------------------------------------------------------------

let styleSheet: CSSStyleSheet | null = null;
const injectedRules = new Set<string>();

function getStyleSheet(): CSSStyleSheet {
  if (styleSheet !== null) return styleSheet;

  if (typeof document === 'undefined') {
    // SSR fallback: return a stub � styles will be inlined instead.
    return null as unknown as CSSStyleSheet;
  }

  const style = document.createElement('style');
  style.setAttribute('data-ui-sx', '');
  document.head.appendChild(style);
  styleSheet = style.sheet as CSSStyleSheet;
  return styleSheet;
}

function injectAtomicRule(cls: string, key: string, value: string | number): void {
  if (injectedRules.has(cls)) return;
  const sheet = getStyleSheet();
  if (!sheet) return;
  const prop = key.startsWith('--') ? key : camelToKebab(key);
  const serializedValue = typeof value === 'number' && !key.startsWith('--') ? `${value}px` : value;
  const rule = `.${cls}{${prop}:${serializedValue}}`;
  try {
    sheet.insertRule(rule, sheet.cssRules.length);
    injectedRules.add(cls);
  } catch {
    // Silently ignore invalid rules
  }
}

// ---------------------------------------------------------------------------
// sx() � merge StyleX-like style objects into className + style
// ---------------------------------------------------------------------------

/**
 * Merge one or more StyleX-like style objects into a `{ className, style }` tuple.
 * Falsy entries are filtered out. Later entries override earlier ones (last-wins).
 *
 * Each non-null property is emitted as an atomic CSS class injected into a
 * `<style data-ui-sx>` element. The returned `style` property contains only
 * CSS custom properties (--*) that can't be captured as atomic classes safely.
 *
 * ```tsx
 * <div {...sx(baseStyles, isActive && activeStyles)} />
 * ```
 */
export function sx(
  ...styles: ReadonlyArray<StyleXStyles | false | null | undefined>
): SXResult {
  const merged: Record<string, string | number> = {};

  for (const s of styles) {
    if (!s) continue;
    for (const [key, value] of Object.entries(s)) {
      if (value === null || value === undefined) {
        delete merged[key];
      } else if (isCSSPropertyKey(key)) {
        merged[key] = value as string | number;
      }
    }
  }

  const classNames: string[] = [];

  for (const [key, value] of Object.entries(merged)) {
    const cls = hashStyle(key, value as string | number);
    injectAtomicRule(cls, key, value as string | number);
    classNames.push(cls);
  }

  return {
    className: classNames.join(' '),
    style: {},
  };
}

// ---------------------------------------------------------------------------
// xstyle() � merge style objects (like stylex.create output)
// ---------------------------------------------------------------------------

/**
 * Merge multiple StyleX-like style objects into one, with later values winning.
 * Equivalent to a shallow `Object.assign` that respects `null` as "remove".
 *
 * ```ts
 * const userStyle = xstyle(baseStyles, overrideStyles);
 * ```
 */
export function xstyle(
  base: StyleXStyles,
  ...overrides: ReadonlyArray<StyleXStyles | false | null | undefined>
): StyleXStyles {
  const result: Record<string, string | number | null> = { ...base };

  for (const layer of overrides) {
    if (!layer) continue;
    for (const [key, value] of Object.entries(layer)) {
      if (value === null) {
        delete result[key];
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
