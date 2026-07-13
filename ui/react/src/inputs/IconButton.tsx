// @risklab/ui — IconButton component

import React, {
  forwardRef,
  type ReactNode,
  type ButtonHTMLAttributes,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IconButtonVariant = 'solid' | 'outlined' | 'ghost' | 'soft';

export interface IconButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style' | 'className' | 'color' | 'children'> {
  /** The icon element to render. */
  icon: ReactNode;
  /** Accessible label — applied as `aria-label`. */
  label: string;
  /** Visual style variant. */
  variant?: IconButtonVariant;
  /** Button size. */
  size?: SizeVariant;
  /** Colour scheme. */
  color?: ColorVariant;
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
  /** Disables the button. */
  disabled?: boolean;
}



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
      className="ui-icon-btn__spinner"
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

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      label,
      variant = 'solid',
      size = 'md',
      color = 'primary',
      loading = false,
      disabled = false,
      className,
      style,
      xstyle,
      testId,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    const userStyle = (() => {
      let s: Record<string, unknown> = {};
      if (typeof xstyle === 'object' && !Array.isArray(xstyle)) {
        s = { ...s, ...xstyle };
      }
      if (Array.isArray(xstyle)) {
        for (const x of xstyle) { if (x) { s = { ...s, ...x }; } }
      }
      if (style) { s = { ...s, ...style }; }
      return Object.keys(s).length > 0 ? s : undefined;
    })();

    return (
      <button
        ref={ref}
        type="button"
        className={cx('ui-icon-btn', isDisabled && 'ui-icon-btn--disabled', className)}
        {...(userStyle ? { style: userStyle as React.CSSProperties } : undefined)}
        aria-label={label}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        disabled={isDisabled}
        data-testid={testId}
        data-variant={variant}
        data-size={size}
        data-color={color}
        {...rest}
      >
        {loading ? <Spinner /> : icon}
      </button>
    );
  },
);
