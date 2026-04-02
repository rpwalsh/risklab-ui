/**
 * @risklab/ui-solid — Divider
 * SolidJS divider with horizontal/vertical orientation.
 */

import { mergeProps, splitProps, type Component } from 'solid-js';
import type { DividerProps } from '../core/types';

export const Divider: Component<DividerProps> = (rawProps) => {
  const props = mergeProps(
    {
      orientation: 'horizontal' as const,
      color: 'var(--ui-color-border, #e2e8f0)',
      thickness: '1px',
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'orientation',
    'color',
    'thickness',
    'class',
    'style',
  ]);

  const dividerStyle = (): Record<string, string> => {
    if (local.orientation === 'vertical') {
      return {
        display: 'inline-block',
        width: local.thickness,
        'align-self': 'stretch',
        'min-height': '1em',
        'background-color': local.color,
      };
    }
    return {
      width: '100%',
      height: local.thickness,
      'background-color': local.color,
    };
  };

  return (
    <div
      role="separator"
      aria-orientation={local.orientation}
      class={local.class}
      style={{ ...dividerStyle(), ...(local.style as Record<string, string> | undefined) }}
    />
  );
};
