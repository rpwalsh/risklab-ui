import React, { forwardRef } from 'react';
import type { ColorVariant } from '../styling/types';
import { cx, sx } from '../styling';

export type CalloutVariant = 'filled' | 'outline' | 'subtle' | 'left-border';

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  color?: ColorVariant | 'info';
  variant?: CalloutVariant;
  closable?: boolean;
  onClose?: () => void;
  action?: React.ReactNode;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

const colorMeta: Record<string, { icon: string; token: string }> = {
  primary: { icon: 'ℹ', token: 'primary' },
  secondary: { icon: '●', token: 'secondary' },
  success: { icon: '✓', token: 'success' },
  warning: { icon: '▲', token: 'warning' },
  error: { icon: '✕', token: 'error' },
  info: { icon: 'ℹ', token: 'info' },
};

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(function Callout(
  {
    children,
    title,
    icon,
    color = 'info',
    variant = 'subtle',
    closable = false,
    onClose,
    action,
    xstyle,
    testId,
    className,
    style,
    ...rest
  },
  ref
) {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;

  const meta = colorMeta[color] ?? colorMeta.info;
  const token = meta.token;
  const displayIcon = icon ?? meta.icon;
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;

  const bg: Record<CalloutVariant, string> = {
    filled: `var(--ui-color-${token}, var(--ui-color-primary))`,
    outline: 'transparent',
    subtle: `color-mix(in srgb, var(--ui-color-${token}, var(--ui-color-primary)) 10%, var(--ui-color-surface, #fff))`,
    'left-border': `color-mix(in srgb, var(--ui-color-${token}, var(--ui-color-primary)) 8%, var(--ui-color-surface, #fff))`,
  };
  const textColor: Record<CalloutVariant, string> = {
    filled: '#fff',
    outline: `var(--ui-color-${token}, var(--ui-color-primary))`,
    subtle: `var(--ui-color-${token}, var(--ui-color-primary))`,
    'left-border': `var(--ui-color-${token}, var(--ui-color-primary))`,
  };
  const border: Record<CalloutVariant, string> = {
    filled: 'none',
    outline: `1.5px solid var(--ui-color-${token}, var(--ui-color-primary))`,
    subtle: 'none',
    'left-border': 'none',
  };

  return (
    <div
      ref={ref}
      role="note"
      className={cx('ui-callout', `ui-callout--${variant}`, `ui-callout--${color}`, className, sx({
        display: 'flex',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: variant === 'left-border' ? '0 var(--ui-radius-md, 8px) var(--ui-radius-md, 8px) 0' : 'var(--ui-radius-md, 8px)',
        background: bg[variant],
        border: border[variant],
        borderLeft: variant === 'left-border' ? `4px solid var(--ui-color-${token}, var(--ui-color-primary))` : null,
        color: textColor[variant],
        animation: 'ui-fade-in 0.2s ease',
        ...(style as Record<string, string | number> | undefined),
        ...(mergedExternalStyles as Record<string, string | number> | undefined),
      }).className)}
      data-testid={testId}
      {...rest}
    >
      <span className={sx({ fontSize: '18px', lineHeight: '24px', flexShrink: 0, marginTop: '1px' }).className}>
        {displayIcon}
      </span>
      <div className={sx({ flex: 1, minWidth: 0 }).className}>
        {title && (
          <p className={sx({ margin: '0 0 4px', fontWeight: 600, fontSize: 'var(--ui-text-sm, 14px)', lineHeight: 1.4 }).className}>
            {title}
          </p>
        )}
        {children && (
          <div className={sx({ fontSize: 'var(--ui-text-sm, 14px)', lineHeight: 1.6, opacity: variant === 'filled' ? 0.92 : 1 }).className}>
            {children}
          </div>
        )}
        {action && <div className={sx({ marginTop: '10px' }).className}>{action}</div>}
      </div>
      {closable && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => { setVisible(false); onClose?.(); }}
          className={sx({
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7,
            fontSize: '18px',
            lineHeight: 1,
            padding: 0,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: '2px',
          }).className}
        >
          ×
        </button>
      )}
    </div>
  );
});
