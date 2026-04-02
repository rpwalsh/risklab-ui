/**
 * @risklab/ui-vue — Design token utilities.
 * Maps component props to CSS custom property references.
 */

import type { CSSProperties } from 'vue';
import type { ColorVariant, SizeVariant } from './types';

/**
 * Returns base CSS properties that reference `--ui-*` custom properties
 * for font family and text color.
 */
export function tokenStyle(): CSSProperties {
  return {
    fontFamily: 'var(--ui-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    color: 'var(--ui-color-text, #0f172a)',
  };
}

/** Returns the CSS variable reference for a given color variant. */
export function colorVar(color: ColorVariant): string {
  return `var(--ui-color-${color})`;
}

/** Returns the CSS class suffix for a given size variant. */
export function sizeClass(size: SizeVariant): string {
  return size;
}

/** Color map providing base, contrast, and soft token references per color variant. */
export const COLOR_VARS: Record<
  ColorVariant,
  { base: string; contrast: string; soft: string; softFg: string }
> = {
  primary: {
    base: 'var(--ui-color-primary, #3b82f6)',
    contrast: '#fff',
    soft: 'var(--ui-color-primary-soft, #dbeafe)',
    softFg: 'var(--ui-color-primary, #3b82f6)',
  },
  secondary: {
    base: 'var(--ui-color-secondary, #6366f1)',
    contrast: '#fff',
    soft: 'var(--ui-color-secondary-soft, #e0e7ff)',
    softFg: 'var(--ui-color-secondary, #6366f1)',
  },
  success: {
    base: 'var(--ui-color-success, #22c55e)',
    contrast: '#fff',
    soft: 'var(--ui-color-success-soft, #dcfce7)',
    softFg: 'var(--ui-color-success, #22c55e)',
  },
  warning: {
    base: 'var(--ui-color-warning, #f59e0b)',
    contrast: '#fff',
    soft: 'var(--ui-color-warning-soft, #fef3c7)',
    softFg: 'var(--ui-color-warning, #f59e0b)',
  },
  error: {
    base: 'var(--ui-color-error, #ef4444)',
    contrast: '#fff',
    soft: 'var(--ui-color-error-soft, #fee2e2)',
    softFg: 'var(--ui-color-error, #ef4444)',
  },
  info: {
    base: 'var(--ui-color-info, #06b6d4)',
    contrast: '#fff',
    soft: 'var(--ui-color-info-soft, #cffafe)',
    softFg: 'var(--ui-color-info, #06b6d4)',
  },
  neutral: {
    base: 'var(--ui-color-neutral, #6b7280)',
    contrast: '#fff',
    soft: 'var(--ui-color-neutral-soft, #f3f4f6)',
    softFg: 'var(--ui-color-neutral, #6b7280)',
  },
};

/** Shadow values for elevation levels 0–5 */
export const ELEVATION_SHADOWS: Record<number, string> = {
  0: 'none',
  1: 'var(--ui-shadow-sm, 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06))',
  2: 'var(--ui-shadow-md, 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06))',
  3: 'var(--ui-shadow-lg, 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05))',
  4: 'var(--ui-shadow-xl, 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04))',
  5: 'var(--ui-shadow-2xl, 0 25px 50px rgba(0,0,0,0.25))',
};
