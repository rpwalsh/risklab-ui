/**
 * @risklab/ui-solid — Core types and interfaces.
 * Mirrors the vanilla/React API surface, adapted for SolidJS.
 */

import type { JSX } from 'solid-js';

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

// ─── Component prop interfaces (SolidJS adapted) ────────────────────

export interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'ghost' | 'link';
  size?: SizeVariant;
  color?: ColorVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface TextFieldProps {
  value?: string;
  onInput?: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
  onChange?: JSX.EventHandlerUnion<HTMLInputElement, Event>;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: SizeVariant;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  error?: boolean;
  helperText?: string;
  type?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface SelectOptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: SelectOptionData[];
  size?: SizeVariant;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  label?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  label?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface SliderProps {
  value?: number;
  onInput?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface ChipProps {
  variant?: 'filled' | 'outlined';
  size?: SizeVariant;
  color?: ColorVariant;
  deletable?: boolean;
  disabled?: boolean;
  onDelete?: () => void;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface BadgeProps {
  content?: string | number;
  variant?: 'standard' | 'dot';
  color?: ColorVariant;
  max?: number;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: SizeVariant;
  variant?: 'circular' | 'rounded' | 'square';
  initials?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface TooltipProps {
  content?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
  header?: JSX.Element;
  footer?: JSX.Element;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
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
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onPage?: (page: number) => void;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface AlertProps {
  severity?: 'success' | 'info' | 'warning' | 'error';
  variant?: 'filled' | 'outlined' | 'standard';
  closable?: boolean;
  onClose?: () => void;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  modal?: boolean;
  size?: SizeVariant;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface ProgressProps {
  value?: number;
  variant?: 'determinate' | 'indeterminate';
  type?: 'linear' | 'circular';
  size?: SizeVariant;
  color?: ColorVariant;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
  class?: string;
  style?: JSX.CSSProperties;
}

export interface TabsProps {
  value?: string;
  onChange?: (value: string) => void;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface TabProps {
  value: string;
  disabled?: boolean;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface TabPanelProps {
  value: string;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  size?: string;
  overlay?: boolean;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface BreadcrumbsProps {
  separator?: string;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface PaginationProps {
  count?: number;
  page?: number;
  onChange?: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  size?: SizeVariant;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface AccordionProps {
  multiple?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  title?: string;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface PaperProps {
  variant?: 'elevated' | 'outlined' | 'flat';
  elevation?: number;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface BoxProps {
  as?: string;
  p?: string;
  m?: string;
  display?: string;
  bg?: string;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface StackProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: string;
  align?: string;
  justify?: string;
  wrap?: boolean;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface GridProps {
  columns?: number | string;
  gap?: string;
  rows?: string;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: string;
  class?: string;
  style?: JSX.CSSProperties;
}

export interface ToastOptions {
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export interface ToastEntry extends ToastOptions {
  id: string;
}
