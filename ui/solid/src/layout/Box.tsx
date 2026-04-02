/**
 * @risklab/ui-solid — Box
 * SolidJS polymorphic container using <Dynamic>.
 */

import { mergeProps, splitProps, type Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { BoxProps } from '../core/types';

export const Box: Component<BoxProps> = (rawProps) => {
  const props = mergeProps({ as: 'div' }, rawProps);
  const [local] = splitProps(props, [
    'as',
    'p',
    'm',
    'display',
    'bg',
    'children',
    'class',
    'style',
  ]);

  return (
    <Dynamic
      component={local.as}
      class={local.class}
      style={{
        padding: local.p ?? undefined,
        margin: local.m ?? undefined,
        display: local.display ?? undefined,
        'background-color': local.bg ?? undefined,
        'box-sizing': 'border-box',
        'font-family': 'var(--ui-font-family, inherit)',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      {local.children}
    </Dynamic>
  );
};
