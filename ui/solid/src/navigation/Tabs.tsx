/**
 * @risklab/ui-solid — Tabs
 * SolidJS Tabs context provider. Manages selected value.
 */

import {
  createContext,
  useContext,
  mergeProps,
  splitProps,
  type Component,
  type JSX,
  type Accessor,
} from 'solid-js';
import type { TabsProps } from '../core/types';

export interface TabsContextValue {
  value: Accessor<string | undefined>;
  onChange: (val: string) => void;
}

export const TabsContext = createContext<TabsContextValue>();

export const useTabsContext = (): TabsContextValue => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab/TabPanel must be used inside <Tabs>');
  return ctx;
};

export const Tabs: Component<TabsProps> = (rawProps) => {
  const props = mergeProps({}, rawProps);
  const [local] = splitProps(props, ['value', 'onChange', 'children', 'class', 'style']);

  const ctx: TabsContextValue = {
    value: () => local.value,
    onChange: (val: string) => local.onChange?.(val),
  };

  return (
    <TabsContext.Provider value={ctx}>
      <div
        class={local.class}
        style={{
          display: 'flex',
          'flex-direction': 'column',
          'font-family': 'var(--ui-font-family, inherit)',
          ...(local.style as Record<string, string> | undefined),
        }}
      >
        {local.children}
      </div>
    </TabsContext.Provider>
  );
};
