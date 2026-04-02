// @risklab/ui � TextField component

import {
  forwardRef,
  useId,
  type CSSProperties,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import type { SizeVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TextFieldVariant = 'outlined' | 'filled' | 'underlined';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'style' | 'className' | 'type'
>;

type NativeTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'style' | 'className' | keyof InputHTMLAttributes<HTMLInputElement>
>;

export interface TextFieldProps extends BaseProps, NativeInputProps, NativeTextareaProps {
  /** Visible label text. */
  label?: string;
  /** Helper text below the input. */
  helperText?: string;
  /** Error state � `true` uses only the error styling, a string also displays the message. */
  error?: boolean | string;
  /** Element rendered before the input (inside wrapper). */
  startAdornment?: ReactNode;
  /** Element rendered after the input (inside wrapper). */
  endAdornment?: ReactNode;
  /** Visual variant. */
  variant?: TextFieldVariant;
  /** Input size. */
  size?: SizeVariant;
  /** Render a `<textarea>` instead of `<input>`. */
  multiline?: boolean;
  /** Visible rows when multiline. */
  rows?: number;
  /** Max rows (textarea auto-grow hint). */
  maxRows?: number;
  /** Stretch to full width. */
  fullWidth?: boolean;
  /** HTML required flag. */
  required?: boolean;
  /** Standard HTML input type (text, password, number�). */
  type?: string;
}

// ---------------------------------------------------------------------------
// Styles are now in ui.css: .ui-textfield, .ui-textfield__label, .ui-textfield__wrapper,
//   .ui-textfield__input, .ui-textfield__adornment, .ui-textfield__helper
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  function TextField(
    {
      label,
      helperText,
      error,
      startAdornment,
      endAdornment,
      variant = 'outlined',
      size = 'md',
      multiline = false,
      rows,
      maxRows,
      fullWidth = false,
      required = false,
      type = 'text',
      disabled,
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

    const userStyle: CSSProperties | undefined = (style || xstyle || fullWidth)
      ? {
          ...(fullWidth ? { width: '100%' } : undefined),
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

    const mergedWrapperStyle: CSSProperties | undefined = userStyle;

    const InputTag = multiline ? 'textarea' : 'input';

    const inputProps: Record<string, unknown> = {
      ref,
      id: inputId,
      className: cx('ui-textfield__input', multiline && 'ui-textfield__input--multiline'),
      style: multiline
        ? {
            maxHeight: maxRows !== undefined ? `calc(${maxRows} * 1.5em)` : undefined,
            overflowY: maxRows !== undefined ? ('auto' as const) : undefined,
          }
        : undefined,
      disabled,
      required,
      'aria-invalid': hasError ? 'true' : undefined,
      'aria-describedby': (helperText || errorMessage) ? helperId : undefined,
      ...rest,
    };

    if (!multiline) {
      inputProps.type = type;
    } else {
      if (rows !== undefined) inputProps.rows = rows;
    }

    return (
      <div
        className={cx('ui-textfield', className)}
        {...(mergedWrapperStyle ? { style: mergedWrapperStyle } : undefined)}
        data-testid={testId}
        data-variant={variant}
        data-size={size}
        data-error={hasError || undefined}
      >
        {label && (
          <label htmlFor={inputId} className="ui-textfield__label">
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        )}

        <div
          className={cx(
            'ui-textfield__wrapper',
            multiline && 'ui-textfield__wrapper--multiline',
            disabled && 'ui-textfield__wrapper--disabled',
          )}
        >
          {startAdornment && <span aria-hidden="true" className="ui-textfield__adornment">{startAdornment}</span>}
          <InputTag {...inputProps} />
          {endAdornment && <span aria-hidden="true" className="ui-textfield__adornment">{endAdornment}</span>}
        </div>

        {(helperText || errorMessage) && (
          <p
            id={helperId}
            role={hasError ? 'alert' : undefined}
            className={cx('ui-textfield__helper', hasError ? 'ui-textfield__helper--error' : 'ui-textfield__helper--normal')}
          >
            {errorMessage ?? helperText}
          </p>
        )}
      </div>
    );
  },
);
