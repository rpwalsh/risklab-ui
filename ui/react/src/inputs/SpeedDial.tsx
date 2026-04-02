import React, { forwardRef, useState, useRef, useCallback, useEffect } from 'react';
import type { ColorVariant, SizeVariant } from '../styling/types';
import { cx, sx } from '../styling';

export interface SpeedDialAction {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tooltipPlacement?: 'left' | 'right' | 'top' | 'bottom';
}

export interface SpeedDialProps {
  actions: SpeedDialAction[];
  icon?: React.ReactNode;
  openIcon?: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  color?: ColorVariant;
  size?: SizeVariant;
  backdrop?: boolean;
  ariaLabel?: string;
  tooltipOpen?: boolean;
  hidden?: boolean;
  FabProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

const directionOffset: Record<string, [string, string]> = {
  up: ['0', '-100%'],
  down: ['0', '100%'],
  left: ['-100%', '0'],
  right: ['100%', '0'],
};

export const SpeedDial = forwardRef<HTMLDivElement, SpeedDialProps>(function SpeedDial(
  {
    actions,
    icon = '+',
    openIcon = '×',
    direction = 'up',
    open: controlledOpen,
    defaultOpen = false,
    onOpen,
    onClose,
    color = 'primary',
    size = 'md',
    backdrop = true,
    ariaLabel = 'Speed Dial',
    tooltipOpen = false,
    hidden = false,
    FabProps,
    xstyle,
    className,
    style,
    testId,
  },
  ref
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = useCallback(() => {
    if (isOpen) { onClose?.(); if (controlledOpen === undefined) setInternalOpen(false); }
    else { onOpen?.(); if (controlledOpen === undefined) setInternalOpen(true); }
  }, [isOpen, onOpen, onClose, controlledOpen]);

  const close = useCallback(() => {
    onClose?.();
    if (controlledOpen === undefined) setInternalOpen(false);
  }, [onClose, controlledOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  const fabSize = size === 'xs' ? 40 : size === 'sm' ? 44 : size === 'lg' ? 62 : size === 'xl' ? 70 : 56;
  const actionSize = Math.round(fabSize * 0.76);
  const gap = 12;
  const { style: fabInlineStyle, className: fabClassName, ...fabButtonProps } = FabProps ?? {};

  const isVertical = direction === 'up' || direction === 'down';
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    ...(direction === 'up' ? { flexDirection: 'column-reverse' } : {}),
    ...(direction === 'left' ? { flexDirection: 'row-reverse' } : {}),
    gap: `${gap}px`,
  };
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;
  const backdropSx = sx({ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 'var(--ui-z-backdrop, 1200)', backdropFilter: 'blur(1px)', animation: 'ui-fade-in 0.15s ease' });
  const rootSx = sx({ ...containerStyle, zIndex: 'var(--ui-z-fab, 1250)', ...(style as Record<string, string | number> | undefined), ...(mergedExternalStyles as Record<string, string | number> | undefined) });
  const actionsSx = sx({ display: 'flex', flexDirection: isVertical ? (direction === 'up' ? 'column-reverse' : 'column') : (direction === 'left' ? 'row-reverse' : 'row'), gap: `${gap}px`, alignItems: 'center', overflow: 'visible', pointerEvents: isOpen ? 'all' : 'none' });

  if (hidden) return null;

  return (
    <>
      {backdrop && isOpen && (
        <div
          aria-hidden="true"
          onClick={close}
          className={cx('ui-speed-dial__backdrop', backdropSx.className)}
        />
      )}
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cx('ui-speed-dial', className, rootSx.className)}
        data-testid={testId}
      >
        {/* Actions */}
        <div
          role="menu"
          aria-label={`${ariaLabel} actions`}
          className={cx('ui-speed-dial__actions', actionsSx.className)}
        >
          {actions.map((action, i) => {
            const delay = isOpen ? `${i * 40}ms` : `${(actions.length - 1 - i) * 30}ms`;
            const [tx, ty] = directionOffset[direction];
            return (
              <div
                key={i}
                role="menuitem"
                className={sx({
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexDirection: direction === 'left' ? 'row' : direction === 'right' ? 'row-reverse' : 'row',
                  transform: isOpen ? 'translate(0,0) scale(1)' : `translate(${tx},${ty}) scale(0.8)`,
                  opacity: isOpen ? 1 : 0,
                  transition: `transform 0.2s cubic-bezier(0.34,1.56,0.64,1) ${delay}, opacity 0.15s ease ${delay}`,
                }).className}
              >
                {(tooltipOpen || action.label) && (
                  <span
                    className={sx({
                      background: 'var(--ui-color-surface-inverse, #1e293b)',
                      color: 'var(--ui-color-text-inverse, #fff)',
                      padding: '4px 10px',
                      borderRadius: 'var(--ui-radius-sm, 4px)',
                      fontSize: 'var(--ui-text-xs, 12px)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      boxShadow: 'var(--ui-shadow-sm)',
                    }).className}
                  >
                    {action.label}
                  </span>
                )}
                <button
                  type="button"
                  aria-label={action.label}
                  disabled={action.disabled}
                  onClick={() => { if (!action.disabled) { action.onClick?.(); close(); } }}
                  className={sx({
                    width: `${actionSize}px`,
                    height: `${actionSize}px`,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'var(--ui-color-surface, #fff)',
                    color: `var(--ui-color-${color}, var(--ui-color-primary))`,
                    boxShadow: 'var(--ui-shadow-md, 0 4px 12px rgba(0,0,0,0.15))',
                    cursor: action.disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${actionSize * 0.42}px`,
                    opacity: action.disabled ? 0.5 : 1,
                    transition: 'box-shadow var(--ui-transition-fast), transform var(--ui-transition-fast)',
                    flexShrink: 0,
                  }).className}
                >
                  {action.icon}
                </button>
              </div>
            );
          })}
        </div>

        {/* Main FAB */}
        {isOpen ? (
          <button
            type="button"
            aria-label={ariaLabel}
            aria-expanded="true"
            aria-haspopup="menu"
            onClick={toggle}
            {...fabButtonProps}
            className={cx('ui-speed-dial__fab', fabClassName, sx({
              width: `${fabSize}px`,
              height: `${fabSize}px`,
              borderRadius: '50%',
              border: 'none',
              background: `var(--ui-color-${color}, var(--ui-color-primary))`,
              color: '#fff',
              boxShadow: 'var(--ui-shadow-xl, 0 8px 24px rgba(0,0,0,0.2))',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${fabSize * 0.4}px`,
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow var(--ui-transition-base)',
              transform: 'rotate(45deg)',
              zIndex: 1,
              flexShrink: 0,
              ...(fabInlineStyle as Record<string, string | number> | undefined),
            }).className)}
          >
            {openIcon || icon}
          </button>
        ) : (
          <button
            type="button"
            aria-label={ariaLabel}
            aria-expanded="false"
            aria-haspopup="menu"
            onClick={toggle}
            {...fabButtonProps}
            className={cx('ui-speed-dial__fab', fabClassName, sx({
              width: `${fabSize}px`,
              height: `${fabSize}px`,
              borderRadius: '50%',
              border: 'none',
              background: `var(--ui-color-${color}, var(--ui-color-primary))`,
              color: '#fff',
              boxShadow: 'var(--ui-shadow-lg, 0 6px 20px rgba(0,0,0,0.18))',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${fabSize * 0.4}px`,
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow var(--ui-transition-base)',
              transform: 'rotate(0deg)',
              zIndex: 1,
              flexShrink: 0,
              ...(fabInlineStyle as Record<string, string | number> | undefined),
            }).className)}
          >
            {icon}
          </button>
        )}
      </div>
    </>
  );
});
