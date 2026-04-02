/**
 * @risklab/ui-solid — Select
 * SolidJS select component with label, options, helper text, error state.
 */

import { mergeProps, splitProps, Show, For, createUniqueId, type Component } from 'solid-js';
import type { SelectProps } from '../core/types';
import { sizeMap } from '../core/tokens';

export const Select: Component<SelectProps> = (rawProps) => {
  const props = mergeProps(
    {
      size: 'md' as const,
      disabled: false,
      error: false,
      options: [] as { value: string; label: string; disabled?: boolean }[],
    },
    rawProps,
  );

  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'options',
    'size',
    'label',
    'placeholder',
    'disabled',
    'error',
    'helperText',
    'class',
    'style',
  ]);

  const selectId = createUniqueId();

  const sz = () => sizeMap[local.size];

  const borderColor = () =>
    local.error ? 'var(--ui-color-error)' : 'var(--ui-color-border, #d1d5db)';

  const selectStyle = (): Record<string, string> => {
    const s = sz();
    return {
      height: s.height,
      padding: s.padding,
      'padding-right': '2rem',
      'font-size': s.fontSize,
      'font-family': 'inherit',
      'background-color': 'var(--ui-color-surface, #fff)',
      border: `1px solid ${borderColor()}`,
      'border-radius': s.radius,
      color: 'inherit',
      outline: 'none',
      cursor: local.disabled ? 'not-allowed' : 'pointer',
      appearance: 'none',
      'background-image':
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
      'background-repeat': 'no-repeat',
      'background-position': 'right 0.5rem center',
      transition: 'border-color 150ms',
      'box-sizing': 'border-box',
      width: '100%',
      opacity: local.disabled ? '0.5' : '1',
    };
  };

  const handleChange = (e: Event) => {
    const target = e.currentTarget as HTMLSelectElement;
    local.onChange?.(target.value);
  };

  return (
    <div
      class={local.class}
      style={{
        display: 'flex',
        'flex-direction': 'column',
        gap: '0.25rem',
        'font-family': 'var(--ui-font-family, inherit)',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      <Show when={local.label}>
        <label
          for={selectId}
          style={{
            'font-size': '0.8125rem',
            'font-weight': '500',
            color: 'var(--ui-color-text, #374151)',
          }}
        >
          {local.label}
        </label>
      </Show>
      <select
        {...rest}
        id={selectId}
        value={local.value ?? ''}
        disabled={local.disabled}
        onChange={handleChange}
        style={selectStyle()}
      >
        <Show when={local.placeholder}>
          <option value="" disabled>
            {local.placeholder}
          </option>
        </Show>
        <For each={local.options}>
          {(opt) => (
            <option value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          )}
        </For>
      </select>
      <Show when={local.helperText}>
        <p
          style={{
            'font-size': '0.75rem',
            margin: '0',
            color: local.error
              ? 'var(--ui-color-error)'
              : 'var(--ui-color-text-secondary, #6b7280)',
          }}
        >
          {local.helperText}
        </p>
      </Show>
    </div>
  );
};
