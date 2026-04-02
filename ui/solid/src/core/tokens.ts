/**
 * @risklab/ui-solid — Design token helpers.
 * Maps semantic names to CSS custom properties.
 */

import type { ColorVariant, SizeVariant } from './types';

/** Resolve a color variant to its CSS custom property value */
export function colorVar(color: ColorVariant): string {
  const map: Record<ColorVariant, string> = {
    primary: 'var(--ui-color-primary)',
    secondary: 'var(--ui-color-secondary)',
    neutral: 'var(--ui-color-neutral)',
    success: 'var(--ui-color-success)',
    warning: 'var(--ui-color-warning)',
    error: 'var(--ui-color-error)',
    info: 'var(--ui-color-info)',
  };
  return map[color] ?? map.primary;
}

/** Resolve a color variant to its subtle/background CSS property */
export function colorSubtleVar(color: ColorVariant): string {
  const map: Record<ColorVariant, string> = {
    primary: 'var(--ui-color-primary-subtle)',
    secondary: 'var(--ui-color-secondary-subtle)',
    neutral: 'var(--ui-color-neutral-subtle)',
    success: 'var(--ui-color-success-subtle)',
    warning: 'var(--ui-color-warning-subtle)',
    error: 'var(--ui-color-error-subtle)',
    info: 'var(--ui-color-info-subtle)',
  };
  return map[color] ?? map.primary;
}

/** Map size variant to px-based sizing */
export const sizeMap: Record<SizeVariant, { height: string; fontSize: string; padding: string; radius: string }> = {
  xs: { height: '1.5rem', fontSize: '0.75rem', padding: '0 0.5rem', radius: 'var(--ui-radius-sm)' },
  sm: { height: '2rem', fontSize: '0.8125rem', padding: '0 0.75rem', radius: 'var(--ui-radius-sm)' },
  md: { height: '2.5rem', fontSize: '0.875rem', padding: '0 1rem', radius: 'var(--ui-radius-md)' },
  lg: { height: '3rem', fontSize: '1rem', padding: '0 1.25rem', radius: 'var(--ui-radius-md)' },
  xl: { height: '3.5rem', fontSize: '1.125rem', padding: '0 1.5rem', radius: 'var(--ui-radius-lg)' },
};

/** Map size variant to icon/avatar dimension */
export const avatarSizeMap: Record<SizeVariant, string> = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '64px',
};
