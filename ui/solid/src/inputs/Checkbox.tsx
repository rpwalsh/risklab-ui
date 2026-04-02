/**
 * @risklab/ui-solid — Checkbox
 * SolidJS checkbox with indeterminate, size, color, label support.
 */

import { mergeProps, splitProps, createEffect, Show, type Component } from 'solid-js';
import type { CheckboxProps } from '../core/types';
import { colorVar } from '../core/tokens';

export const Checkbox: Component<CheckboxProps> = (rawProps) => {
  const props = mergeProps(
    {
      checked: false,
      indeterminate: false,
      disabled: false,
      size: 'md' as const,
      color: 'primary' as const,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'checked',
    'onChange',
    'indeterminate',
    'disabled',
    'size',
    'color',
    'label',
    'class',
    'style',
  ]);

  let inputRef!: HTMLInputElement;

  createEffect(() => {
    if (inputRef) {
      inputRef.indeterminate = local.indeterminate;
    }
  });

  const sizeVal = (): string => {
    const m: Record<string, string> = { xs: '0.875rem', sm: '1rem', md: '1.25rem', lg: '1.5rem', xl: '1.75rem' };
    return m[local.size] ?? '1.25rem';
  };

  const handleChange = () => {
    local.onChange?.(!local.checked);
  };

  return (
    <label
      class={local.class}
      style={{
        display: 'inline-flex',
        'align-items': 'center',
        gap: '0.5em',
        cursor: local.disabled ? 'not-allowed' : 'pointer',
        opacity: local.disabled ? '0.5' : '1',
        'font-family': 'var(--ui-font-family, inherit)',
        'font-size': 'var(--ui-text-sm, 0.875rem)',
        'user-select': 'none',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={local.checked}
        disabled={local.disabled}
        onChange={handleChange}
        style={{
          width: sizeVal(),
          height: sizeVal(),
          'accent-color': colorVar(local.color),
          cursor: local.disabled ? 'not-allowed' : 'pointer',
          margin: '0',
          'flex-shrink': '0',
        }}
      />
      <Show when={local.label}>
        <span>{local.label}</span>
      </Show>
    </label>
  );
};
