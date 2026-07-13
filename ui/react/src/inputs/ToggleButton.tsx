// @risklab/ui — ToggleButton & ToggleButtonGroup components

import {
  forwardRef,
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// ToggleButtonGroup context
// ---------------------------------------------------------------------------

interface ToggleButtonGroupContextValue {
  value: string | string[] | undefined;
  onToggle: (value: string) => void;
  size?: SizeVariant;
  color?: ColorVariant;
  disabled?: boolean;
}

const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextValue | null>(null);

function useToggleButtonGroup(): ToggleButtonGroupContextValue | null {
  return useContext(ToggleButtonGroupContext);
}

// ---------------------------------------------------------------------------
// ToggleButtonGroup
// ---------------------------------------------------------------------------

export interface ToggleButtonGroupProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'style' | 'className'> {
  /** Controlled value(s). Single string for exclusive, string[] for multi-select. */
  value?: string | string[];
  /** Change handler — receives the new value or value array. */
  onChange?: (value: string | string[]) => void;
  /** Size passed to children. */
  size?: SizeVariant;
  /** Colour passed to children. */
  color?: ColorVariant;
  /** Disable all children. */
  disabled?: boolean;
  /** Allow multiple selections. */
  multiple?: boolean;
  /** Layout orientation. */
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
}

export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  function ToggleButtonGroup(
    {
      value,
      onChange,
      size,
      color,
      disabled,
      multiple = false,
      orientation = 'horizontal',
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const handleToggle = (itemValue: string) => {
      if (!onChange) return;

      if (multiple) {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
        onChange(next);
      } else {
        onChange(itemValue);
      }
    };

    const ctxValue: ToggleButtonGroupContextValue = {
      value,
      onToggle: handleToggle,
      size,
      color,
      disabled,
    };

    const userStyle: CSSProperties | undefined = (style || xstyle)
      ? {
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
      <ToggleButtonGroupContext.Provider value={ctxValue}>
        <div
          ref={ref}
          role="group"
          className={cx('ui-toggle-group', className)}
          {...(userStyle ? { style: userStyle } : undefined)}
          data-testid={testId}
          data-orientation={orientation}
          {...rest}
        >
          {children}
        </div>
      </ToggleButtonGroupContext.Provider>
    );
  },
);

// ---------------------------------------------------------------------------
// ToggleButton — Types
// ---------------------------------------------------------------------------

export interface ToggleButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'style' | 'className' | 'onChange' | 'color'> {
  /** The value this toggle represents. */
  value: string;
  /** Controlled selected state (standalone usage). */
  selected?: boolean;
  /** Change handler (standalone usage). */
  onChange?: (value: string, selected: boolean) => void;
  /** Size. */
  size?: SizeVariant;
  /** Colour scheme. */
  color?: ColorVariant;
  /** Disabled. */
  disabled?: boolean;
  children?: ReactNode;
}

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

// Size and color tokens now in CSS via data-size/data-color/data-selected attributes

// ---------------------------------------------------------------------------
// ToggleButton component
// ---------------------------------------------------------------------------

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {
      value,
      selected: selectedProp,
      onChange,
      size: sizeProp,
      color: colorProp,
      disabled: disabledProp,
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const group = useToggleButtonGroup();

    const size = sizeProp ?? group?.size ?? 'md';
    const color = colorProp ?? group?.color ?? 'primary';
    const disabled = disabledProp ?? group?.disabled ?? false;

    // Determine selected state
    let isSelected: boolean;
    if (selectedProp !== undefined) {
      isSelected = selectedProp;
    } else if (group) {
      isSelected = Array.isArray(group.value)
        ? group.value.includes(value)
        : group.value === value;
    } else {
      isSelected = false;
    }

    const handleClick = () => {
      if (disabled) return;
      if (group) {
        group.onToggle(value);
      }
      onChange?.(value, !isSelected);
    };

    const userStyle: CSSProperties | undefined = (style || xstyle)
      ? {
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
      <button
        ref={ref}
        type="button"
        role="button"
        className={cx('ui-toggle-btn', className)}
        {...(userStyle ? { style: userStyle } : undefined)}
        aria-pressed={isSelected}
        disabled={disabled}
        onClick={handleClick}
        data-testid={testId}
        data-value={value}
        data-selected={isSelected || undefined}
        data-size={size}
        data-color={color}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
