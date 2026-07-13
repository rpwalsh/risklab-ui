// @risklab/ui — Shared prop types for the styling system

import type { CSSProperties } from 'react';
import type { AtomicStyleProp } from './atomic-runtime';

// ---------------------------------------------------------------------------
// Variant unions
// ---------------------------------------------------------------------------

/** Standard size scale used across @risklab/ui components. */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Semantic colour variants mapped to theme colour scales. */
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'neutral';

// ---------------------------------------------------------------------------
// Base props shared by every @risklab/ui component
// ---------------------------------------------------------------------------

/**
 * Common props inherited by all @risklab/ui components.
 *
 * - `className` — additional CSS class(es)
 * - `style` — inline React CSSProperties
 * - `xstyle` — atomic style override prop
 * - `id` — HTML `id` attribute
 * - `testId` — maps to `data-testid` for testing
 */
export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  xstyle?: AtomicStyleProp;
  id?: string;
  testId?: string;
}

// ---------------------------------------------------------------------------
// Re-export AtomicStyleProp for convenience
// ---------------------------------------------------------------------------

export type { AtomicStyleProp };
