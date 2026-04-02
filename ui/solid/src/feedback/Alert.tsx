/**
 * @risklab/ui-solid — Alert
 * SolidJS alert with severity, variant, closable.
 */

import { mergeProps, splitProps, createSignal, Show, type Component } from 'solid-js';
import type { AlertProps } from '../core/types';

const SEVERITY_ICONS: Record<string, string> = {
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
  error: '✕',
};

export const Alert: Component<AlertProps> = (rawProps) => {
  const props = mergeProps(
    {
      severity: 'info' as const,
      variant: 'standard' as const,
      closable: false,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'severity',
    'variant',
    'closable',
    'onClose',
    'children',
    'class',
    'style',
  ]);

  const [visible, setVisible] = createSignal(true);

  const severityColors = () => {
    const m: Record<string, { bg: string; color: string; border: string }> = {
      success: { bg: 'var(--ui-alert-success-bg, #f0fdf4)', color: 'var(--ui-color-success, #16a34a)', border: 'var(--ui-color-success, #16a34a)' },
      info: { bg: 'var(--ui-alert-info-bg, #eff6ff)', color: 'var(--ui-color-info, #2563eb)', border: 'var(--ui-color-info, #2563eb)' },
      warning: { bg: 'var(--ui-alert-warning-bg, #fffbeb)', color: 'var(--ui-color-warning, #d97706)', border: 'var(--ui-color-warning, #d97706)' },
      error: { bg: 'var(--ui-alert-error-bg, #fef2f2)', color: 'var(--ui-color-error, #dc2626)', border: 'var(--ui-color-error, #dc2626)' },
    };
    return m[local.severity] ?? m.info;
  };

  const alertStyle = (): Record<string, string> => {
    const sc = severityColors();
    const base: Record<string, string> = {
      display: 'flex',
      'align-items': 'flex-start',
      padding: '12px 16px',
      'border-radius': 'var(--ui-radius-sm, 4px)',
      'font-family': 'var(--ui-font-family, inherit)',
      'font-size': '0.875rem',
      'line-height': '1.43',
      gap: '12px',
    };

    switch (local.variant) {
      case 'standard':
        base['background-color'] = sc.bg;
        base.color = sc.color;
        break;
      case 'outlined':
        base['background-color'] = 'transparent';
        base.border = `1px solid ${sc.border}`;
        base.color = sc.color;
        break;
      case 'filled':
        base['background-color'] = sc.color;
        base.color = '#fff';
        break;
    }

    return base;
  };

  const handleClose = () => {
    setVisible(false);
    local.onClose?.();
  };

  return (
    <Show when={visible()}>
      <div
        role="alert"
        class={local.class}
        style={{ ...alertStyle(), ...(local.style as Record<string, string> | undefined) }}
      >
        <span style={{ display: 'flex', 'align-items': 'center', 'flex-shrink': '0', 'margin-top': '2px' }}>
          {SEVERITY_ICONS[local.severity] ?? 'ℹ'}
        </span>
        <div style={{ flex: '1', 'min-width': '0' }}>{local.children}</div>
        <Show when={local.closable}>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close alert"
            style={{
              display: 'inline-flex',
              'align-items': 'center',
              'justify-content': 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              'border-radius': '50%',
              color: 'inherit',
              opacity: '0.7',
              'font-size': '1rem',
              'line-height': '1',
            }}
          >
            ✕
          </button>
        </Show>
      </div>
    </Show>
  );
};
