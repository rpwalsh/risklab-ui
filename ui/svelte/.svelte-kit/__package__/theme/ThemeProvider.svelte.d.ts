import type { Snippet } from 'svelte';
import type { ThemeMode } from '../core/types.js';
type $$ComponentProps = {
    mode?: ThemeMode;
    children?: Snippet;
};
declare const ThemeProvider: import("svelte").Component<$$ComponentProps, {}, "">;
type ThemeProvider = ReturnType<typeof ThemeProvider>;
export default ThemeProvider;
