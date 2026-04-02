/**
 * @risklab/ui-solid — Accordion
 * SolidJS accordion context provider. Supports multiple open panels.
 */

import {
  createContext,
  useContext,
  mergeProps,
  splitProps,
  type Component,
  type Accessor,
} from 'solid-js';
import type { AccordionProps } from '../core/types';

export interface AccordionContextValue {
  openItems: Accessor<string[]>;
  toggle: (value: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue>();

export const useAccordionContext = (): AccordionContextValue => {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be used inside <Accordion>');
  return ctx;
};

export const Accordion: Component<AccordionProps> = (rawProps) => {
  const props = mergeProps(
    { multiple: false, value: [] as string[] },
    rawProps,
  );

  const [local] = splitProps(props, [
    'multiple',
    'value',
    'onChange',
    'children',
    'class',
    'style',
  ]);

  const toggle = (val: string) => {
    const current = local.value ?? [];
    let next: string[];
    if (current.includes(val)) {
      next = current.filter((v) => v !== val);
    } else {
      next = local.multiple ? [...current, val] : [val];
    }
    local.onChange?.(next);
  };

  const ctx: AccordionContextValue = {
    openItems: () => local.value ?? [],
    toggle,
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        class={local.class}
        style={{
          display: 'flex',
          'flex-direction': 'column',
          'border-radius': 'var(--ui-radius-lg, 12px)',
          overflow: 'hidden',
          border: '1px solid var(--ui-color-border, #e2e8f0)',
          'font-family': 'var(--ui-font-family, inherit)',
          ...(local.style as Record<string, string> | undefined),
        }}
      >
        {local.children}
      </div>
    </AccordionContext.Provider>
  );
};
