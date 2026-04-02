import React, { forwardRef, useCallback } from 'react';
import type { SizeVariant } from '../styling/types';
import { cx, sx } from '../styling';

export interface NumberInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  clampValueOnBlur?: boolean;
  keepWithinRange?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  label?: string;
  error?: boolean | string;
  helperText?: string;
  size?: SizeVariant;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
  allowMouseWheel?: boolean;
  format?: (value: number) => string;
  parse?: (value: string) => number;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

const sizeMap: Record<SizeVariant, { height: string; fontSize: string; btnW: string }> = {
  xs: { height: '28px', fontSize: 'var(--ui-text-xs, 12px)', btnW: '24px' },
  sm: { height: '32px', fontSize: 'var(--ui-text-sm, 14px)', btnW: '28px' },
  md: { height: '40px', fontSize: 'var(--ui-text-sm, 14px)', btnW: '32px' },
  lg: { height: '48px', fontSize: 'var(--ui-text-base, 16px)', btnW: '38px' },
  xl: { height: '56px', fontSize: 'var(--ui-text-lg, 18px)', btnW: '44px' },
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value: controlledValue,
    defaultValue = 0,
    onChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    precision = 0,
    clampValueOnBlur = true,
    keepWithinRange = true,
    disabled = false,
    readOnly = false,
    placeholder,
    label,
    error,
    helperText,
    size = 'md',
    prefix,
    suffix,
    fullWidth = false,
    allowMouseWheel = false,
    format,
    parse,
    xstyle,
    testId,
    className,
    style,
    ...rest
  },
  ref
) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [inputStr, setInputStr] = React.useState(String(defaultValue));

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const sz = sizeMap[size];
  const hasError = !!error;
  const errorMsg = typeof error === 'string' ? error : helperText;
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;
  const rootSx = sx({
    display: fullWidth ? 'block' : 'inline-block',
    width: fullWidth ? '100%' : null,
    ...(style as Record<string, string | number> | undefined),
    ...(mergedExternalStyles as Record<string, string | number> | undefined),
  });
  const labelSx = sx({ display: 'block', marginBottom: '4px', fontSize: 'var(--ui-text-sm, 14px)', fontWeight: 500, color: hasError ? 'var(--ui-color-error)' : 'var(--ui-color-text)' });
  const controlSx = sx({
    display: 'flex',
    alignItems: 'stretch',
    border: `1.5px solid ${hasError ? 'var(--ui-color-error)' : 'var(--ui-color-border, #e2e8f0)'}`,
    borderRadius: 'var(--ui-radius-md, 8px)',
    overflow: 'hidden',
    background: disabled ? 'var(--ui-color-surface-variant)' : 'var(--ui-color-surface, #fff)',
    width: fullWidth ? '100%' : null,
  });
  const stepButtonBase = { border: 'none', background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ui-color-text-secondary)', flexShrink: 0, fontSize: '16px', fontWeight: 300, transition: 'background var(--ui-transition-fast)' };
  const decrementSx = sx({ width: sz.btnW, height: sz.height, borderRight: '1px solid var(--ui-color-border)', ...stepButtonBase });
  const incrementSx = sx({ width: sz.btnW, height: sz.height, borderLeft: '1px solid var(--ui-color-border)', ...stepButtonBase });
  const fieldWrapSx = sx({ flex: 1, display: 'flex', alignItems: 'center', paddingInline: '8px', gap: '4px' });
  const adornmentSx = sx({ color: 'var(--ui-color-text-secondary)', fontSize: sz.fontSize, flexShrink: 0 });
  const inputSx = sx({ flex: 1, border: 'none', outline: 'none', background: 'transparent', textAlign: 'center', fontSize: sz.fontSize, color: 'var(--ui-color-text)', height: sz.height, minWidth: 0 });
  const helperSx = sx({ margin: '4px 0 0', fontSize: 'var(--ui-text-xs, 12px)', color: hasError ? 'var(--ui-color-error)' : 'var(--ui-color-text-secondary)' });

  const clamp = useCallback((v: number) => Math.min(max, Math.max(min, v)), [min, max]);

  const setValue = useCallback((v: number) => {
    const clamped = keepWithinRange ? clamp(v) : v;
    const rounded = precision > 0 ? parseFloat(clamped.toFixed(precision)) : Math.round(clamped);
    if (controlledValue === undefined) {
      setInternalValue(rounded);
      setInputStr(format ? format(rounded) : String(rounded));
    }
    onChange?.(rounded);
  }, [clamp, precision, controlledValue, onChange, keepWithinRange, format]);

  const increment = useCallback(() => { if (!disabled && !readOnly) setValue(value + step); }, [disabled, readOnly, setValue, value, step]);
  const decrement = useCallback(() => { if (!disabled && !readOnly) setValue(value - step); }, [disabled, readOnly, setValue, value, step]);

  return (
    <div
      className={cx('ui-number-input', className, rootSx.className)}
      data-testid={testId}
      {...rest}
    >
      {label && (
        <label className={cx('ui-number-input__label', labelSx.className)}>
          {label}
        </label>
      )}
      <div className={cx('ui-number-input__control', controlSx.className)}>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Decrease"
          disabled={disabled || (keepWithinRange && value <= min)}
          onClick={decrement}
          className={cx('ui-number-input__decrement', decrementSx.className)}
        >
          −
        </button>
        <div className={cx('ui-number-input__field-wrap', fieldWrapSx.className)}>
          {prefix && <span className={cx('ui-number-input__prefix', adornmentSx.className)}>{prefix}</span>}
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={format ? format(value) : inputStr}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={cx('ui-number-input__input', inputSx.className)}
            onChange={(e) => setInputStr(e.target.value)}
            onBlur={(e) => {
              const parsed = parse ? parse(e.target.value) : parseFloat(e.target.value);
              if (!isNaN(parsed)) {
                setValue(clampValueOnBlur ? clamp(parsed) : parsed);
              } else {
                setInputStr(String(value));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') { e.preventDefault(); increment(); }
              if (e.key === 'ArrowDown') { e.preventDefault(); decrement(); }
            }}
            onWheel={allowMouseWheel ? (e) => {
              e.preventDefault();
              if (e.deltaY < 0) {
                increment();
              } else {
                decrement();
              }
            } : undefined}
          />
          {suffix && <span className={cx('ui-number-input__suffix', adornmentSx.className)}>{suffix}</span>}
        </div>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Increase"
          disabled={disabled || (keepWithinRange && value >= max)}
          onClick={increment}
          className={cx('ui-number-input__increment', incrementSx.className)}
        >
          +
        </button>
      </div>
      {(errorMsg || helperText) && (
        <p className={cx('ui-number-input__helper', helperSx.className)}>
          {errorMsg ?? helperText}
        </p>
      )}
    </div>
  );
});
