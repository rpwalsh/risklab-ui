/**
 * @risklab/ui-vue — Core types and interfaces.
 * These mirror the Vanilla/React version's API surface for consistency.
 */

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ColorVariant = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
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

export interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'ghost' | 'link';
  size?: SizeVariant;
  color?: ColorVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
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
  modelValue?: string;
}

export interface SelectProps {
  size?: SizeVariant;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  multiple?: boolean;
  modelValue?: string | string[];
  options?: SelectOptionData[];
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
  modelValue?: boolean;
}

export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  label?: string;
  modelValue?: boolean;
}

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  disabled?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  modelValue?: number;
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
}

export interface DialogProps {
  open?: boolean;
  modal?: boolean;
  size?: SizeVariant;
  modelValue?: boolean;
}

export interface ProgressProps {
  value?: number;
  variant?: 'determinate' | 'indeterminate';
  size?: SizeVariant;
  color?: ColorVariant;
  linear?: boolean;
}

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export interface TabsProps {
  modelValue?: string;
  variant?: 'standard' | 'pills' | 'underlined';
  size?: SizeVariant;
}

export interface DrawerProps {
  open?: boolean;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
  overlay?: boolean;
  modelValue?: boolean;
}

export interface AccordionProps {
  multiple?: boolean;
  modelValue?: string[];
}

export interface PaginationProps {
  count?: number;
  page?: number;
  siblingCount?: number;
  boundaryCount?: number;
  size?: SizeVariant;
  modelValue?: number;
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

export interface CardProps {
  variant?: 'elevated' | 'outlined' | 'flat';
  interactive?: boolean;
  padding?: string;
}

export interface PaperProps {
  variant?: 'elevated' | 'outlined' | 'flat';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface BreadcrumbsProps {
  separator?: string;
}

export interface BoxProps {
  padding?: string;
  margin?: string;
  display?: string;
  background?: string;
}

export interface StackProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: string;
  align?: string;
  justify?: string;
  wrap?: boolean;
}

export interface GridProps {
  columns?: number | string;
  gap?: string;
  rows?: string;
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
}
