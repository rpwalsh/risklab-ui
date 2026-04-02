export interface ThemeContext {
    readonly mode: 'light' | 'dark';
    readonly isDark: boolean;
}
export declare function getThemeContext(): ThemeContext;
