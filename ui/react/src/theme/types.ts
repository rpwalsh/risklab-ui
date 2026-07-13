// @risklab/ui — Theme Type System
// All design tokens are typed and compatible with variable contracts.

export interface ColorScale {
  50: string; 100: string; 200: string; 300: string; 400: string;
  500: string; 600: string; 700: string; 800: string; 900: string; 950: string;
}

export interface ThemeTokens {
  // Color scales
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  error: ColorScale;
  warning: ColorScale;
  success: ColorScale;
  info: ColorScale;

  // Semantic
  bg: string;
  bgSurface: string;
  bgElevated: string;
  text: string;
  textMuted: string;
  textHeading: string;
  border: string;
  borderSubtle: string;
  focus: string;
  overlay: string;

  // Typography
  fontFamily: string;
  fontMono: string;
  fontSize: number;
  fontSizeSm: number;
  fontSizeLg: number;
  fontSizeXl: number;
  lineHeight: number;

  // Spacing (px)
  space1: number; space2: number; space3: number; space4: number;
  space5: number; space6: number; space8: number; space10: number; space12: number;

  // Radii
  radiusSm: number; radiusMd: number; radiusLg: number; radiusXl: number; radiusFull: number;

  // Shadows
  shadowSm: string; shadowMd: string; shadowLg: string;

  // Transitions
  ease: string;
  duration: number;
  durationFast: number;
  durationSlow: number;

  // Z-index
  zDropdown: number; zSticky: number; zModal: number; zToast: number; zTooltip: number;

  // Breakpoints (px)
  bpSm: number; bpMd: number; bpLg: number; bpXl: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UITheme {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  tokens: ThemeTokens;
}
