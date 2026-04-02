/**
 * @risklab/ui-solid — Tab
 * SolidJS Tab button. Consumes TabsContext.
 */

import { mergeProps, splitProps, type Component } from 'solid-js';
import { useTabsContext } from './Tabs';
import type { TabProps } from '../core/types';

export const Tab: Component<TabProps> = (rawProps) => {
  const props = mergeProps({ disabled: false }, rawProps);
  const [local] = splitProps(props, ['value', 'disabled', 'children', 'class', 'style']);

  const ctx = useTabsContext();

  const isSelected = () => ctx.value() === local.value;

  const handleClick = () => {
    if (!local.disabled) {
      ctx.onChange(local.value);
    }
  };

  return (
    <button
      role="tab"
      aria-selected={isSelected()}
      disabled={local.disabled}
      class={local.class}
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        'align-items': 'center',
        gap: '0.5rem',
        'font-weight': '500',
        border: 'none',
        background: 'none',
        cursor: local.disabled ? 'not-allowed' : 'pointer',
        'white-space': 'nowrap',
        outline: 'none',
        transition: 'all var(--ui-transition-fast, 150ms)',
        color: isSelected()
          ? 'var(--ui-color-primary, #4f46e5)'
          : 'var(--ui-color-text-secondary, #64748b)',
        'border-bottom': isSelected()
          ? '2px solid var(--ui-color-primary, #4f46e5)'
          : '2px solid transparent',
        padding: '0.5rem 1rem',
        'font-size': 'var(--ui-text-sm, 0.875rem)',
        'font-family': 'inherit',
        opacity: local.disabled ? '0.5' : '1',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      {local.children}
    </button>
  );
};
