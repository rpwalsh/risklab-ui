/**
 * @risklab/ui-svelte — Core types and interfaces.
 * These mirror the vanilla/React version's API surface for consistency.
 */

// ─── Size / Color variants ─────────────────────────────────────────
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

// ─── Theme ──────────────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeTokens {
  colorPrimary: string;
  colorPrimaryHover: string;
  colorSecondary: string;
  colorSurface: string;
  colorSurfaceVariant: string;
  colorText: string;
  colorTextSecondary: string;
  colorTextDisabled: string;
  colorBorder: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  fontFamily: string;
  fontMono: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
}

// ─── Component prop interfaces ──────────────────────────────────────

export interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'ghost' | 'link';
  size?: SizeVariant;
  color?: ColorVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface TextFieldProps {
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: SizeVariant;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  error?: boolean;
  helperText?: string;
  type?: string;
  value?: string;
}

export interface SelectProps {
  size?: SizeVariant;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  multiple?: boolean;
  value?: string;
}

export interface SelectOptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  label?: string;
}

export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  label?: string;
}

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  disabled?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
}

export interface ChipProps {
  variant?: 'filled' | 'outlined';
  size?: SizeVariant;
  color?: ColorVariant;
  deletable?: boolean;
  disabled?: boolean;
}

export interface BadgeProps {
  content?: string | number;
  variant?: 'standard' | 'dot';
  color?: ColorVariant;
  max?: number;
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: SizeVariant;
  variant?: 'circular' | 'rounded' | 'square';
  initials?: string;
}

export interface TooltipProps {
  content?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export interface AlertProps {
  severity?: 'success' | 'info' | 'warning' | 'error';
  variant?: 'filled' | 'outlined' | 'standard';
  closable?: boolean;
  visible?: boolean;
}

export interface DialogProps {
  open?: boolean;
  modal?: boolean;
  size?: SizeVariant;
}

export interface ProgressProps {
  value?: number;
  variant?: 'determinate' | 'indeterminate';
  type?: 'linear' | 'circular';
  size?: SizeVariant;
  color?: ColorVariant;
}

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export interface TabsProps {
  value?: string;
  variant?: 'standard' | 'pills' | 'underlined';
  size?: SizeVariant;
}

export interface DrawerProps {
  open?: boolean;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
  overlay?: boolean;
}

export interface AccordionProps {
  multiple?: boolean;
  value?: string[];
}

export interface PaginationProps {
  count?: number;
  page?: number;
  siblingCount?: number;
  boundaryCount?: number;
  size?: SizeVariant;
}

export interface DataGridColumn {
  field: string;
  headerName: string;
  width?: number;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface DataGridProps {
  columns?: DataGridColumn[];
  rows?: Record<string, unknown>[];
  pageSize?: number;
  sortable?: boolean;
  striped?: boolean;
  bordered?: boolean;
}

export interface ToastOptions {
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}
