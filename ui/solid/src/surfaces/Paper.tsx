/**
 * @risklab/ui-solid — Paper
 * SolidJS paper/surface component with elevation and variants.
 */

import { mergeProps, splitProps, type Component } from 'solid-js';
import type { PaperProps } from '../core/types';

export const Paper: Component<PaperProps> = (rawProps) => {
  const props = mergeProps(
    {
      variant: 'elevated' as const,
      elevation: 1,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'variant',
    'elevation',
    'children',
    'class',
    'style',
  ]);

  const shadowMap: Record<number, string> = {
    0: 'none',
    1: 'var(--ui-shadow-sm)',
    2: 'var(--ui-shadow-md)',
    3: 'var(--ui-shadow-lg)',
    4: 'var(--ui-shadow-xl)',
    5: 'var(--ui-shadow-2xl)',
  };

  const paperStyle = (): Record<string, string> => {
    const base: Record<string, string> = {
      'background-color': 'var(--ui-color-surface, #fff)',
      'border-radius': 'var(--ui-radius-md, 0.5rem)',
      'font-family': 'var(--ui-font-family, inherit)',
      color: 'var(--ui-color-text)',
      'box-sizing': 'border-box',
    };

    switch (local.variant) {
      case 'elevated':
        base['box-shadow'] = shadowMap[local.elevation] ?? shadowMap[1];
        break;
      case 'outlined':
        base.border = '1px solid var(--ui-color-border, #e2e8f0)';
        break;
      case 'flat':
        break;
    }

    return base;
  };

  return (
    <div
      class={local.class}
      style={{ ...paperStyle(), ...(local.style as Record<string, string> | undefined) }}
    >
      {local.children}
    </div>
  );
};
