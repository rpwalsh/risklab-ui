export interface WorkbenchThemeTokens {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  positive: string;
  warning: string;
  danger: string;
  navWidth: string;
  inspectorWidth: string;
  topbarHeight: string;
  statusHeight: string;
  radius: string;
  gap: string;
  panelPadding: string;
  shadow: string;
  fontFamily: string;
}

export type WorkbenchTone = 'light' | 'dark' | 'high-contrast';

export const darkWorkbenchTheme: WorkbenchThemeTokens = {
  background: '#0b1220',
  surface: '#101a2d',
  surfaceMuted: '#162238',
  border: '#22324d',
  text: '#e6edf7',
  textMuted: '#99abc7',
  accent: '#4c8dff',
  accentSoft: 'rgba(76, 141, 255, 0.18)',
  positive: '#29b37d',
  warning: '#f2b84b',
  danger: '#ef6464',
  navWidth: '248px',
  inspectorWidth: '320px',
  topbarHeight: '72px',
  statusHeight: '36px',
  radius: '16px',
  gap: '16px',
  panelPadding: '16px',
  shadow: '0 18px 44px rgba(3, 10, 24, 0.28)',
  fontFamily: '"Segoe UI", Inter, "Helvetica Neue", Arial, sans-serif',
};

export const lightWorkbenchTheme: WorkbenchThemeTokens = {
  background: '#f5f7fb',
  surface: '#ffffff',
  surfaceMuted: '#eef3fb',
  border: '#d8e2f1',
  text: '#122033',
  textMuted: '#5f718a',
  accent: '#2764ff',
  accentSoft: 'rgba(39, 100, 255, 0.12)',
  positive: '#1f8b5f',
  warning: '#b8800e',
  danger: '#c53f3f',
  navWidth: '248px',
  inspectorWidth: '320px',
  topbarHeight: '72px',
  statusHeight: '36px',
  radius: '16px',
  gap: '16px',
  panelPadding: '16px',
  shadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
  fontFamily: '"Segoe UI", Inter, "Helvetica Neue", Arial, sans-serif',
};

export const highContrastWorkbenchTheme: WorkbenchThemeTokens = {
  ...darkWorkbenchTheme,
  background: '#05070a',
  surface: '#0c1117',
  surfaceMuted: '#111923',
  border: '#93a4c2',
  text: '#ffffff',
  textMuted: '#c8d3e5',
  accent: '#7fb0ff',
  accentSoft: 'rgba(127, 176, 255, 0.2)',
  positive: '#6ce3aa',
  warning: '#ffd56b',
  danger: '#ff9b9b',
};

export function resolveWorkbenchTheme(
  tone: WorkbenchTone = 'dark',
  overrides?: Partial<WorkbenchThemeTokens>,
): WorkbenchThemeTokens {
  const base = tone === 'light'
    ? lightWorkbenchTheme
    : tone === 'high-contrast'
      ? highContrastWorkbenchTheme
      : darkWorkbenchTheme;

  return { ...base, ...overrides };
}

export function createWorkbenchThemeVars(
  theme: WorkbenchThemeTokens,
): Record<string, string> {
  return {
    '--rlwb-bg': theme.background,
    '--rlwb-surface': theme.surface,
    '--rlwb-surface-muted': theme.surfaceMuted,
    '--rlwb-border': theme.border,
    '--rlwb-text': theme.text,
    '--rlwb-text-muted': theme.textMuted,
    '--rlwb-accent': theme.accent,
    '--rlwb-accent-soft': theme.accentSoft,
    '--rlwb-positive': theme.positive,
    '--rlwb-warning': theme.warning,
    '--rlwb-danger': theme.danger,
    '--rlwb-nav-width': theme.navWidth,
    '--rlwb-inspector-width': theme.inspectorWidth,
    '--rlwb-topbar-height': theme.topbarHeight,
    '--rlwb-status-height': theme.statusHeight,
    '--rlwb-radius': theme.radius,
    '--rlwb-gap': theme.gap,
    '--rlwb-panel-padding': theme.panelPadding,
    '--rlwb-shadow': theme.shadow,
    '--rlwb-font-family': theme.fontFamily,
  };
}
