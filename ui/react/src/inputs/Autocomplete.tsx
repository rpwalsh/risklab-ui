import React, {
  useState,
  useRef,
  useId,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { SizeVariant } from '../styling/types';
import { cx, sx } from '../styling';

export interface AutocompleteOption {
  label: string;
  value: string;
  group?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface AutocompleteProps<T extends AutocompleteOption = AutocompleteOption> {
  options: T[];
  value?: T | T[] | null;
  defaultValue?: T | null;
  onChange?: (value: T | T[] | null) => void;
  onInputChange?: (value: string) => void;
  inputValue?: string;
  multiple?: boolean;
  freeSolo?: boolean;
  disableClearable?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
  noOptionsText?: React.ReactNode;
  placeholder?: string;
  label?: string;
  error?: boolean | string;
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  size?: SizeVariant;
  fullWidth?: boolean;
  groupBy?: (option: T) => string;
  getOptionLabel?: (option: T) => string;
  getOptionKey?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  filterOptions?: (options: T[], inputValue: string) => T[];
  renderOption?: (option: T, state: { selected: boolean; inputValue: string }) => React.ReactNode;
  renderTags?: (value: T[], onDelete: (index: number) => void) => React.ReactNode;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  maxMenuHeight?: number;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<SizeVariant, { height: string; fontSize: string; px: string }> = {
  xs: { height: '28px', fontSize: 'var(--ui-text-xs, 12px)', px: '8px' },
  sm: { height: '32px', fontSize: 'var(--ui-text-sm, 14px)', px: '10px' },
  md: { height: '40px', fontSize: 'var(--ui-text-sm, 14px)', px: '12px' },
  lg: { height: '48px', fontSize: 'var(--ui-text-base, 16px)', px: '14px' },
  xl: { height: '56px', fontSize: 'var(--ui-text-lg, 18px)', px: '16px' },
};

function defaultFilterOptions<T extends AutocompleteOption>(options: T[], inputValue: string): T[] {
  const lower = inputValue.toLowerCase();
  return options.filter((o) => o.label.toLowerCase().includes(lower));
}

export function Autocomplete<T extends AutocompleteOption = AutocompleteOption>({
  options,
  value: controlledValue,
  defaultValue = null,
  onChange,
  onInputChange,
  inputValue: controlledInput,
  multiple = false,
  freeSolo = false,
  disableClearable = false,
  loading = false,
  loadingText = 'Loading…',
  noOptionsText = 'No options',
  placeholder,
  label,
  error,
  helperText,
  disabled = false,
  readOnly = false,
  size = 'md',
  fullWidth = false,
  groupBy,
  getOptionLabel = (o) => o.label,
  getOptionKey = (o) => o.value,
  isOptionEqualToValue = (a, b) => a.value === b.value,
  filterOptions = defaultFilterOptions,
  renderOption,
  renderTags,
  open: controlledOpen,
  onOpen,
  onClose,
  maxMenuHeight = 280,
  xstyle,
  testId,
  className,
  style,
}: AutocompleteProps<T>) {
  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [internalValue, setInternalValue] = useState<T | T[] | null>(multiple ? [] : defaultValue);
  const [internalInput, setInternalInput] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const inputValue = controlledInput !== undefined ? controlledInput : internalInput;
  const isOpen = controlledOpen !== undefined ? controlledOpen : open;

  const selectedValues = useMemo(
    () => (multiple ? (value as T[] | null) ?? [] : value ? [value as T] : []),
    [value, multiple]
  );

  const filteredOptions = useMemo(() => {
    const filtered = filterOptions(options, inputValue);
    return filtered.filter((o) => !multiple || !selectedValues.some((s) => isOptionEqualToValue(s, o)));
  }, [options, inputValue, filterOptions, multiple, selectedValues, isOptionEqualToValue]);

  const groupedOptions = useMemo(() => {
    if (!groupBy) return filteredOptions.map((o) => ({ group: '', options: [o] }));
    const groups: Record<string, T[]> = {};
    for (const o of filteredOptions) {
      const g = groupBy(o);
      if (!groups[g]) groups[g] = [];
      groups[g].push(o);
    }
    return Object.entries(groups).map(([g, opts]) => ({ group: g, options: opts }));
  }, [filteredOptions, groupBy]);

  const flatFiltered = filteredOptions;

  const openMenu = useCallback(() => {
    if (disabled || readOnly) return;
    if (controlledOpen === undefined) setOpen(true);
    onOpen?.();
    setActiveIndex(-1);
  }, [disabled, readOnly, controlledOpen, onOpen]);

  const closeMenu = useCallback(() => {
    if (controlledOpen === undefined) setOpen(false);
    onClose?.();
    setActiveIndex(-1);
  }, [controlledOpen, onClose]);

  const selectOption = useCallback((option: T) => {
    if (option.disabled) return;
    let newValue: T | T[] | null;
    if (multiple) {
      const current = selectedValues;
      newValue = [...current, option];
    } else {
      newValue = option;
    }
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(newValue);
    if (!multiple) {
      const newInput = getOptionLabel(option);
      if (controlledInput === undefined) setInternalInput(newInput);
      onInputChange?.(newInput);
      closeMenu();
    } else {
      if (controlledInput === undefined) setInternalInput('');
      onInputChange?.('');
    }
  }, [multiple, selectedValues, controlledValue, onChange, getOptionLabel, controlledInput, onInputChange, closeMenu]);

  const removeTag = useCallback((index: number) => {
    const current = selectedValues;
    const newValue = current.filter((_, i) => i !== index);
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(newValue.length > 0 ? newValue : null);
  }, [selectedValues, controlledValue, onChange]);

  const clearValue = useCallback(() => {
    const newValue = multiple ? [] : null;
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(newValue as T[] | null);
    if (controlledInput === undefined) setInternalInput('');
    onInputChange?.('');
    inputRef.current?.focus();
  }, [multiple, controlledValue, onChange, controlledInput, onInputChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledInput === undefined) setInternalInput(val);
    onInputChange?.(val);
    openMenu();
  }, [controlledInput, onInputChange, openMenu]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) { openMenu(); return; }
      setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && activeIndex >= 0 && flatFiltered[activeIndex]) {
        selectOption(flatFiltered[activeIndex]);
      } else if (freeSolo && inputValue) {
        const freeOption = { label: inputValue, value: inputValue } as unknown as T;
        selectOption(freeOption);
      }
    } else if (e.key === 'Escape') {
      closeMenu();
    } else if (e.key === 'Backspace' && multiple && inputValue === '' && selectedValues.length > 0) {
      removeTag(selectedValues.length - 1);
    }
  }, [isOpen, activeIndex, flatFiltered, freeSolo, inputValue, multiple, selectedValues, openMenu, closeMenu, selectOption, removeTag]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [closeMenu]);

  const sz = sizeMap[size];
  const hasError = !!error;
  const errorMsg = typeof error === 'string' ? error : helperText;
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;

  const rootSx = sx({
    position: 'relative',
    display: fullWidth ? 'block' : 'inline-block',
    width: fullWidth ? '100%' : null,
    '--ui-autocomplete-height': sz.height,
    '--ui-autocomplete-font-size': sz.fontSize,
    '--ui-autocomplete-padding-x': sz.px,
    '--ui-autocomplete-menu-max-height': `${maxMenuHeight}px`,
    ...(style as Record<string, string | number> | undefined),
    ...(mergedExternalStyles as Record<string, string | number> | undefined),
  });

  const inputSx = sx({
    flex: 1,
    minWidth: multiple ? '80px' : '0',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 'var(--ui-autocomplete-font-size)',
    color: 'var(--ui-color-text, #0f172a)',
    padding: 0,
    height: multiple ? null : 'var(--ui-autocomplete-height)',
    cursor: disabled ? 'not-allowed' : 'text',
  });

  const labelSx = sx({
    display: 'block',
    marginBottom: '4px',
    fontSize: 'var(--ui-text-sm, 14px)',
    fontWeight: 500,
    color: hasError ? 'var(--ui-color-error, #dc2626)' : 'var(--ui-color-text, #0f172a)',
  });

  const controlSx = sx({
    display: 'flex',
    alignItems: multiple ? 'flex-start' : 'center',
    flexWrap: multiple ? 'wrap' : 'nowrap',
    gap: multiple ? '4px' : 0,
    padding: multiple ? '6px 10px' : `0 var(--ui-autocomplete-padding-x)`,
    minHeight: 'var(--ui-autocomplete-height)',
    border: `1.5px solid ${hasError ? 'var(--ui-color-error, #dc2626)' : 'var(--ui-color-border, #e2e8f0)'}`,
    borderRadius: 'var(--ui-radius-md, 8px)',
    background: disabled ? 'var(--ui-color-surface-variant, #f8fafc)' : 'var(--ui-color-surface, #fff)',
    cursor: disabled ? 'not-allowed' : 'text',
    transition: 'border-color var(--ui-transition-fast, 150ms)',
    boxSizing: 'border-box',
    width: '100%',
  });

  const tagSx = sx({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    background: 'var(--ui-color-primary-subtle, #eef2ff)',
    color: 'var(--ui-color-primary, #4f46e5)',
    borderRadius: 'var(--ui-radius-full, 9999px)',
    fontSize: '12px',
    fontWeight: 500,
  });
  const tagRemoveSx = sx({ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: 'inherit', opacity: 0.7 });
  const actionsSx = sx({ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, paddingLeft: '4px' });
  const spinnerSx = sx({ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--ui-color-border)', borderTopColor: 'var(--ui-color-primary)', animation: 'ui-spin 0.8s linear infinite', display: 'block' });
  const iconButtonSx = sx({ background: 'none', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', padding: '2px', color: 'var(--ui-color-text-secondary)', lineHeight: 1 });
  const listboxSx = sx({
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    zIndex: 'var(--ui-z-dropdown, 1000)',
    background: 'var(--ui-color-surface, #fff)',
    border: '1px solid var(--ui-color-border, #e2e8f0)',
    borderRadius: 'var(--ui-radius-lg, 12px)',
    boxShadow: 'var(--ui-shadow-lg)',
    maxHeight: 'var(--ui-autocomplete-menu-max-height)',
    overflowY: 'auto',
    padding: '4px',
  });
  const emptyStateSx = sx({ padding: '12px 16px', color: 'var(--ui-color-text-secondary)', fontSize: 'var(--ui-autocomplete-font-size)' });
  const groupLabelSx = sx({ padding: '6px 12px 2px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ui-color-text-secondary)', pointerEvents: 'none' });
  const helperSx = sx({ margin: '4px 0 0', fontSize: 'var(--ui-text-xs, 12px)', color: hasError ? 'var(--ui-color-error)' : 'var(--ui-color-text-secondary)' });

  return (
    <div ref={containerRef} className={cx('ui-autocomplete', className, rootSx.className)} data-testid={testId}>
      {label && (
        <label htmlFor={`${uid}-input`} className={cx('ui-autocomplete__label', labelSx.className)}>
          {label}
        </label>
      )}
      <div
        className={cx('ui-autocomplete__control', controlSx.className)}
        onClick={() => { if (!disabled) inputRef.current?.focus(); }}
        onFocus={() => {}}
      >
        {multiple && renderTags
          ? renderTags(selectedValues, removeTag)
          : multiple && selectedValues.map((tag, i) => (
            <span
              key={getOptionKey(tag)}
              className={cx('ui-autocomplete__tag', tagSx.className)}
            >
              {getOptionLabel(tag)}
              <button
                type="button"
                aria-label={`Remove ${getOptionLabel(tag)}`}
                onClick={(e) => { e.stopPropagation(); removeTag(i); }}
                className={cx('ui-autocomplete__tag-remove', tagRemoveSx.className)}
              >
                ✕
              </button>
            </span>
          ))}
        <input
          ref={inputRef}
          id={`${uid}-input`}
          type="text"
          role="combobox"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={cx('ui-autocomplete__input', inputSx.className)}
          onChange={handleInputChange}
          onFocus={openMenu}
          onKeyDown={handleKeyDown}
        />
        <div className={cx('ui-autocomplete__actions', actionsSx.className)}>
          {loading && (
            <span className={cx('ui-autocomplete__spinner', spinnerSx.className)} />
          )}
          {!disableClearable && !disabled && (multiple ? selectedValues.length > 0 : value != null) && (
            <button
              type="button"
              aria-label="Clear"
              tabIndex={-1}
              onClick={(e) => { e.stopPropagation(); clearValue(); }}
              className={cx('ui-autocomplete__clear', iconButtonSx.className)}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M12 4L8 8m0 0L4 12m4-4L4 4m4 4l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Open"
            onClick={(e) => {
              e.stopPropagation();
              if (isOpen) {
                closeMenu();
              } else {
                openMenu();
              }
            }}
            className={cx('ui-autocomplete__toggle', iconButtonSx.className, sx({ transition: 'transform 150ms', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }).className)}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z"/></svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className={cx('ui-autocomplete__listbox', listboxSx.className)}
          {...(multiple ? { 'aria-multiselectable': 'true' } : {})}
        >
          {loading ? (
            <div className={cx('ui-autocomplete__state', emptyStateSx.className)}>{loadingText}</div>
          ) : flatFiltered.length === 0 ? (
            <div className={cx('ui-autocomplete__state', emptyStateSx.className)}>{noOptionsText}</div>
          ) : groupedOptions.map((group, gi) => (
            <React.Fragment key={group.group || gi}>
              {group.group && (
                <div className={cx('ui-autocomplete__group', groupLabelSx.className)}>
                  {group.group}
                </div>
              )}
              {group.options.map((option) => {
                const globalIdx = flatFiltered.indexOf(option);
                const isSelected = selectedValues.some((s) => isOptionEqualToValue(s, option));
                const isActive = globalIdx === activeIndex;
                return (
                  <div
                    key={getOptionKey(option)}
                    id={`${uid}-opt-${globalIdx}`}
                    role="option"
                    className={cx('ui-autocomplete__option', sx({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--ui-radius-md, 8px)',
                      background: isActive ? 'var(--ui-color-primary-subtle, #eef2ff)' : isSelected ? 'var(--ui-gray-50, #f8fafc)' : 'transparent',
                      color: option.disabled ? 'var(--ui-color-text-disabled)' : 'var(--ui-color-text)',
                      cursor: option.disabled ? 'not-allowed' : 'pointer',
                      fontSize: 'var(--ui-autocomplete-font-size)',
                      fontWeight: isSelected ? 500 : 400,
                    }).className)}
                    {...{ 'aria-selected': isSelected ? 'true' : 'false' }}
                    {...(option.disabled ? { 'aria-disabled': 'true' } : {})}
                    onMouseDown={(e) => { e.preventDefault(); selectOption(option); }}
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                  >
                    {multiple && (
                      <span className={sx({ width: '16px', height: '16px', borderRadius: '4px', border: `2px solid ${isSelected ? 'var(--ui-color-primary)' : 'var(--ui-color-border)'}`, background: isSelected ? 'var(--ui-color-primary)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }).className}>
                        {isSelected && <svg viewBox="0 0 10 10" fill="none" width="10" height="10"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </span>
                    )}
                    {renderOption ? renderOption(option, { selected: isSelected, inputValue }) : getOptionLabel(option)}
                    {!multiple && isSelected && (
                      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14" className={sx({ marginLeft: 'auto', color: 'var(--ui-color-primary)', flexShrink: 0 }).className}><path fillRule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}

      {(errorMsg || helperText) && (
        <p className={cx('ui-autocomplete__helper', helperSx.className)}>
          {errorMsg ?? helperText}
        </p>
      )}
    </div>
  );
}
