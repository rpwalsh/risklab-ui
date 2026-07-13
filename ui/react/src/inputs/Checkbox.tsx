// @risklab/ui — Checkbox component

import {
  forwardRef,
  useId,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type InputHTMLAttributes,
  type ChangeEvent,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';
import { sx } from '../styling/atomic-runtime';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckboxProps
  extends BaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'className' | 'type' | 'onChange' | 'color'> {
  /** Label content. */
  label?: string | ReactNode;
  /** Controlled check state. */
  checked?: boolean;
  /** Default check state (uncontrolled). */
  defaultChecked?: boolean;
  /** Indeterminate (mixed) state. */
  indeterminate?: boolean;
  /** Change handler. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Checkbox size. */
  size?: SizeVariant;
  /** Color scheme. */
  color?: ColorVariant;
  /** Disabled state. */
  disabled?: boolean;
  /** Error state. */
  error?: boolean | string;
  /** Helper text. */
  helperText?: string;
}

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

const SIZE_VARS: Record<SizeVariant, CSSProperties> = {
  xs: { '--ui-cb-size': '0.875rem', '--ui-cb-font-size': '0.75rem', '--ui-cb-radius': '0.125rem' } as CSSProperties,
  sm: { '--ui-cb-size': '1rem', '--ui-cb-font-size': '0.8125rem', '--ui-cb-radius': '0.1875rem' } as CSSProperties,
  md: { '--ui-cb-size': '1.25rem', '--ui-cb-font-size': '0.875rem', '--ui-cb-radius': '0.25rem' } as CSSProperties,
  lg: { '--ui-cb-size': '1.5rem', '--ui-cb-font-size': '1rem', '--ui-cb-radius': '0.3125rem' } as CSSProperties,
  xl: { '--ui-cb-size': '1.75rem', '--ui-cb-font-size': '1.125rem', '--ui-cb-radius': '0.375rem' } as CSSProperties,
};

// ---------------------------------------------------------------------------
// Color map
// ---------------------------------------------------------------------------

function colorVars(color: ColorVariant): CSSProperties {
  return {
    '--ui-cb-accent': `var(--ui-color-${color}, #3b82f6)`,
  } as CSSProperties;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const wrapperStyle: CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'column',
  gap: '0.25rem',
  fontFamily: 'inherit',
};

const labelRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5em',
  cursor: 'pointer',
  fontSize: 'var(--ui-cb-font-size)',
  userSelect: 'none',
};

const inputStyle: CSSProperties = {
  width: 'var(--ui-cb-size)',
  height: 'var(--ui-cb-size)',
  accentColor: 'var(--ui-cb-accent)',
  borderRadius: 'var(--ui-cb-radius)',
  cursor: 'pointer',
  margin: 0,
  flexShrink: 0,
};

const helperTextStyle: CSSProperties = {
  fontSize: '0.75rem',
  margin: 0,
  paddingLeft: 'calc(var(--ui-cb-size) + 0.5em)',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      checked,
      defaultChecked,
      indeterminate = false,
      onChange,
      size = 'md',
      color = 'primary',
      disabled = false,
      error,
      helperText,
      className,
      style,
      xstyle,
      testId,
      id: idProp,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = idProp ?? autoId;
    const helperId = `${inputId}-helper`;

    const hasError = error === true || typeof error === 'string';
    const errorMessage = typeof error === 'string' ? error : undefined;

    // Handle indeterminate — needs imperative DOM access
    const internalRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const resolvedStyle: CSSProperties = {
      ...wrapperStyle,
      ...SIZE_VARS[size],
      ...colorVars(color),
      ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : undefined),
      ...(Array.isArray(xstyle)
        ? xstyle.reduce<Record<string, string | number>>(
            (acc, s) => (s ? { ...acc, ...s } : acc),
            {},
          )
        : undefined),
      ...style,
    };

    const rootSx = sx(resolvedStyle as Record<string, string | number | null>);
    const labelSx = sx({
      ...labelRowStyle,
      ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : undefined),
    } as Record<string, string | number | null>);
    const inputSx = sx({
      ...inputStyle,
      ...(disabled ? { cursor: 'not-allowed' } : undefined),
    } as Record<string, string | number | null>);
    const helperSx = sx({
      ...helperTextStyle,
      color: hasError
        ? 'var(--ui-color-error, #ef4444)'
        : 'var(--ui-cb-helper-color, #6b7280)',
    } as Record<string, string | number | null>);

    return (
      <div
        className={cx('ui-checkbox', className, rootSx.className)}
        data-testid={testId}
        data-size={size}
        data-color={color}
        data-error={hasError || undefined}
      >
        <label
          htmlFor={inputId}
          className={cx('ui-checkbox__label', labelSx.className)}
        >
          <input
            ref={(node) => {
              internalRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }}
            id={inputId}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            aria-describedby={(helperText || errorMessage) ? helperId : undefined}
            className={cx('ui-checkbox__input', inputSx.className)}
            {...(hasError ? { 'aria-invalid': 'true' } : {})}
            {...rest}
          />
          {label && <span>{label}</span>}
        </label>

        {hasError && (helperText || errorMessage) && (
          <p
            id={helperId}
            role="alert"
            className={cx('ui-checkbox__helper', helperSx.className)}
          >
            {errorMessage ?? helperText}
          </p>
        )}

        {!hasError && (helperText || errorMessage) && (
          <p
            id={helperId}
            className={cx('ui-checkbox__helper', helperSx.className)}
          >
            {errorMessage ?? helperText}
          </p>
        )}
      </div>
    );
  },
);
