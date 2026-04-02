/**
 * @risklab/ui-solid — AccordionItem
 * SolidJS accordion item consuming AccordionContext. Show/hide panel.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import { useAccordionContext } from './Accordion';
import type { AccordionItemProps } from '../core/types';

export const AccordionItem: Component<AccordionItemProps> = (rawProps) => {
  const props = mergeProps({ disabled: false }, rawProps);
  const [local] = splitProps(props, [
    'value',
    'disabled',
    'title',
    'children',
    'class',
    'style',
  ]);

  const ctx = useAccordionContext();

  const isOpen = () => ctx.openItems().includes(local.value);

  const handleToggle = () => {
    if (!local.disabled) {
      ctx.toggle(local.value);
    }
  };

  return (
    <div
      class={local.class}
      style={{
        'border-bottom': '1px solid var(--ui-color-border, #e2e8f0)',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={local.disabled}
        aria-expanded={isOpen()}
        style={{
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'space-between',
          width: '100%',
          padding: '14px 18px',
          background: 'var(--ui-color-surface, #fff)',
          border: 'none',
          cursor: local.disabled ? 'not-allowed' : 'pointer',
          color: 'var(--ui-color-text, #0f172a)',
          'font-weight': '500',
          'font-size': 'var(--ui-text-sm, 14px)',
          'text-align': 'left',
          'font-family': 'inherit',
          opacity: local.disabled ? '0.5' : '1',
        }}
      >
        <span>{local.title}</span>
        <span
          style={{
            'flex-shrink': '0',
            transition: 'transform 200ms',
            transform: isOpen() ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▾
        </span>
      </button>
      <Show when={isOpen()}>
        <div
          style={{
            padding: '14px 18px',
            background: 'var(--ui-color-surface, #fff)',
            'font-size': 'var(--ui-text-sm, 14px)',
            color: 'var(--ui-color-text-secondary, #64748b)',
          }}
        >
          {local.children}
        </div>
      </Show>
    </div>
  );
};
