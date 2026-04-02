/**
 * @risklab/ui-solid — Button
 * SolidJS button component with variant, size, color, loading states.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import type { ButtonProps } from '../core/types';
import { colorVar, sizeMap } from '../core/tokens';

export const Button: Component<ButtonProps> = (rawProps) => {
  const props = mergeProps(
    {
      variant: 'filled' as const,
      size: 'md' as const,
      color: 'primary' as const,
      disabled: false,
      loading: false,
      fullWidth: false,
      type: 'button' as const,
    },
    rawProps,
  );

  const [local, rest] = splitProps(props, [
    'variant',
    'size',
    'color',
    'disabled',
    'loading',
    'fullWidth',
    'type',
    'onClick',
    'children',
    'class',
    'style',
  ]);

  const baseStyle = (): Record<string, string> => {
    const sz = sizeMap[local.size];
    const cv = colorVar(local.color);
    const base: Record<string, string> = {
      display: 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center',
      gap: '0.5em',
      height: sz.height,
      padding: sz.padding,
      'font-size': sz.fontSize,
      'font-family': 'var(--ui-font-family, inherit)',
      'font-weight': '500',
      'line-height': '1',
      'border-radius': sz.radius,
      cursor: local.disabled || local.loading ? 'not-allowed' : 'pointer',
      opacity: local.disabled ? '0.5' : '1',
      transition: 'background-color var(--ui-transition-fast), color var(--ui-transition-fast), border-color var(--ui-transition-fast)',
      'white-space': 'nowrap',
      'box-sizing': 'border-box',
      width: local.fullWidth ? '100%' : 'auto',
      'text-decoration': 'none',
      'user-select': 'none',
      border: 'none',
      outline: 'revert',
    };

    switch (local.variant) {
      case 'filled':
        base['background-color'] = cv;
        base.color = '#fff';
        break;
      case 'outlined':
        base['background-color'] = 'transparent';
        base.color = cv;
        base.border = `1px solid ${cv}`;
        break;
      case 'ghost':
        base['background-color'] = 'transparent';
        base.color = cv;
        break;
      case 'link':
        base['background-color'] = 'transparent';
        base.color = cv;
        base.height = 'auto';
        base.padding = '0';
        base['text-decoration'] = 'underline';
        break;
    }

    return base;
  };

  return (
    <button
      type={local.type}
      disabled={local.disabled || local.loading}
      class={local.class}
      style={{ ...baseStyle(), ...(local.style as Record<string, string> | undefined) }}
      onClick={local.onClick}
    >
      <Show when={local.loading}>
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          style={{ animation: 'ui-spin 0.75s linear infinite', 'flex-shrink': '0' }}
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      </Show>
      {local.children}
    </button>
  );
};
