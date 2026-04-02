// @risklab/ui — Default Light Theme
// Clean slate gray + indigo primary palette. Tailwind-inspired colors.

import type { UITheme } from './types';

export const lightTheme: UITheme = {
  id: 'ui-light',
  name: 'UI Light',
  mode: 'light',
  tokens: {
    // Primary — Indigo
    primary: {
      50:  '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },

    // Secondary — Violet
    secondary: {
      50:  '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065',
    },

    // Neutral — Slate
    neutral: {
      50:  '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },

    // Error — Red
    error: {
      50:  '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },

    // Warning — Amber
    warning: {
      50:  '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },

    // Success — Emerald
    success: {
      50:  '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },

    // Info — Sky
    info: {
      50:  '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },

    // Semantic colors
    bg: '#ffffff',
    bgSurface: '#f8fafc',
    bgElevated: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    textHeading: '#0f172a',
    border: '#e2e8f0',
    borderSubtle: '#f1f5f9',
    focus: '#6366f1',
    overlay: 'rgba(15, 23, 42, 0.4)',

    // Typography
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

    // Shadows
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',

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
