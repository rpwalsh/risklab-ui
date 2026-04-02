// @risklab/ui — Dark Theme
// Indigo primary on dark slate surfaces. Tailwind-inspired dark palette.

import type { UITheme } from './types';

export const darkTheme: UITheme = {
  id: 'ui-dark',
  name: 'UI Dark',
  mode: 'dark',
  tokens: {
    // Primary — Indigo (lightened for dark backgrounds)
    primary: {
      50:  '#1e1b4b',
      100: '#312e81',
      200: '#3730a3',
      300: '#4338ca',
      400: '#4f46e5',
      500: '#6366f1',
      600: '#818cf8',
      700: '#a5b4fc',
      800: '#c7d2fe',
      900: '#e0e7ff',
      950: '#eef2ff',
    },

    // Secondary — Violet
    secondary: {
      50:  '#2e1065',
      100: '#4c1d95',
      200: '#5b21b6',
      300: '#6d28d9',
      400: '#7c3aed',
      500: '#8b5cf6',
      600: '#a78bfa',
      700: '#c4b5fd',
      800: '#ddd6fe',
      900: '#ede9fe',
      950: '#f5f3ff',
    },

    // Neutral — Slate (inverted)
    neutral: {
      50:  '#020617',
      100: '#0f172a',
      200: '#1e293b',
      300: '#334155',
      400: '#475569',
      500: '#64748b',
      600: '#94a3b8',
      700: '#cbd5e1',
      800: '#e2e8f0',
      900: '#f1f5f9',
      950: '#f8fafc',
    },

    // Error — Red
    error: {
      50:  '#450a0a',
      100: '#7f1d1d',
      200: '#991b1b',
      300: '#b91c1c',
      400: '#dc2626',
      500: '#ef4444',
      600: '#f87171',
      700: '#fca5a5',
      800: '#fecaca',
      900: '#fee2e2',
      950: '#fef2f2',
    },

    // Warning — Amber
    warning: {
      50:  '#451a03',
      100: '#78350f',
      200: '#92400e',
      300: '#b45309',
      400: '#d97706',
      500: '#f59e0b',
      600: '#fbbf24',
      700: '#fcd34d',
      800: '#fde68a',
      900: '#fef3c7',
      950: '#fffbeb',
    },

    // Success — Emerald
    success: {
      50:  '#022c22',
      100: '#064e3b',
      200: '#065f46',
      300: '#047857',
      400: '#059669',
      500: '#10b981',
      600: '#34d399',
      700: '#6ee7b7',
      800: '#a7f3d0',
      900: '#d1fae5',
      950: '#ecfdf5',
    },

    // Info — Sky
    info: {
      50:  '#082f49',
      100: '#0c4a6e',
      200: '#075985',
      300: '#0369a1',
      400: '#0284c7',
      500: '#0ea5e9',
      600: '#38bdf8',
      700: '#7dd3fc',
      800: '#bae6fd',
      900: '#e0f2fe',
      950: '#f0f9ff',
    },

    // Semantic colors
    bg: '#0f172a',
    bgSurface: '#1e293b',
    bgElevated: '#334155',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    textHeading: '#f8fafc',
    border: '#334155',
    borderSubtle: '#1e293b',
    focus: '#818cf8',
    overlay: 'rgba(0, 0, 0, 0.6)',

    // Typography (same as light)
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontMono:
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 14,
    fontSizeSm: 12,
    fontSizeLg: 16,
    fontSizeXl: 20,
    lineHeight: 1.5,

    // Spacing (px)
    space1: 4,
    space2: 8,
    space3: 12,
    space4: 16,
    space5: 20,
    space6: 24,
    space8: 32,
    space10: 40,
    space12: 48,

    // Radii
    radiusSm: 4,
    radiusMd: 6,
    radiusLg: 8,
    radiusXl: 12,
    radiusFull: 9999,

    // Shadows (deeper for dark mode)
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',

    // Transitions
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: 200,
    durationFast: 100,
    durationSlow: 400,

    // Z-index
    zDropdown: 1000,
    zSticky: 1100,
    zModal: 1300,
    zToast: 1400,
    zTooltip: 1500,

    // Breakpoints (px)
    bpSm: 640,
    bpMd: 768,
    bpLg: 1024,
    bpXl: 1280,
  },
};
