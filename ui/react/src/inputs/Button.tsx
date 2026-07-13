// @risklab/ui — Button component

import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = 'solid' | 'outlined' | 'ghost' | 'soft' | 'link';

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'disabled' | 'style' | 'className' | 'color'
>;

type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'type' | 'style' | 'className' | 'color' | keyof ButtonHTMLAttributes<HTMLButtonElement>
>;

export interface ButtonProps extends BaseProps, NativeButtonProps, NativeAnchorProps {
  /** Visual style variant. */
  variant?: ButtonVariant;
  /** Button size. */
  size?: SizeVariant;
  /** Colour scheme. */
  color?: ColorVariant;
  /** Icon placed before children. */
  startIcon?: ReactNode;
  /** Icon placed after children. */
  endIcon?: ReactNode;
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
  /** Disables the button. */
  disabled?: boolean;
  /** Stretches the button to 100 % width. */
  fullWidth?: boolean;
  /** HTML button type — ignored when rendering an anchor. */
  type?: 'button' | 'submit' | 'reset';
  /** If provided, renders as an anchor (`<a>`) element. */
  href?: string;
  /** Polymorphic element type override. */
  as?: ElementType;
  children?: ReactNode;
}

// ---------------------------------------------------------------------------
// Sizing map ? CSS custom properties
// ---------------------------------------------------------------------------

const SIZE_VARS: Record<SizeVariant, CSSProperties> = {
  xs: {
    '--ui-btn-height': '1.5rem',
    '--ui-btn-padding': '0 0.375rem',
    '--ui-btn-font-size': '0.75rem',
    '--ui-btn-radius': '0.25rem',
    '--ui-btn-icon-size': '0.875rem',
  } as CSSProperties,
  sm: {
    '--ui-btn-height': '2rem',
    '--ui-btn-padding': '0 0.625rem',
    '--ui-btn-font-size': '0.8125rem',
    '--ui-btn-radius': '0.3125rem',
    '--ui-btn-icon-size': '1rem',
  } as CSSProperties,
  md: {
    '--ui-btn-height': '2.5rem',
    '--ui-btn-padding': '0 1rem',
    '--ui-btn-font-size': '0.875rem',
    '--ui-btn-radius': '0.375rem',
    '--ui-btn-icon-size': '1.125rem',
  } as CSSProperties,
  lg: {
    '--ui-btn-height': '3rem',
    '--ui-btn-padding': '0 1.5rem',
    '--ui-btn-font-size': '1rem',
    '--ui-btn-radius': '0.5rem',
    '--ui-btn-icon-size': '1.25rem',
  } as CSSProperties,
  xl: {
    '--ui-btn-height': '3.5rem',
    '--ui-btn-padding': '0 2rem',
    '--ui-btn-font-size': '1.125rem',
    '--ui-btn-radius': '0.625rem',
    '--ui-btn-icon-size': '1.5rem',
  } as CSSProperties,
};

// ---------------------------------------------------------------------------
// Color map ? CSS custom properties per variant
// ---------------------------------------------------------------------------

const COLOR_VARS: Record<
  ColorVariant,
  { base: string; contrast: string; soft: string; softFg: string }
> = {
  primary: { base: 'var(--ui-color-primary, #3b82f6)', contrast: '#fff', soft: 'var(--ui-color-primary-soft, #dbeafe)', softFg: 'var(--ui-color-primary, #3b82f6)' },
  secondary: { base: 'var(--ui-color-secondary, #6366f1)', contrast: '#fff', soft: 'var(--ui-color-secondary-soft, #e0e7ff)', softFg: 'var(--ui-color-secondary, #6366f1)' },
  success: { base: 'var(--ui-color-success, #22c55e)', contrast: '#fff', soft: 'var(--ui-color-success-soft, #dcfce7)', softFg: 'var(--ui-color-success, #22c55e)' },
  warning: { base: 'var(--ui-color-warning, #f59e0b)', contrast: '#fff', soft: 'var(--ui-color-warning-soft, #fef3c7)', softFg: 'var(--ui-color-warning, #f59e0b)' },
  error: { base: 'var(--ui-color-error, #ef4444)', contrast: '#fff', soft: 'var(--ui-color-error-soft, #fee2e2)', softFg: 'var(--ui-color-error, #ef4444)' },
  info: { base: 'var(--ui-color-info, #06b6d4)', contrast: '#fff', soft: 'var(--ui-color-info-soft, #cffafe)', softFg: 'var(--ui-color-info, #06b6d4)' },
  neutral: { base: 'var(--ui-color-neutral, #6b7280)', contrast: '#fff', soft: 'var(--ui-color-neutral-soft, #f3f4f6)', softFg: 'var(--ui-color-neutral, #6b7280)' },
};

