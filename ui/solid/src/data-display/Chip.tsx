/**
 * @risklab/ui-solid — Chip
 * SolidJS chip/tag component with variant, color, size, deletable.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import type { ChipProps } from '../core/types';
import { colorVar } from '../core/tokens';

export const Chip: Component<ChipProps> = (rawProps) => {
  const props = mergeProps(
    {
      variant: 'filled' as const,
      size: 'md' as const,
      color: 'primary' as const,
      deletable: false,
      disabled: false,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'variant',
    'size',
    'color',
    'deletable',
    'disabled',
    'onDelete',
    'children',
    'class',
    'style',
  ]);

  const chipHeight = (): string => {
    const m: Record<string, string> = { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem', xl: '3rem' };
    return m[local.size] ?? '2rem';
  };

  const chipFontSize = (): string => {
    const m: Record<string, string> = { xs: '0.625rem', sm: '0.75rem', md: '0.8125rem', lg: '0.875rem', xl: '1rem' };
    return m[local.size] ?? '0.8125rem';
  };

  const chipPadding = (): string => {
    const m: Record<string, string> = { xs: '0 0.375rem', sm: '0 0.5rem', md: '0 0.75rem', lg: '0 1rem', xl: '0 1.25rem' };
    return m[local.size] ?? '0 0.75rem';
  };

  const chipStyle = (): Record<string, string> => {
    const cv = colorVar(local.color);
    const base: Record<string, string> = {
      display: 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center',
      gap: '0.375em',
      height: chipHeight(),
      padding: chipPadding(),
      'font-size': chipFontSize(),
      'font-family': 'var(--ui-font-family, inherit)',
      'font-weight': '500',
      'line-height': '1',
      'border-radius': '9999px',
      'white-space': 'nowrap',
      'box-sizing': 'border-box',
      transition: 'background-color 150ms, color 150ms',
      'user-select': 'none',
      opacity: local.disabled ? '0.5' : '1',
      'pointer-events': local.disabled ? 'none' : 'auto',
    };

    if (local.variant === 'filled') {
      base['background-color'] = cv;
      base.color = '#fff';
      base.border = '1px solid transparent';
    } else {
      base['background-color'] = 'transparent';
      base.color = cv;
      base.border = `1px solid ${cv}`;
    }

    return base;
  };

  return (
    <span
      class={local.class}
      style={{ ...chipStyle(), ...(local.style as Record<string, string> | undefined) }}
    >
      <span style={{ overflow: 'hidden', 'text-overflow': 'ellipsis' }}>{local.children}</span>
      <Show when={local.deletable && !local.disabled}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            local.onDelete?.();
          }}
          style={{
            display: 'inline-flex',
            'align-items': 'center',
            'justify-content': 'center',
            padding: '0',
            margin: '0 -0.25em 0 0',
            border: 'none',
            background: 'none',
            color: 'inherit',
            cursor: 'pointer',
            opacity: '0.7',
            'font-size': '1em',
            'line-height': '1',
            'border-radius': '50%',
            outline: 'none',
          }}
          aria-label="Remove"
        >
          ✕
        </button>
      </Show>
    </span>
  );
};
