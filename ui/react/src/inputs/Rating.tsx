import React, { forwardRef, useState, useCallback } from 'react';
import type { SizeVariant } from '../styling/types';
import { cx, sx } from '../styling';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  max?: number;
  precision?: 0.5 | 1;
  size?: SizeVariant;
  emptyIcon?: React.ReactNode;
  filledIcon?: React.ReactNode;
  icon?: React.ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  highlightSelectedOnly?: boolean;
  getLabelText?: (value: number) => string;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

const StarFilled = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const StarEmpty = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={size} height={size}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const sizeMap: Record<SizeVariant, number> = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 };

export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value: controlledValue,
    defaultValue = 0,
    onChange,
    max = 5,
    precision = 1,
    size = 'md',
    readOnly = false,
    disabled = false,
    highlightSelectedOnly = false,
    getLabelText = (v) => `${v} Star${v !== 1 ? 's' : ''}`,
    xstyle,
    testId,
    className,
    style,
    ...rest
  },
  ref
) {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [hoverValue, setHoverValue] = useState<number>(-1);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const iconSize = sizeMap[size];
  const isInteractive = !readOnly && !disabled;
  const displayValue = hoverValue >= 0 ? hoverValue : value;
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;
  const rootSx = sx({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    opacity: disabled ? 0.5 : 1,
    cursor: isInteractive ? 'pointer' : 'default',
    ...(style as Record<string, string | number> | undefined),
    ...(mergedExternalStyles as Record<string, string | number> | undefined),
  });

  const getValueFromEvent = useCallback((e: React.MouseEvent<HTMLSpanElement>, starIndex: number): number => {
    if (precision === 0.5) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isLeft = (e.clientX - rect.left) / rect.width < 0.5;
      return isLeft ? starIndex - 0.5 : starIndex;
    }
    return starIndex;
  }, [precision]);


  return (
    <div
      ref={ref}
      role="group"
      aria-label={getLabelText(value)}
      data-testid={testId}
      className={cx('ui-rating', disabled && 'ui-rating--disabled', className, rootSx.className)}
      onMouseLeave={() => { if (isInteractive) setHoverValue(-1); }}
      {...rest}
    >
      {Array.from({ length: max }, (_, i) => {
        const starVal = i + 1;
        const isFilled = highlightSelectedOnly ? displayValue === starVal : displayValue >= starVal;
        const isHalfFilled = precision === 0.5 && !isFilled && displayValue >= starVal - 0.5;
        const starSx = sx({
          position: 'relative',
          display: 'inline-flex',
          color: (isFilled || isHalfFilled) ? 'var(--ui-rating-color, #f59e0b)' : 'var(--ui-color-border, #e2e8f0)',
          transition: 'color var(--ui-transition-fast, 150ms), transform 100ms',
          transform: isInteractive && hoverValue === starVal ? 'scale(1.2)' : 'scale(1)',
        });
        const halfWrapSx = sx({ position: 'relative', display: 'inline-flex' });
        const halfFillSx = sx({ position: 'absolute', left: 0, top: 0, width: '50%', overflow: 'hidden', color: 'var(--ui-rating-color, #f59e0b)' });
        const halfEmptySx = sx({ color: 'var(--ui-color-border, #e2e8f0)' });
        const iconNode = isHalfFilled ? (
          <span className={halfWrapSx.className}>
            <span className={halfFillSx.className}>
              <StarFilled size={iconSize} />
            </span>
            <span className={halfEmptySx.className}>
              <StarEmpty size={iconSize} />
            </span>
          </span>
        ) : isFilled ? (
          <StarFilled size={iconSize} />
        ) : (
          <StarEmpty size={iconSize} />
        );

        if (!isInteractive) {
          return (
            <span key={i} className={cx('ui-rating__star', starSx.className)}>
              {iconNode}
            </span>
          );
        }

        return (
          <button
            key={i}
            type="button"
            aria-label={getLabelText(starVal)}
            className={cx('ui-rating__button', starSx.className, sx({ border: 'none', background: 'transparent', padding: 0, margin: 0, cursor: 'pointer' }).className)}
            onMouseMove={(e) => setHoverValue(getValueFromEvent(e, starVal))}
            onClick={(e) => {
              const newVal = getValueFromEvent(e, starVal);
              const final = newVal === value ? 0 : newVal;
              if (controlledValue === undefined) setInternalValue(final);
              onChange?.(final === 0 ? null : final);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const final = starVal === value ? 0 : starVal;
                if (controlledValue === undefined) setInternalValue(final);
                onChange?.(final === 0 ? null : final);
              }
            }}
          >
            {iconNode}
          </button>
        );
      })}
    </div>
  );
});
