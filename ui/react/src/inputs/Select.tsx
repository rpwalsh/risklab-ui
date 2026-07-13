// @risklab/ui — Select component

import {
  forwardRef,
  useId,
  type CSSProperties,
  type SelectHTMLAttributes,
  type ChangeEvent,
} from 'react';
import type { SizeVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SelectVariant = 'outlined' | 'filled' | 'underlined';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends BaseProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'style' | 'className' | 'onChange' | 'value' | 'multiple'> {
  /** Visible label text. */
  label?: string;
  /** Options to render. */
  options: SelectOption[];
  /** Controlled value. */
  value?: string | string[];
  /** Change handler. */
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  /** Allow multiple selections. */
  multiple?: boolean;
  /** Placeholder option text. */
  placeholder?: string;
  /** Error state. */
  error?: boolean | string;
  /** Helper text. */
  helperText?: string;
  /** Visual variant. */
  variant?: SelectVariant;
  /** Select size. */
  size?: SizeVariant;
  /** Stretch to full width. */
  fullWidth?: boolean;
}

// ---------------------------------------------------------------------------
// Styles are now in ui.css: .ui-select, .ui-select__label, .ui-select__native, .ui-select__helper
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      options,
      value,
      onChange,
      multiple = false,
      placeholder,
      error,
      helperText,
      variant = 'outlined',
      size = 'md',
      fullWidth = false,
      disabled,
      required,
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
    const selectId = idProp ?? autoId;
    const helperId = `${selectId}-helper`;

    const hasError = error === true || typeof error === 'string';
    const errorMessage = typeof error === 'string' ? error : undefined;

    const mergedWrapperStyle: CSSProperties | undefined = (xstyle || style || fullWidth)
      ? {
          ...(fullWidth ? { width: '100%' } : { width: 'fit-content' }),
          ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : undefined),
          ...(Array.isArray(xstyle)
            ? xstyle.reduce<Record<string, string | number>>(
                (acc, s) => (s ? { ...acc, ...s } : acc),
                {},
              )
            : undefined),
          ...style,
        }
      : undefined;

    return (
      <div
        className={cx('ui-select', className)}
        {...(mergedWrapperStyle ? { style: mergedWrapperStyle } : undefined)}
        data-testid={testId}
        data-variant={variant}
        data-size={size}
        data-error={hasError || undefined}
      >
        {label && (
          <label htmlFor={selectId} className="ui-select__label">
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={onChange}
          multiple={multiple}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={(helperText || errorMessage) ? helperId : undefined}
          className={cx('ui-select__native', multiple && 'ui-select__native--multiple')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {(helperText || errorMessage) && (
          <p
            id={helperId}
            role={hasError ? 'alert' : undefined}
            className={cx('ui-select__helper', hasError ? 'ui-select__helper--error' : 'ui-select__helper--normal')}
          >
            {errorMessage ?? helperText}
          </p>
        )}
      </div>
    );
  },
);
