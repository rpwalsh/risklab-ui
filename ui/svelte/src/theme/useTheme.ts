import { getContext } from 'svelte';

export interface ThemeContext {
  readonly mode: 'light' | 'dark';
  readonly isDark: boolean;
}

export function getThemeContext(): ThemeContext {
  return getContext<ThemeContext>('ui-theme');
}
