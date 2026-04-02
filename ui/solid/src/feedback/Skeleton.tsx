/**
 * @risklab/ui-solid — Skeleton
 * SolidJS skeleton placeholder with variant, width, height, animation.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import type { SkeletonProps } from '../core/types';

export const Skeleton: Component<SkeletonProps> = (rawProps) => {
  const props = mergeProps(
    {
      variant: 'text' as const,
      animation: 'pulse' as const,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'variant',
    'width',
    'height',
    'animation',
    'class',
    'style',
  ]);

  const skeletonStyle = (): Record<string, string> => {
    const base: Record<string, string> = {
      display: 'block',
      'background-color': 'rgba(0, 0, 0, 0.11)',
    };

    switch (local.variant) {
      case 'text':
        base.height = local.height ?? '1.2em';
        base.width = local.width ?? '100%';
        base['border-radius'] = '4px';
        base['transform-origin'] = '0 55%';
        base.transform = 'scale(1, 0.6)';
        break;
      case 'circular':
        base.width = local.width ?? '40px';
        base.height = local.height ?? '40px';
        base['border-radius'] = '50%';
        break;
      case 'rectangular':
        base.width = local.width ?? '100%';
        base.height = local.height ?? '100px';
        base['border-radius'] = '0';
        break;
      case 'rounded':
        base.width = local.width ?? '100%';
        base.height = local.height ?? '100px';
        base['border-radius'] = '8px';
        break;
    }

    if (local.animation === 'pulse') {
      base.animation = 'ui-pulse 1.5s ease-in-out infinite';
    } else if (local.animation === 'wave') {
      base.overflow = 'hidden';
      base.position = 'relative';
    }

    return base;
  };

  return (
    <span
      class={local.class}
      style={{
        ...skeletonStyle(),
        ...(local.style as Record<string, string> | undefined),
      }}
      aria-hidden="true"
    >
      <Show when={local.animation === 'wave'}>
        <span
          style={{
            position: 'absolute',
            inset: '0',
            animation: 'ui-wave 1.6s linear 0.5s infinite',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      </Show>
    </span>
  );
};
