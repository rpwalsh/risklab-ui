/**
 * @risklab/ui-solid — useTheme hook
 */

import { useContext } from 'solid-js';
import { ThemeContext, type ThemeContextValue } from './ThemeProvider';

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}
