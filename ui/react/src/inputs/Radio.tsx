// @risklab/ui � Radio & RadioGroup components

import {
  forwardRef,
  createContext,
  useContext,
  useId,
  type CSSProperties,
  type ReactNode,
  type InputHTMLAttributes,
  type ChangeEvent,
  type HTMLAttributes,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// RadioGroup context
// ---------------------------------------------------------------------------

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  size?: SizeVariant;
  color?: ColorVariant;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroup(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext);
}

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------

export interface RadioGroupProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'style' | 'className'> {
  /** Name shared by all child radios. */
  name?: string;
  /** Controlled value. */
  value?: string;
  /** Change handler. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Size passed to children. */
  size?: SizeVariant;
  /** Color passed to children. */
  color?: ColorVariant;
  /** Disable all children. */
  disabled?: boolean;
  /** Optional legend / label for the group. */
  label?: string;
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
}

// Styles now in CSS: .ui-radio-group, .ui-radio-group__legend

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  function RadioGroup(
    {
      name: nameProp,
      value,
      onChange,
      size,
      color,
      disabled,
      label,
      orientation = 'vertical',
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const autoName = useId();
    const name = nameProp ?? autoName;

    const ctxValue: RadioGroupContextValue = {
      name,
      value,
      onChange: onChange ?? (() => {}),
      size,
      color,
      disabled,
    };

    const resolvedStyle: CSSProperties | undefined =
      (xstyle || style)
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
      <RadioGroupContext.Provider value={ctxValue}>
        <fieldset
          ref={ref}
          role="radiogroup"
          className={cx('ui-radio-group', className)}
          data-orientation={orientation}
          {...(resolvedStyle ? { style: resolvedStyle } : undefined)}
          data-testid={testId}
          {...rest}
        >
          {label && <legend className="ui-radio-group__legend">{label}</legend>}
          {children}
        </fieldset>
      </RadioGroupContext.Provider>
    );
  },
);

// ---------------------------------------------------------------------------
// Radio � Types
// ---------------------------------------------------------------------------

export interface RadioProps
  extends BaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'className' | 'type' | 'onChange' | 'color'> {
  /** Label text. */
  label?: string;
  /** Radio value. */
  value: string;
  /** Name (falls back to group context). */
  name?: string;
  /** Controlled checked state. */
  checked?: boolean;
  /** Change handler. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Size. */
  size?: SizeVariant;
  /** Color scheme. */
  color?: ColorVariant;
  /** Disabled. */
  disabled?: boolean;
}

// Size/color/base styles now in CSS: .ui-radio, .ui-radio__input, data-size, data-color

// ---------------------------------------------------------------------------
// Radio component
// ---------------------------------------------------------------------------

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    {
      label,
      value,
      name: nameProp,
      checked: checkedProp,
      onChange: onChangeProp,
      size: sizeProp,
      color: colorProp,
      disabled: disabledProp,
      className,
      style,
      xstyle,
      testId,
      id: idProp,
      ...rest
    },
    ref,
  ) {
    const group = useRadioGroup();
    const autoId = useId();

    const inputId = idProp ?? autoId;
    const name = nameProp ?? group?.name;
    const size = sizeProp ?? group?.size ?? 'md';
    const color = colorProp ?? group?.color ?? 'primary';
    const disabled = disabledProp ?? group?.disabled ?? false;
    const checked = checkedProp ?? (group ? group.value === value : undefined);
    const handleChange = onChangeProp ?? group?.onChange;

    const resolvedRadioStyle: CSSProperties | undefined =
      (xstyle || style)
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
      <label
        htmlFor={inputId}
        className={cx('ui-radio', disabled && 'ui-radio--disabled', className)}
        {...(resolvedRadioStyle ? { style: resolvedRadioStyle } : undefined)}
        data-testid={testId}
        data-size={size}
        data-color={color}
      >
        <input
          ref={ref}
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={cx('ui-radio__input', disabled && 'ui-radio__input--disabled')}
          {...rest}
        />
        {label && <span>{label}</span>}
      </label>
    );
  },
);
