/**
 * @risklab/ui-solid — TabPanel
 * SolidJS TabPanel. Shows content when tab value matches. Uses <Show>.
 */

import { splitProps, Show, type Component } from 'solid-js';
import { useTabsContext } from './Tabs';
import type { TabPanelProps } from '../core/types';

export const TabPanel: Component<TabPanelProps> = (rawProps) => {
  const [local] = splitProps(rawProps, ['value', 'children', 'class', 'style']);

  const ctx = useTabsContext();

  return (
    <Show when={ctx.value() === local.value}>
      <div
        role="tabpanel"
        class={local.class}
        style={{
          padding: 'var(--ui-space-4, 1rem)',
          ...(local.style as Record<string, string> | undefined),
        }}
      >
        {local.children}
      </div>
    </Show>
  );
};
