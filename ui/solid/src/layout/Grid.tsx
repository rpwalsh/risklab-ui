/**
 * @risklab/ui-solid — Grid
 * SolidJS CSS grid layout with columns, rows, gap.
 */

import { mergeProps, splitProps, type Component } from 'solid-js';
import type { GridProps } from '../core/types';

export const Grid: Component<GridProps> = (rawProps) => {
  const props = mergeProps(
    {
      columns: 12,
      gap: 'var(--ui-space-3, 0.75rem)',
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'columns',
    'gap',
    'rows',
    'children',
    'class',
    'style',
  ]);

  const gridCols = () => {
    const c = local.columns;
    if (typeof c === 'number') return `repeat(${c}, 1fr)`;
    return c;
  };

  return (
    <div
      class={local.class}
      style={{
        display: 'grid',
        'grid-template-columns': gridCols(),
        'grid-template-rows': local.rows ?? undefined,
        gap: local.gap,
        'box-sizing': 'border-box',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      {local.children}
    </div>
  );
};
