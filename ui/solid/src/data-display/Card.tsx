/**
 * @risklab/ui-solid — Card
 * SolidJS card component with variants, interactive mode, header & footer slots.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import type { CardProps } from '../core/types';

export const Card: Component<CardProps> = (rawProps) => {
  const props = mergeProps(
    {
      variant: 'elevated' as const,
      interactive: false,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'variant',
    'interactive',
    'header',
    'footer',
    'children',
    'class',
    'style',
  ]);

  const cardStyle = (): Record<string, string> => {
    const base: Record<string, string> = {
      display: 'flex',
      'flex-direction': 'column',
      'border-radius': 'var(--ui-card-radius, 0.75rem)',
      overflow: 'hidden',
      'font-family': 'var(--ui-font-family, inherit)',
      color: 'var(--ui-color-text, inherit)',
      transition: 'box-shadow 200ms, transform 100ms',
      'box-sizing': 'border-box',
      cursor: local.interactive ? 'pointer' : 'default',
    };

    switch (local.variant) {
      case 'elevated':
        base['background-color'] = 'var(--ui-color-surface, #fff)';
        base['box-shadow'] = 'var(--ui-shadow-sm, 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06))';
        break;
      case 'outlined':
        base['background-color'] = 'var(--ui-color-surface, #fff)';
        base.border = '1px solid var(--ui-color-border, #e5e7eb)';
        break;
      case 'filled':
        base['background-color'] = 'var(--ui-color-surface-variant, #f9fafb)';
        break;
    }

    return base;
  };

  return (
    <div
      class={local.class}
      style={{ ...cardStyle(), ...(local.style as Record<string, string> | undefined) }}
    >
      <Show when={local.header}>
        <div style={{ padding: '1rem 1rem 0', 'box-sizing': 'border-box' }}>
          {local.header}
        </div>
      </Show>
      <div style={{ padding: '1rem', 'box-sizing': 'border-box', flex: '1' }}>
        {local.children}
      </div>
      <Show when={local.footer}>
        <div
          style={{
            display: 'flex',
            'align-items': 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem 1rem',
            'box-sizing': 'border-box',
            'justify-content': 'flex-end',
          }}
        >
          {local.footer}
        </div>
      </Show>
    </div>
  );
};
