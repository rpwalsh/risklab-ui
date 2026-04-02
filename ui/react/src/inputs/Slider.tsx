// @risklab/ui � Slider component

import React, {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ChangeEvent,
  type MouseEvent,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SliderMark {
  value: number;
  label?: string;
}

export interface SliderProps
  extends BaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'className' | 'type' | 'onChange' | 'value' | 'defaultValue' | 'color'> {
  /** Minimum value. */
  min?: number;
  /** Maximum value. */
  max?: number;
  /** Step increment. */
  step?: number;
  /** Controlled value. */
  value?: number;
  /** Default value (uncontrolled). */
  defaultValue?: number;
  /** Fires on every value change. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Fires when the user finishes interaction (mouseup / touchend). */
  onChangeCommitted?: (event: MouseEvent<HTMLInputElement>) => void;
  /** Show marks: `true` = auto, or an explicit array. */
  marks?: boolean | SliderMark[];
  /** Accessible label text. */
  label?: string;
  /** Value label display mode. */
  valueLabelDisplay?: 'auto' | 'on' | 'off';
  /** Slider size. */
  size?: SizeVariant;
  /** Colour scheme. */
  color?: ColorVariant;
  /** Disabled. */
  disabled?: boolean;
  /** Orientation. */
  orientation?: 'horizontal' | 'vertical';
}



// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  function Slider(
    {
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onChange,
      onChangeCommitted,
      marks,
      label,
      valueLabelDisplay = 'off',
      size = 'md',
      color = 'primary',
      disabled = false,
      orientation = 'horizontal',
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

    const currentValue = value ?? defaultValue ?? min;

    // Compute marks array
    let markItems: SliderMark[] | null = null;
    if (marks === true) {
      const count = Math.floor((max - min) / step) + 1;
      markItems = Array.from({ length: count }, (_, i) => ({
        value: min + i * step,
      }));
    } else if (Array.isArray(marks)) {
      markItems = marks;
    }

    const userStyle = (() => {
      let s: Record<string, unknown> = {};
      if (orientation === 'vertical') {
        s = { ...s, writingMode: 'vertical-lr', direction: 'rtl' };
      }
      if (typeof xstyle === 'object' && !Array.isArray(xstyle)) {
        s = { ...s, ...xstyle };
      }
      if (Array.isArray(xstyle)) {
        for (const x of xstyle) { if (x) { s = { ...s, ...x }; } }
      }
      if (style) { s = { ...s, ...style }; }
      return Object.keys(s).length > 0 ? s : undefined;
    })();

    return (
      <div
        className={cx('ui-slider', className)}
        {...(userStyle ? { style: userStyle as React.CSSProperties } : undefined)}
        data-testid={testId}
        data-size={size}
        data-color={color}
        data-orientation={orientation}
      >
        {label && (
          <label htmlFor={inputId} className="ui-slider__label">
            {label}
            {valueLabelDisplay !== 'off' && (
              <span aria-hidden="true" className="ui-slider__value-inline">
                {currentValue}
              </span>
            )}
          </label>
        )}

        {!label && valueLabelDisplay !== 'off' && (
          <span aria-hidden="true" className="ui-slider__value-label">
            {currentValue}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange}
          onMouseUp={onChangeCommitted}
          disabled={disabled}
          aria-label={label ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-orientation={orientation}
          className={cx('ui-slider__input', disabled && 'ui-slider__input--disabled')}
          {...rest}
        />

        {markItems && markItems.length > 0 && (
          <div aria-hidden="true" className="ui-slider__marks">
            {markItems.map((m) => (
              <span key={m.value}>{m.label ?? m.value}</span>
            ))}
          </div>
        )}
      </div>
    );
  },
);
