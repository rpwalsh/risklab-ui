/**
 * @risklab/ui-solid — TextField
 * SolidJS text input with label, helper text, variants, and error states.
 */

import { mergeProps, splitProps, Show, createUniqueId, type Component } from 'solid-js';
import type { TextFieldProps } from '../core/types';
import { sizeMap } from '../core/tokens';

export const TextField: Component<TextFieldProps> = (rawProps) => {
  const props = mergeProps(
    {
      variant: 'outlined' as const,
      size: 'md' as const,
      disabled: false,
      readonly: false,
      error: false,
      type: 'text',
    },
    rawProps,
  );

  const [local, rest] = splitProps(props, [
    'value',
    'onInput',
    'onChange',
    'variant',
    'size',
    'label',
    'placeholder',
    'disabled',
    'readonly',
    'error',
    'helperText',
    'type',
    'class',
    'style',
  ]);

  const inputId = createUniqueId();

  const sz = () => sizeMap[local.size];

  const borderColor = () =>
    local.error ? 'var(--ui-color-error)' : 'var(--ui-color-border, #d1d5db)';

  const focusBorder = () =>
    local.error ? 'var(--ui-color-error)' : 'var(--ui-color-primary)';

  const wrapperStyle = (): Record<string, string> => {
    const s = sz();
    const base: Record<string, string> = {
      display: 'flex',
      'align-items': 'center',
      gap: '0.5em',
      height: s.height,
      padding: s.padding,
      'font-size': s.fontSize,
      'border-radius': s.radius,
      transition: 'border-color 150ms',
      'box-sizing': 'border-box',
      opacity: local.disabled ? '0.5' : '1',
    };

    switch (local.variant) {
      case 'outlined':
        base['background-color'] = 'transparent';
        base.border = `1px solid ${borderColor()}`;
        break;
      case 'filled':
        base['background-color'] = 'var(--ui-color-surface-variant, #f3f4f6)';
        base.border = '1px solid transparent';
        base['border-bottom'] = `1px solid ${borderColor()}`;
        break;
      case 'underlined':
        base['background-color'] = 'transparent';
        base.border = '1px solid transparent';
        base['border-bottom'] = `1px solid ${borderColor()}`;
        base['border-radius'] = '0';
        break;
    }

    return base;
  };

  const inputStyle: Record<string, string> = {
    flex: '1',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    font: 'inherit',
    color: 'inherit',
    padding: '0',
    'min-width': '0',
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
          for={inputId}
          style={{
            'font-size': '0.8125rem',
            'font-weight': '500',
            color: 'var(--ui-color-text, #374151)',
          }}
        >
          {local.label}
        </label>
      </Show>
      <div style={wrapperStyle()}>
        <input
          {...rest}
          id={inputId}
          type={local.type}
          value={local.value ?? ''}
          placeholder={local.placeholder}
          disabled={local.disabled}
          readOnly={local.readonly}
          onInput={local.onInput}
          onChange={local.onChange}
          style={inputStyle}
        />
      </div>
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
