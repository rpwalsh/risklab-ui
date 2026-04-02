import React, { forwardRef, useRef, useState, KeyboardEvent } from 'react';
import type { SizeVariant, ColorVariant } from '../styling/types';
import { cx, sx } from '../styling';

export interface TagInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string, index: number) => void;
  max?: number;
  allowDuplicates?: boolean;
  addOnEnter?: boolean;
  addOnBlur?: boolean;
  addOnComma?: boolean;
  separator?: string | RegExp;
  validate?: (tag: string) => boolean | string;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  placeholder?: string;
  error?: boolean | string;
  helperText?: string;
  size?: SizeVariant;
  color?: ColorVariant;
  clearable?: boolean;
  fullWidth?: boolean;
  renderTag?: (tag: string, index: number, onRemove: () => void) => React.ReactNode;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

const tagColorMap: Record<string, string> = {
  primary: 'var(--ui-color-primary-light, #eff6ff)',
  secondary: 'var(--ui-color-secondary-light, #faf5ff)',
  success: 'var(--ui-color-success-light, #f0fdf4)',
  warning: 'var(--ui-color-warning-light, #fffbeb)',
  error: 'var(--ui-color-error-light, #fef2f2)',
};

export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(function TagInput(
  {
    value: controlledValue,
    defaultValue = [],
    onChange,
    onTagAdd,
    onTagRemove,
    max,
    allowDuplicates = false,
    addOnEnter = true,
    addOnBlur = false,
    addOnComma = true,
    separator = /[,;]/,
    validate,
    disabled = false,
    readOnly = false,
    label,
    placeholder = 'Add tag...',
    error = false,
    helperText,
    size = 'md',
    color = 'primary',
    clearable = false,
    fullWidth = false,
    renderTag,
    xstyle,
    testId,
    className,
    style,
    ...rest
  },
  ref
) {
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
  const [input, setInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = controlledValue !== undefined ? controlledValue : internalTags;
  const hasError = !!error;
  const errorMsg = typeof error === 'string' ? error : undefined;
  const sizeMap = { xs: 22, sm: 24, md: 28, lg: 32, xl: 36 };
  const chipH = sizeMap[size];
  const fontSize = size === 'xs' ? '11px' : size === 'sm' ? '12px' : size === 'lg' ? '14px' : size === 'xl' ? '15px' : '13px';
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;
  const rootSx = sx({
    display: fullWidth ? 'block' : 'inline-block',
    width: fullWidth ? '100%' : null,
    ...(style as Record<string, string | number> | undefined),
    ...(mergedExternalStyles as Record<string, string | number> | undefined),
  });
  const labelSx = sx({ display: 'block', marginBottom: '4px', fontSize: 'var(--ui-text-sm, 14px)', fontWeight: 500, color: hasError ? 'var(--ui-color-error)' : 'var(--ui-color-text)', cursor: 'pointer' });
  const controlSx = sx({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    minHeight: `${chipH + 20}px`,
    border: `1.5px solid ${validationError || hasError ? 'var(--ui-color-error)' : 'var(--ui-color-border, #e2e8f0)'}`,
    borderRadius: 'var(--ui-radius-md, 8px)',
    background: disabled ? 'var(--ui-color-surface-variant)' : 'var(--ui-color-surface, #fff)',
    cursor: disabled ? 'not-allowed' : 'text',
    transition: 'border-color var(--ui-transition-fast)',
    width: fullWidth ? '100%' : null,
    boxSizing: 'border-box',
  });
  const tagSx = sx({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    height: `${chipH}px`,
    padding: '0 8px',
    background: tagColorMap[color] ?? tagColorMap.primary,
    color: `var(--ui-color-${color}, var(--ui-color-primary))`,
    borderRadius: `${chipH / 2}px`,
    fontSize,
    fontWeight: 500,
    userSelect: 'none',
    animation: 'ui-pop-in 0.15s ease',
  });
  const removeButtonSx = sx({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', opacity: 0.7, padding: 0, fontSize: '12px', borderRadius: '50%', lineHeight: 1 });
  const inputSx = sx({ flex: '1 1 120px', minWidth: '80px', border: 'none', outline: 'none', background: 'transparent', fontSize, color: 'var(--ui-color-text)', height: `${chipH}px`, padding: 0 });
  const clearButtonSx = sx({ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ui-color-text-secondary)', fontSize: '16px', padding: '0 2px', display: 'flex', alignItems: 'center' });
  const helperSx = sx({ margin: '4px 0 0', fontSize: 'var(--ui-text-xs, 12px)', color: (validationError || hasError) ? 'var(--ui-color-error)' : 'var(--ui-color-text-secondary)' });
  const counterSx = sx({ margin: '4px 0 0', fontSize: 'var(--ui-text-xs, 12px)', color: 'var(--ui-color-text-secondary)', textAlign: 'right' });

  const addTag = (raw: string) => {
    const parts = typeof separator === 'string'
      ? raw.split(separator)
      : raw.split(separator);
    let updated = [...tags];
    let added = false;
    for (const part of parts) {
      const tag = part.trim();
      if (!tag) continue;
      if (!allowDuplicates && updated.includes(tag)) continue;
      if (max !== undefined && updated.length >= max) break;
      if (validate) {
        const result = validate(tag);
        if (result !== true) {
          setValidationError(typeof result === 'string' ? result : 'Invalid tag');
          continue;
        }
      }
      setValidationError(null);
      updated = [...updated, tag];
      onTagAdd?.(tag);
      added = true;
    }
    if (added) {
      if (controlledValue === undefined) setInternalTags(updated);
      onChange?.(updated);
    }
    setInput('');
  };

  const removeTag = (idx: number) => {
    if (disabled || readOnly) return;
    const tag = tags[idx];
    const next = tags.filter((_, i) => i !== idx);
    if (controlledValue === undefined) setInternalTags(next);
    onChange?.(next);
    onTagRemove?.(tag, idx);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && addOnEnter) {
      e.preventDefault();
      if (input) addTag(input);
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (addOnComma && (val.endsWith(',') || val.endsWith(';'))) {
      addTag(val.slice(0, -1));
    } else {
      setInput(val);
    }
  };

  return (
    <div
      ref={ref}
      className={cx('ui-tag-input', className, rootSx.className)}
      data-testid={testId}
      {...rest}
    >
      {label && (
        <label
          onClick={() => inputRef.current?.focus()}
          className={cx('ui-tag-input__label', labelSx.className)}
        >
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.focus()}
        className={cx('ui-tag-input__control', controlSx.className)}
      >
        {tags.map((tag, idx) =>
          renderTag ? (
            <React.Fragment key={idx}>{renderTag(tag, idx, () => removeTag(idx))}</React.Fragment>
          ) : (
            <span
              key={idx}
              className={cx('ui-tag-input__tag', tagSx.className)}
            >
              {tag}
              {!disabled && !readOnly && (
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={(e) => { e.stopPropagation(); removeTag(idx); }}
                  className={cx('ui-tag-input__remove', removeButtonSx.className)}
                >
                  ×
                </button>
              )}
            </span>
          )
        )}
        {!disabled && !readOnly && (!max || tags.length < max) && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            placeholder={tags.length === 0 ? placeholder : ''}
            className={cx('ui-tag-input__input', inputSx.className)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (addOnBlur && input) addTag(input); }}
          />
        )}
        {clearable && tags.length > 0 && !disabled && !readOnly && (
          <button
            type="button"
            aria-label="Clear all tags"
            onClick={(e) => { e.stopPropagation(); if (controlledValue === undefined) setInternalTags([]); onChange?.([]); }}
            className={cx('ui-tag-input__clear', clearButtonSx.className)}
          >
            ×
          </button>
        )}
      </div>
      {(validationError || errorMsg || helperText) && (
        <p className={cx('ui-tag-input__helper', helperSx.className)}>
          {validationError ?? errorMsg ?? helperText}
        </p>
      )}
      {max && (
        <p className={cx('ui-tag-input__counter', counterSx.className)}>
          {tags.length}/{max}
        </p>
      )}
    </div>
  );
});
