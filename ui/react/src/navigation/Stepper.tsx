import React, { forwardRef } from 'react';
import type { ColorVariant, SizeVariant } from '../styling/types';
import { cx, sx } from '../styling';

export interface StepperStep {
  label: React.ReactNode;
  description?: React.ReactNode;
  optional?: boolean;
  error?: boolean;
  completed?: boolean;
  icon?: React.ReactNode;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  steps: StepperStep[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'outlined' | 'contained';
  alternativeLabel?: boolean;
  nonLinear?: boolean;
  color?: ColorVariant;
  size?: SizeVariant;
  connector?: React.ReactNode | false;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
  onStepClick?: (index: number) => void;
}

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 5h2v4H7zm0 5h2v2H7z" />
  </svg>
);

const sizeMap: Record<SizeVariant, { circle: number; font: string }> = {
  xs: { circle: 20, font: '10px' },
  sm: { circle: 24, font: '11px' },
  md: { circle: 32, font: '13px' },
  lg: { circle: 40, font: '15px' },
  xl: { circle: 48, font: '17px' },
};

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  {
    steps,
    activeStep,
    orientation = 'horizontal',
    alternativeLabel = false,
    nonLinear = false,
    color = 'primary',
    size = 'md',
    connector,
    xstyle,
    testId,
    className,
    style,
    onStepClick,
    ...rest
  },
  ref
) {
  const sz = sizeMap[size];
  const isVertical = orientation === 'vertical';
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;

  return (
    <div
      ref={ref}
      role="list"
      aria-label="Progress steps"
      data-testid={testId}
      className={cx('ui-stepper', `ui-stepper--${orientation}`, className, sx({
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: isVertical ? 'flex-start' : alternativeLabel ? 'flex-start' : 'center',
        gap: isVertical ? 0 : null,
        ...(style as Record<string, string | number> | undefined),
        ...(mergedExternalStyles as Record<string, string | number> | undefined),
      }).className)}
      {...rest}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = step.completed !== undefined ? step.completed : index < activeStep;
        const isError = step.error;
        const isClickable = nonLinear && onStepClick;

        const circleColor = isError
          ? 'var(--ui-color-error, #dc2626)'
          : isCompleted
          ? `var(--ui-color-${color}, var(--ui-color-primary, #4f46e5))`
          : isActive
          ? `var(--ui-color-${color}, var(--ui-color-primary, #4f46e5))`
          : 'var(--ui-color-border, #e2e8f0)';

        const circleStyle: React.CSSProperties = {
          width: sz.circle,
          height: sz.circle,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isCompleted || isActive || isError ? circleColor : 'var(--ui-color-surface-variant, #f8fafc)',
          border: isActive && !isCompleted ? `2px solid ${circleColor}` : 'none',
          color: isCompleted || isActive || isError ? '#fff' : 'var(--ui-color-text-secondary)',
          fontSize: sz.font,
          fontWeight: 600,
          flexShrink: 0,
          transition: 'all var(--ui-transition-base, 250ms)',
        };

        const connectorStyle: React.CSSProperties = isVertical ? {
          width: '2px',
          minHeight: '24px',
          background: isCompleted ? `var(--ui-color-${color}, var(--ui-color-primary, #4f46e5))` : 'var(--ui-color-border, #e2e8f0)',
          margin: '4px auto',
          marginLeft: `${sz.circle / 2 - 1}px`,
          transition: 'background var(--ui-transition-slow, 400ms)',
        } : {
          flex: 1,
          height: '2px',
          background: isCompleted ? `var(--ui-color-${color}, var(--ui-color-primary, #4f46e5))` : 'var(--ui-color-border, #e2e8f0)',
          transition: 'background var(--ui-transition-slow, 400ms)',
        };

        return (
          <React.Fragment key={index}>
            <div
              role="listitem"
              aria-current={isActive ? 'step' : undefined}
              className={sx({
                display: 'flex',
                flexDirection: isVertical ? 'row' : alternativeLabel ? 'column' : 'row',
                alignItems: isVertical ? 'flex-start' : alternativeLabel ? 'center' : 'center',
                gap: isVertical ? '12px' : '8px',
                cursor: isClickable ? 'pointer' : 'default',
                flex: !isVertical ? 1 : null,
                position: 'relative',
              }).className}
              onClick={isClickable ? () => onStepClick?.(index) : undefined}
            >
              <div className={sx(circleStyle as Record<string, string | number>).className}>
                {step.icon ? step.icon : isError ? <ErrorIcon /> : isCompleted ? <CheckIcon /> : <span>{index + 1}</span>}
              </div>
              <div className={sx({ minWidth: 0 }).className}>
                <div className={sx({
                  fontSize: 'var(--ui-text-sm, 14px)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--ui-color-text, #0f172a)' : isCompleted ? 'var(--ui-color-text, #0f172a)' : 'var(--ui-color-text-secondary, #64748b)',
                  whiteSpace: 'nowrap',
                }).className}>
                  {step.label}
                  {step.optional && <span className={sx({ display: 'block', fontSize: 'var(--ui-text-xs, 12px)', fontWeight: 400, color: 'var(--ui-color-text-secondary)' }).className}>Optional</span>}
                </div>
                {isVertical && step.description && isActive && (
                  <div className={sx({ fontSize: 'var(--ui-text-sm, 14px)', color: 'var(--ui-color-text-secondary)', marginTop: '4px' }).className}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && connector !== false && (
              <div className={sx(connectorStyle as Record<string, string | number>).className} aria-hidden="true">
                {connector}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});
