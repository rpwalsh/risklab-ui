import { inject } from 'vue';
import { ThemeKey, type ThemeContext } from './ThemeProvider';

/**
 * Composable: access the theme context provided by `<UiThemeProvider>`.
 * Returns `{ mode, isDark, tokens, toggleMode }`.
 */
export function useTheme(): ThemeContext {
  const ctx = inject(ThemeKey);
  if (!ctx) throw new Error('useTheme() must be used inside <UiThemeProvider>');
  return ctx;
}
