/**
 * @risklab/ui-solid — Avatar
 * SolidJS avatar component with image, initials, size, variant.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import type { AvatarProps } from '../core/types';
import { avatarSizeMap } from '../core/tokens';

export const Avatar: Component<AvatarProps> = (rawProps) => {
  const props = mergeProps(
    {
      size: 'md' as const,
      variant: 'circular' as const,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'src',
    'alt',
    'size',
    'variant',
    'initials',
    'class',
    'style',
  ]);

  const dimension = () => avatarSizeMap[local.size] ?? '40px';

  const borderRadius = () => {
    switch (local.variant) {
      case 'circular':
        return '50%';
      case 'rounded':
        return 'var(--ui-radius-md, 0.5rem)';
      case 'square':
        return '0';
      default:
        return '50%';
    }
  };

  return (
    <span
      class={local.class}
      style={{
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        'flex-shrink': '0',
        overflow: 'hidden',
        width: dimension(),
        height: dimension(),
        'border-radius': borderRadius(),
        'font-family': 'var(--ui-font-family, inherit)',
        'font-weight': '600',
        'line-height': '1',
        'user-select': 'none',
        'box-sizing': 'border-box',
        'background-color': local.src ? 'transparent' : 'var(--ui-color-primary)',
        color: local.src ? 'inherit' : '#fff',
        'font-size': `calc(${dimension()} * 0.4)`,
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      <Show
        when={local.src}
        fallback={
          <span>{local.initials ?? '?'}</span>
        }
      >
        <img
          src={local.src}
          alt={local.alt ?? ''}
          style={{
            width: '100%',
            height: '100%',
            'object-fit': 'cover',
            display: 'block',
          }}
        />
      </Show>
    </span>
  );
};
