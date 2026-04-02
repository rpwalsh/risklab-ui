/**
 * @risklab/ui-solid — Stack
 * SolidJS flex stack with direction, gap, alignment.
 */

import { mergeProps, splitProps, type Component } from 'solid-js';
import type { StackProps } from '../core/types';

export const Stack: Component<StackProps> = (rawProps) => {
  const props = mergeProps(
    {
      direction: 'column' as const,
      gap: 'var(--ui-space-3, 0.75rem)',
      wrap: false,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'direction',
    'gap',
    'align',
    'justify',
    'wrap',
    'children',
    'class',
    'style',
  ]);

  return (
    <div
      class={local.class}
      style={{
        display: 'flex',
        'flex-direction': local.direction,
        gap: local.gap,
        'align-items': local.align ?? undefined,
        'justify-content': local.justify ?? undefined,
        'flex-wrap': local.wrap ? 'wrap' : 'nowrap',
        'box-sizing': 'border-box',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      {local.children}
    </div>
  );
};
