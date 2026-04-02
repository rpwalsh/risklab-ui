import React, { forwardRef, useRef, useCallback } from 'react';
import type { SizeVariant, ColorVariant } from '../styling/types';
import { cx } from '../styling/cx';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: 'numeric' | 'alphanumeric' | 'alphabetic';
  mask?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  size?: SizeVariant;
  color?: ColorVariant;
  error?: boolean | string;
  label?: string;
  helperText?: string;
  separator?: React.ReactNode;
  gap?: number;
  placeholder?: string;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

// Cell sizes are now in CSS via data-size attribute selectors

function isAllowed(char: string, type: OTPInputProps['type']): boolean {
  if (type === 'numeric') return /^\d$/.test(char);
  if (type === 'alphabetic') return /^[a-zA-Z]$/.test(char);
  return /^[a-zA-Z0-9]$/.test(char);
}

export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(function OTPInput(
  {
    length = 6,
    value: controlledValue,
    onChange,
    onComplete,
    type = 'numeric',
    mask = false,
    disabled = false,
    autoFocus = false,
    size = 'md',
    color = 'primary',
    error = false,
    label,
    helperText,
    separator,
    gap = 8,
    placeholder = '○',
    xstyle,
    className,
    style,
    testId,
  },
  ref
) {
  const [internalValue, setInternalValue] = React.useState('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');
  const hasError = !!error;
  const errorMsg = typeof error === 'string' ? error : helperText;

  const focusCell = useCallback((idx: number) => {
    const el = inputsRef.current[Math.max(0, Math.min(length - 1, idx))];
    el?.focus();
    el?.select();
  }, [length]);

  const handleChange = useCallback((idx: number, char: string) => {
    if (!isAllowed(char, type)) return;
    const next = digits.map((d, i) => (i === idx ? char.toUpperCase() : d)).join('');
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
    if (next.length === length && next.split('').every(c => c.trim() !== '')) onComplete?.(next);
    focusCell(idx + 1);
  }, [digits, type, controlledValue, onChange, onComplete, length, focusCell]);

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = digits.map((d, i) => (i === idx ? '' : d)).join('');
      if (controlledValue === undefined) setInternalValue(next);
      onChange?.(next);
      focusCell(digits[idx] ? idx : idx - 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); focusCell(idx - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); focusCell(idx + 1);
    } else if (e.key === 'Delete') {
      e.preventDefault();
      const next = digits.map((d, i) => (i === idx ? '' : d)).join('');
      if (controlledValue === undefined) setInternalValue(next);
      onChange?.(next);
    }
  }, [digits, controlledValue, onChange, focusCell]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\s/g, '');
    const filtered = pasted.split('').filter(c => isAllowed(c, type)).slice(0, length).join('').toUpperCase();
    const padded = filtered.padEnd(length, '').slice(0, length);
    if (controlledValue === undefined) setInternalValue(padded);
    onChange?.(padded);
    if (padded.replace(/ /g, '').length === length) onComplete?.(padded);
    focusCell(Math.min(length - 1, filtered.length));
  }, [type, length, controlledValue, onChange, onComplete, focusCell]);

  return (
    <div
      ref={ref}
      className={cx('ui-otp-input', className)}
      data-size={size}
      data-testid={testId}
      {...(style || xstyle ? { style: { ...(xstyle && !Array.isArray(xstyle) ? xstyle as React.CSSProperties : {}), ...style } } : {})}
    >
      {label && (
        <label className={cx('ui-otp-input__label', hasError && 'ui-otp-input__label--error')}>
          {label}
        </label>
      )}
      <div
        role="group"
        aria-label={label ?? 'One-time password'}
        className="ui-otp-input__slots"
        style={{ gap: `${gap}px` }}
        onPaste={handlePaste}
      >
        {digits.map((digit, idx) => (
          <React.Fragment key={idx}>
            {separator && idx > 0 && idx === Math.floor(length / 2) && (
              <span className="ui-otp-input__separator">
                {separator}
              </span>
            )}
            <input
              ref={el => { inputsRef.current[idx] = el; }}
              type={mask ? 'password' : 'text'}
              inputMode={type === 'numeric' ? 'numeric' : 'text'}
              aria-label={`Digit ${idx + 1} of ${length}`}
              maxLength={1}
              value={digit}
              disabled={disabled}
              autoFocus={autoFocus && idx === 0}
              placeholder={digit ? '' : placeholder}
              className="ui-otp-input__input"
              style={{
                borderColor: hasError ? 'var(--ui-color-error)' : digit ? `var(--ui-color-${color}, var(--ui-color-primary))` : undefined,
              }}
              onChange={(e) => {
                const char = e.target.value.slice(-1);
                if (char) handleChange(idx, char);
              }}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onFocus={(e) => e.target.select()}
            />
          </React.Fragment>
        ))}
      </div>
      {(errorMsg || helperText) && (
        <p className={cx('ui-otp-input__helper', hasError && 'ui-otp-input__helper--error')}>
          {errorMsg ?? helperText}
        </p>
      )}
    </div>
  );
});
