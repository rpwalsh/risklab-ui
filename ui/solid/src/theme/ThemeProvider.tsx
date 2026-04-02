/**
 * @risklab/ui-solid — ThemeProvider
 * Provides theme mode context using SolidJS fine-grained reactivity.
 */

import {
  createContext,
  createSignal,
  createEffect,
  onCleanup,
  mergeProps,
  splitProps,
  type Component,
  type JSX,
} from 'solid-js';
import type { ThemeMode } from '../core/types';

export interface ThemeContextValue {
  mode: () => ThemeMode;
  isDark: () => boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>();

export interface ThemeProviderProps {
  initial?: ThemeMode;
  children?: JSX.Element;
}

export const ThemeProvider: Component<ThemeProviderProps> = (rawProps) => {
  const merged = mergeProps({ initial: 'system' as ThemeMode }, rawProps);
  const [local] = splitProps(merged, ['initial', 'children']);
  const [mode, setMode] = createSignal<ThemeMode>(local.initial);
  const [systemDark, setSystemDark] = createSignal(false);

  // Track system preference
  createEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    setSystemDark(mq.matches);
    mq.addEventListener('change', handler);
    onCleanup(() => mq.removeEventListener('change', handler));
  });

  const isDark = () => {
    const m = mode();
    if (m === 'system') return systemDark();
    return m === 'dark';
  };

  const toggle = () => {
    setMode(isDark() ? 'light' : 'dark');
  };

  const ctx: ThemeContextValue = {
    mode,
    isDark,
    setMode,
    toggle,
  };

  return (
    <ThemeContext.Provider value={ctx}>
      <div
        class={isDark() ? 'ui-root ui-dark' : 'ui-root'}
        style={{ "min-height": '100%' }}
      >
        {local.children}
      </div>
    </ThemeContext.Provider>
  );
};
