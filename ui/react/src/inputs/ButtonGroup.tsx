// @risklab/ui — ButtonGroup component

import {
  forwardRef,
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import type { ButtonVariant } from './Button';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ButtonGroupContextValue {
  variant?: ButtonVariant;
  size?: SizeVariant;
  color?: ColorVariant;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

/** Hook for children to read group-level defaults. */
export function useButtonGroup(): ButtonGroupContextValue | null {
  return useContext(ButtonGroupContext);
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ButtonGroupProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'className'> {
  /** Variant passed to child buttons via context. */
  variant?: ButtonVariant;
  /** Size passed to child buttons via context. */
  size?: SizeVariant;
  /** Color passed to child buttons via context. */
  color?: ColorVariant;
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Gap between buttons (CSS length). */
  spacing?: string | number;
  children?: ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    {
      variant,
      size,
      color,
      orientation = 'horizontal',
      spacing = 0,
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const isVertical = orientation === 'vertical';

    const groupStyle: CSSProperties = {
      display: 'inline-flex',
      flexDirection: isVertical ? 'column' : 'row',
      gap: typeof spacing === 'number' ? `${spacing}px` : spacing,
      '--ui-btngroup-direction': isVertical ? 'column' : 'row',
      // Remove inner radii via CSS — first/last child keep their corners
      // Middle children get radius 0 on the shared edge.
      // This uses CSS :not(:first-child):not(:last-child) via a data attribute.
      ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : undefined),
      ...(Array.isArray(xstyle)
        ? xstyle.reduce<Record<string, string | number>>(
            (acc, s) => (s ? { ...acc, ...s } : acc),
            {},
          )
        : undefined),
      ...style,
    } as CSSProperties;

    const ctxValue: ButtonGroupContextValue = { variant, size, color };

    return (
      <ButtonGroupContext.Provider value={ctxValue}>
        <div
          ref={ref}
          role="group"
          className={cx('ui-btn-group', className)}
          style={groupStyle}
          data-testid={testId}
          data-orientation={orientation}
          {...rest}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  },
);