function variantStyles(variant: ButtonVariant, color: ColorVariant): CSSProperties {
  const c = COLOR_VARS[color];
  switch (variant) {
    case 'solid':
      return {
        '--ui-btn-bg': c.base,
        '--ui-btn-color': c.contrast,
        '--ui-btn-border': 'transparent',
      } as CSSProperties;
    case 'outlined':
      return {
        '--ui-btn-bg': 'transparent',
        '--ui-btn-color': c.base,
        '--ui-btn-border': c.base,
      } as CSSProperties;
    case 'ghost':
      return {
        '--ui-btn-bg': 'transparent',
        '--ui-btn-color': c.base,
        '--ui-btn-border': 'transparent',
      } as CSSProperties;
    case 'soft':
      return {
        '--ui-btn-bg': c.soft,
        '--ui-btn-color': c.softFg,
        '--ui-btn-border': 'transparent',
      } as CSSProperties;
    case 'link':
      return {
        '--ui-btn-bg': 'transparent',
        '--ui-btn-color': c.base,
        '--ui-btn-border': 'transparent',
        '--ui-btn-padding': '0',
        '--ui-btn-height': 'auto',
        textDecoration: 'underline',
      } as CSSProperties;
  }
}

// ---------------------------------------------------------------------------
// Base inline styles
// ---------------------------------------------------------------------------

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5em',
  height: 'var(--ui-btn-height)',
  padding: 'var(--ui-btn-padding)',
  fontSize: 'var(--ui-btn-font-size)',
  fontFamily: 'inherit',
  fontWeight: 600,
  lineHeight: 1,
  borderRadius: 'var(--ui-btn-radius)',
  border: '1px solid var(--ui-btn-border, transparent)',
  backgroundColor: 'var(--ui-btn-bg)',
  color: 'var(--ui-btn-color)',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'background-color 150ms, color 150ms, border-color 150ms, opacity 150ms',
  outline: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
};

const disabledStyle: CSSProperties = {
  opacity: 0.5,
  pointerEvents: 'none',
};

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      className="ui-btn__spinner"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="50 100"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = 'solid',
      size = 'md',
      color = 'primary',
      startIcon,
      endIcon,
      loading = false,
      disabled = false,
      fullWidth = false,
      type = 'button',
      href,
      as,
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const Component: ElementType = as ?? (href ? 'a' : 'button');
    const isDisabled = disabled || loading;

    const resolvedStyle: CSSProperties = {
      ...baseStyle,
      ...SIZE_VARS[size],
      ...variantStyles(variant, color),
      ...(fullWidth ? { width: '100%' } : undefined),
      ...(isDisabled ? disabledStyle : undefined),
      ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : undefined),
      ...(Array.isArray(xstyle)
        ? xstyle.reduce<Record<string, string | number>>(
            (acc, s) => (s ? { ...acc, ...s } : acc),
            {},
          )
        : undefined),
      ...style,
    };

    const elementProps: Record<string, unknown> = {
      ref,
      className: cx('ui-btn', className),
      style: resolvedStyle,
      'data-testid': testId,
      'data-variant': variant,
      'data-size': size,
      'data-color': color,
      'aria-busy': loading || undefined,
      'aria-disabled': isDisabled || undefined,
      ...rest,
    };

    if (Component === 'button') {
      elementProps.type = type;
      elementProps.disabled = isDisabled;
    } else if (Component === 'a') {
      elementProps.href = href;
      elementProps.role = 'button';
      if (isDisabled) {
        elementProps.tabIndex = -1;
        elementProps['aria-disabled'] = true;
      }
    }

    return (
      <Component {...elementProps}>
        {loading ? <Spinner /> : startIcon && <span aria-hidden="true" className="ui-btn__icon">{startIcon}</span>}
        {children}
        {endIcon && !loading && (
          <span aria-hidden="true" className="ui-btn__icon">{endIcon}</span>
        )}
      </Component>
    );
  },
);
