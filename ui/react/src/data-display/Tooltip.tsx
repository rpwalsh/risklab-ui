// @risklab/ui � Tooltip component

import React, {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import type { BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'dark' | 'light';

export interface TooltipProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'className' | 'content'> {
  /** Tooltip content. */
  content: ReactNode;
  /** Preferred placement. */
  placement?: TooltipPlacement;
  /** Delay (ms) before showing the tooltip. */
  delay?: number;
  /** The trigger element (single child). */
  children: ReactNode;
  /** Show an arrow pointing at the trigger. */
  arrow?: boolean;
  /** Offset from trigger in pixels. */
  offset?: number;
  /** Controlled open state. */
  open?: boolean;
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Color variant. */
  variant?: TooltipVariant;
}

// ---------------------------------------------------------------------------
// Placement ? position styles
// ---------------------------------------------------------------------------

function placementStyles(
  placement: TooltipPlacement,
  offset: number,
): CSSProperties {
  switch (placement) {
    case 'top':
      return {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: `${offset}px`,
      };
    case 'bottom':
      return {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: `${offset}px`,
      };
    case 'left':
      return {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: `${offset}px`,
      };
    case 'right':
      return {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: `${offset}px`,
      };
  }
}

// ---------------------------------------------------------------------------
// Arrow styles
// ---------------------------------------------------------------------------

function arrowStyles(
  placement: TooltipPlacement,
  variant: TooltipVariant,
): CSSProperties {
  const size = 'var(--ui-tooltip-arrow-size, 5px)';
  const color =
    variant === 'dark'
      ? 'var(--ui-tooltip-bg, #1f2937)'
      : 'var(--ui-tooltip-light-bg, #fff)';

  const base: CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  };

  switch (placement) {
    case 'top':
      return {
        ...base,
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%, 100%)',
        borderWidth: `${size} ${size} 0 ${size}`,
        borderColor: `${color} transparent transparent transparent`,
      } as CSSProperties;
    case 'bottom':
      return {
        ...base,
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -100%)',
        borderWidth: `0 ${size} ${size} ${size}`,
        borderColor: `transparent transparent ${color} transparent`,
      } as CSSProperties;
    case 'left':
      return {
        ...base,
        right: 0,
        top: '50%',
        transform: 'translate(100%, -50%)',
        borderWidth: `${size} 0 ${size} ${size}`,
        borderColor: `transparent transparent transparent ${color}`,
      } as CSSProperties;
    case 'right':
      return {
        ...base,
        left: 0,
        top: '50%',
        transform: 'translate(-100%, -50%)',
        borderWidth: `${size} ${size} ${size} 0`,
        borderColor: `transparent ${color} transparent transparent`,
      } as CSSProperties;
  }
}

// Variant styles are now in CSS via data-variant attribute selectors

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    {
      content,
      placement = 'top',
      delay = 200,
      children,
      arrow = false,
      offset = 8,
      open: controlledOpen,
      onOpenChange,
      variant = 'dark',
      className,
      style,
      xstyle,
      testId,
      ...rest
    },
    ref,
  ) {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipId = useId();

    const show = useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!isControlled) setInternalOpen(true);
        onOpenChange?.(true);
      }, delay);
    }, [delay, isControlled, onOpenChange]);

    const hide = useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      if (!isControlled) setInternalOpen(false);
      onOpenChange?.(false);
    }, [isControlled, onOpenChange]);

    // Cleanup timer on unmount
    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const userStyle: CSSProperties | undefined =
      xstyle || style
        ? {
            ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : undefined),
            ...(Array.isArray(xstyle)
              ? xstyle.reduce<Record<string, string | number>>(
                  (a, s) => (s ? { ...a, ...s } : a),
                  {},
                )
              : undefined),
            ...style,
          }
        : undefined;

    const tooltipStyle: CSSProperties = {
      ...placementStyles(placement, offset),
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
    };

    return (
      <span
        ref={ref}
        className={cx('ui-tooltip-wrapper', className)}
        data-testid={testId}
        {...(userStyle ? { style: { display: 'inline-flex', ...userStyle } } : { style: { display: 'inline-flex' } })}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...rest}
      >
        {isValidElement(children) ? cloneElement(children as React.ReactElement<Record<string, unknown>>, { 'aria-describedby': tooltipId }) : children}
        <div
          id={tooltipId}
          className={cx('ui-tooltip', `ui-tooltip--${variant}`, `ui-tooltip--${placement}`)}
          style={tooltipStyle}
          role="tooltip"
          aria-hidden={!isOpen}
        >
          {content}
          {arrow && (
            <span
              className="ui-tooltip__arrow"
              style={arrowStyles(placement, variant)}
              aria-hidden="true"
            />
          )}
        </div>
      </span>
    );
  },
);
