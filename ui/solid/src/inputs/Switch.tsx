/**
 * @risklab/ui-solid — Switch
 * SolidJS toggle switch with size, color, label.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import type { SwitchProps } from '../core/types';
import { colorVar } from '../core/tokens';

export const Switch: Component<SwitchProps> = (rawProps) => {
  const props = mergeProps(
    {
      checked: false,
      disabled: false,
      size: 'md' as const,
      color: 'primary' as const,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'checked',
    'onChange',
    'disabled',
    'size',
    'color',
    'label',
    'class',
    'style',
  ]);

  const dims = () => {
    const m: Record<string, { trackW: string; trackH: string; thumb: string; fontSize: string }> = {
      xs: { trackW: '1.75rem', trackH: '1rem', thumb: '0.75rem', fontSize: '0.75rem' },
      sm: { trackW: '2.25rem', trackH: '1.25rem', thumb: '0.9375rem', fontSize: '0.8125rem' },
      md: { trackW: '2.75rem', trackH: '1.5rem', thumb: '1.125rem', fontSize: '0.875rem' },
      lg: { trackW: '3.25rem', trackH: '1.75rem', thumb: '1.375rem', fontSize: '1rem' },
      xl: { trackW: '3.75rem', trackH: '2rem', thumb: '1.625rem', fontSize: '1.125rem' },
    };
    return m[local.size] ?? m.md;
  };

  const handleClick = () => {
    if (!local.disabled) {
      local.onChange?.(!local.checked);
    }
  };

  return (
    <label
      class={local.class}
      style={{
        display: 'inline-flex',
        'align-items': 'center',
        gap: '0.5em',
        cursor: local.disabled ? 'not-allowed' : 'pointer',
        opacity: local.disabled ? '0.5' : '1',
        'font-size': dims().fontSize,
        'font-family': 'var(--ui-font-family, inherit)',
        'user-select': 'none',
        ...(local.style as Record<string, string> | undefined),
      }}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      <input
        type="checkbox"
        role="switch"
        checked={local.checked}
        disabled={local.disabled}
        onChange={() => handleClick()}
        aria-checked={local.checked}
        aria-label={local.label ?? undefined}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          'white-space': 'nowrap',
          'border-width': '0',
        }}
      />
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          'align-items': 'center',
          width: dims().trackW,
          height: dims().trackH,
          'background-color': local.checked ? colorVar(local.color) : '#d1d5db',
          'border-radius': '9999px',
          transition: 'background-color 200ms',
          'flex-shrink': '0',
          'box-sizing': 'border-box',
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: dims().thumb,
            height: dims().thumb,
            'border-radius': '50%',
            'background-color': '#fff',
            'box-shadow': '0 1px 3px rgba(0,0,0,.2)',
            transition: 'transform 200ms',
            left: '2px',
            top: '50%',
            transform: local.checked
              ? `translateY(-50%) translateX(calc(${dims().trackW} - ${dims().thumb} - 4px))`
              : 'translateY(-50%)',
          }}
        />
      </span>
      <Show when={local.label}>
        <span>{local.label}</span>
      </Show>
    </label>
  );
};
