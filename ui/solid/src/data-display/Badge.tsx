/**
 * @risklab/ui-solid — Badge
 * SolidJS badge component with content, max, dot variant, color.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import type { BadgeProps } from '../core/types';
import { colorVar } from '../core/tokens';

export const Badge: Component<BadgeProps> = (rawProps) => {
  const props = mergeProps(
    {
      variant: 'standard' as const,
      color: 'error' as const,
      max: 99,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'content',
    'variant',
    'color',
    'max',
    'children',
    'class',
    'style',
  ]);

  const displayContent = () => {
    if (local.variant === 'dot') return '';
    const val = local.content;
    if (val == null) return '';
    if (typeof val === 'number' && val > local.max) return `${local.max}+`;
    return String(val);
  };

  const isDot = () => local.variant === 'dot';
  const isVisible = () => isDot() || (local.content != null && local.content !== '');

  const indicatorStyle = (): Record<string, string> => {
    const base: Record<string, string> = {
      position: 'absolute',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'box-sizing': 'border-box',
      'font-family': 'var(--ui-font-family, inherit)',
      'font-weight': '600',
      'line-height': '1',
      'white-space': 'nowrap',
      'z-index': '1',
      border: '2px solid #fff',
      top: '0',
      right: '0',
      transform: 'translateX(50%) translateY(-50%)',
      'background-color': colorVar(local.color),
      color: '#fff',
    };
    if (isDot()) {
      base['min-width'] = '0.5rem';
      base.height = '0.5rem';
      base['border-radius'] = '50%';
      base.padding = '0';
      base['font-size'] = '0';
    } else {
      base['min-width'] = '1.25rem';
      base.height = '1.25rem';
      base['font-size'] = '0.75rem';
      base.padding = '0 0.375rem';
      base['border-radius'] = '0.625rem';
    }
    return base;
  };

  return (
    <span
      class={local.class}
      style={{
        position: 'relative',
        display: 'inline-flex',
        'vertical-align': 'middle',
        'flex-shrink': '0',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      {local.children}
      <Show when={isVisible()}>
        <span style={indicatorStyle()}>
          {displayContent()}
        </span>
      </Show>
    </span>
  );
};
