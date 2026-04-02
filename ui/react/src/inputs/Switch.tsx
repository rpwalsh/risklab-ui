// @risklab/ui � Switch component

import React, {
  forwardRef,
  useId,
  type CSSProperties,
  type InputHTMLAttributes,
  type ChangeEvent,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SwitchProps
  extends BaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'className' | 'type' | 'onChange' | 'role' | 'color'> {
  /** Label text. */
  label?: string;
  /** Controlled checked state. */
  checked?: boolean;
  /** Default check state (uncontrolled). */
  defaultChecked?: boolean;
  /** Change handler. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Switch size. */
  size?: SizeVariant;
  /** Colour scheme. */
  color?: ColorVariant;
  /** Disabled. */
  disabled?: boolean;
  /** Where the label appears relative to the switch. */
  labelPlacement?: 'start' | 'end';
}

// ---------------------------------------------------------------------------
// Styles are now in ui.css: .ui-switch, .ui-switch__track, .ui-switch__thumb, .ui-switch__input
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(
    {
      label,
      checked,
      defaultChecked,
      onChange,
      size = 'md',
      color = 'primary',
      disabled = false,
      labelPlacement = 'end',
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

    // Track internal checked state for uncontrolled mode
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
    const isChecked = checked !== undefined ? checked : internalChecked;

    const handleChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) setInternalChecked(e.target.checked);
      onChange?.(e);
    }, [checked, onChange]);

    const mergedOuterStyle: CSSProperties | undefined = (xstyle || style)
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

    const labelEl = label ? <span>{label}</span> : null;

    return (
      <label
        htmlFor={inputId}
        className={cx('ui-switch', className)}
        {...(mergedOuterStyle ? { style: mergedOuterStyle } : undefined)}
        data-testid={testId}
        data-size={size}
        data-color={color}
        data-disabled={disabled || undefined}
        data-direction={labelPlacement === 'start' ? 'reverse' : undefined}
      >
        {labelPlacement === 'start' && labelEl}

        <span
          aria-hidden="true"
          className="ui-switch__track"
          data-checked={isChecked ? 'true' : undefined}
        >
          <span
            className="ui-switch__thumb"
            data-checked={isChecked ? 'true' : undefined}
          />
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            aria-checked={isChecked}
            className="ui-switch__input"
            {...rest}
          />
        </span>

        {labelPlacement === 'end' && labelEl}
      </label>
    );
  },
);
