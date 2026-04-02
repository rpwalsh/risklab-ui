import React, { createContext, useContext, forwardRef, useId } from 'react';
import type { SizeVariant, ColorVariant } from '../styling/types';

// ─── Context ───────────────────────────────────────────────────────────────────

interface FormControlContextValue {
  /** Unique ID for this form control group. Use as `id` on the input element. */
  id: string;
  labelId: string;
  helperTextId: string;
  errorId: string;
  disabled: boolean;
  required: boolean;
  error: boolean;
  focused: boolean;
  size: SizeVariant;
  color: ColorVariant;
  setFocused: (v: boolean) => void;
  fullWidth: boolean;
}

const FormControlContext = createContext<FormControlContextValue | null>(null);

export function useFormControl() {
  return useContext(FormControlContext);
}

// ─── FormControl ────────────────────────────────────────────────────────────────

export interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  fullWidth?: boolean;
  focused?: boolean;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(function FormControl(
  { children, disabled = false, required = false, error = false, size = 'md', color = 'primary', fullWidth = false, focused: controlledFocused, xstyle, testId, className, style, ...rest },
  ref
) {
  const uid = useId();
  const [internalFocused, setFocused] = React.useState(false);
  const focused = controlledFocused !== undefined ? controlledFocused : internalFocused;

  return (
    <FormControlContext.Provider value={{ id: uid, labelId: `${uid}-label`, helperTextId: `${uid}-helper`, errorId: `${uid}-error`, disabled, required, error, focused, size, color, setFocused, fullWidth }}>
      <div
        ref={ref}
        className={['ui-form-control', className].filter(Boolean).join(' ')}
        data-testid={testId}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          width: fullWidth ? '100%' : undefined,
          ...style,
          ...(xstyle && !Array.isArray(xstyle) ? xstyle as React.CSSProperties : {}),
        }}
        {...rest}
      >
        {children}
      </div>
    </FormControlContext.Provider>
  );
});

// ─── FormLabel ────────────────────────────────────────────────────────────────

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  error?: boolean;
  focused?: boolean;
  disabled?: boolean;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(function FormLabel(
  { children, required: requiredProp, error: errorProp, focused: focusedProp, disabled: disabledProp, xstyle, style, className, ...rest },
  ref
) {
  const ctx = useFormControl();
  const required = requiredProp ?? ctx?.required ?? false;
  const error = errorProp ?? ctx?.error ?? false;
  const focused = focusedProp ?? ctx?.focused ?? false;
  const disabled = disabledProp ?? ctx?.disabled ?? false;

  return (
    <label
      ref={ref}
      id={ctx?.labelId}
      htmlFor={ctx?.id}
      className={['ui-form-label', className].filter(Boolean).join(' ')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        fontSize: 'var(--ui-text-sm, 14px)',
        fontWeight: 500,
        color: error ? 'var(--ui-color-error)' : focused ? `var(--ui-color-${ctx?.color ?? 'primary'}, var(--ui-color-primary))` : disabled ? 'var(--ui-color-text-disabled)' : 'var(--ui-color-text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'color var(--ui-transition-fast)',
        ...style,
        ...(xstyle && !Array.isArray(xstyle) ? xstyle as React.CSSProperties : {}),
      }}
      {...rest}
    >
      {children}
      {required && <span aria-hidden="true" style={{ color: 'var(--ui-color-error)', marginLeft: '2px' }}>*</span>}
    </label>
  );
});

// ─── FormHelperText ───────────────────────────────────────────────────────────

export interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean;
  disabled?: boolean;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
}

export const FormHelperText = forwardRef<HTMLParagraphElement, FormHelperTextProps>(function FormHelperText(
  { children, error: errorProp, disabled: disabledProp, xstyle, style, className, ...rest },
  ref
) {
  const ctx = useFormControl();
  const error = errorProp ?? ctx?.error ?? false;
  const disabled = disabledProp ?? ctx?.disabled ?? false;

  return (
    <p
      ref={ref}
      id={error ? ctx?.errorId : ctx?.helperTextId}
      role={error ? 'alert' : undefined}
      className={['ui-form-helper-text', className].filter(Boolean).join(' ')}
      style={{
        margin: 0,
        fontSize: 'var(--ui-text-xs, 12px)',
        color: error ? 'var(--ui-color-error)' : disabled ? 'var(--ui-color-text-disabled)' : 'var(--ui-color-text-secondary)',
        lineHeight: 1.4,
        ...style,
        ...(xstyle && !Array.isArray(xstyle) ? xstyle as React.CSSProperties : {}),
      }}
      {...rest}
    >
      {children}
    </p>
  );
});

// ─── FormErrorMessage ─────────────────────────────────────────────────────────

export interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
}

export const FormErrorMessage = forwardRef<HTMLParagraphElement, FormErrorMessageProps>(function FormErrorMessage(
  { children, xstyle, style, className, ...rest },
  ref
) {
  const ctx = useFormControl();
  if (!ctx?.error) return null;

  return (
    <p
      ref={ref}
      id={ctx.errorId}
      role="alert"
      aria-live="polite"
      className={['ui-form-error-message', className].filter(Boolean).join(' ')}
      style={{
        margin: 0,
        fontSize: 'var(--ui-text-xs, 12px)',
        color: 'var(--ui-color-error)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        ...style,
        ...(xstyle && !Array.isArray(xstyle) ? xstyle as React.CSSProperties : {}),
      }}
      {...rest}
    >
      <span aria-hidden="true">⚠</span>
      {children}
    </p>
  );
});
