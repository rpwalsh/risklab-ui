// @risklab/ui — Theme Provider
// Injects all tokens as CSS custom properties (--ui-*) on a wrapping div.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ColorScale, UITheme, ThemeMode, ThemeTokens } from './types';
import { lightTheme } from './defaultTheme';
import { darkTheme } from './darkTheme';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ThemeContextValue {
  theme: UITheme;
  tokens: ThemeTokens;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme() must be used inside a <ThemeProvider>.');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Helpers — token ? CSS custom properties
// ---------------------------------------------------------------------------

const COLOR_SCALE_KEYS: ReadonlyArray<keyof ColorScale> = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

function colorScaleToVars(
  prefix: string,
  scale: ColorScale,
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const step of COLOR_SCALE_KEYS) {
    vars[`${prefix}-${step}`] = scale[step];
  }
  return vars;
}

function tokensToCSSVars(tokens: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  // Color scales
  const scaleNames: ReadonlyArray<keyof Pick<
    ThemeTokens,
    'primary' | 'secondary' | 'neutral' | 'error' | 'warning' | 'success' | 'info'
  >> = ['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'];

  for (const name of scaleNames) {
    Object.assign(vars, colorScaleToVars(`--ui-${name}`, tokens[name]));
  }

  // Semantic strings
  const semanticStrings: ReadonlyArray<keyof ThemeTokens> = [
    'bg', 'bgSurface', 'bgElevated', 'text', 'textMuted', 'textHeading',
    'border', 'borderSubtle', 'focus', 'overlay',
    'fontFamily', 'fontMono',
    'shadowSm', 'shadowMd', 'shadowLg',
    'ease',
  ];

  for (const key of semanticStrings) {
    const val = tokens[key];
    if (typeof val === 'string') {
      vars[`--ui-${camelToDash(key)}`] = val;
    }
  }

  // Numeric tokens ? px / unitless
  const numericPx: ReadonlyArray<keyof ThemeTokens> = [
    'fontSize', 'fontSizeSm', 'fontSizeLg', 'fontSizeXl',
    'space1', 'space2', 'space3', 'space4', 'space5', 'space6', 'space8', 'space10', 'space12',
    'radiusSm', 'radiusMd', 'radiusLg', 'radiusXl', 'radiusFull',
    'bpSm', 'bpMd', 'bpLg', 'bpXl',
  ];
  for (const key of numericPx) {
    const val = tokens[key];
    if (typeof val === 'number') {
      vars[`--ui-${camelToDash(key)}`] = `${val}px`;
    }
  }

  // Unitless numbers
  const numericUnitless: ReadonlyArray<keyof ThemeTokens> = [
    'lineHeight',
    'zDropdown', 'zSticky', 'zModal', 'zToast', 'zTooltip',
  ];
  for (const key of numericUnitless) {
    const val = tokens[key];
    if (typeof val === 'number') {
      vars[`--ui-${camelToDash(key)}`] = String(val);
    }
  }

  // Transition durations are stored as numbers in the theme contract and
  // serialized with their semantic CSS unit.
  const durations: ReadonlyArray<keyof ThemeTokens> = [
    'duration', 'durationFast', 'durationSlow',
  ];
  for (const key of durations) {
    const val = tokens[key];
    if (typeof val === 'number') {
      vars[`--ui-${camelToDash(key)}`] = `${val}ms`;
    }
  }

  return vars;
}

function camelToDash(str: string): string {
  return str.replace(/[A-Z0-9]/g, (ch) => `-${ch.toLowerCase()}`);
}

// ---------------------------------------------------------------------------
// Resolve system preference
// ---------------------------------------------------------------------------

function resolveSystemMode(): 'light' | 'dark' {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface ThemeProviderProps {
  /** Override the full theme object. */
  theme?: UITheme;
  /** Initial mode. Defaults to `'system'`. */
  mode?: ThemeMode;
  children: ReactNode;
}

export function ThemeProvider({
  theme: themeProp,
  mode: modeProp = 'system',
  children,
}: ThemeProviderProps): React.ReactElement {
  const [mode, setModeState] = useState<ThemeMode>(modeProp);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Resolve effective light/dark
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>(resolveSystemMode);

  useEffect(() => {
    if (mode !== 'system') return;
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent): void => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  const effectiveMode: 'light' | 'dark' =
    mode === 'system' ? systemMode : mode;

  // Pick theme
  const theme: UITheme =
    themeProp ?? (effectiveMode === 'dark' ? darkTheme : lightTheme);

  // Inject CSS vars
  const cssVars = useMemo(() => tokensToCSSVars(theme.tokens), [theme.tokens]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    for (const [prop, value] of Object.entries(cssVars)) {
      el.style.setProperty(prop, value);
    }
    el.style.setProperty('color-scheme', effectiveMode);
    // Clean up old vars that may no longer exist
    return () => {
      for (const prop of Object.keys(cssVars)) {
        el.style.removeProperty(prop);
      }
      el.style.removeProperty('color-scheme');
    };
  }, [cssVars, effectiveMode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    if (next === 'system') {
      setSystemMode(resolveSystemMode());
    }
  }, []);

  const ctx = useMemo<ThemeContextValue>(
    () => ({ theme, tokens: theme.tokens, mode, setMode }),
    [theme, mode, setMode],
  );

  return (
    <ThemeContext.Provider value={ctx}>
      <div
        ref={wrapperRef}
        data-ui-theme={theme.id}
        data-ui-mode={effectiveMode}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
