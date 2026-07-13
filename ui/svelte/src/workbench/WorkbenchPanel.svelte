<script lang="ts">
  import type { Snippet } from 'svelte';
  import { readable } from 'svelte/store';
  import { createInitialWorkbenchState } from './state.js';
  import { getWorkbenchContextOptional } from './state.js';

  let {
    panelId,
    title,
    subtitle,
    actions,
    footer,
    collapsible = false,
    defaultCollapsed = false,
    padding = 'md' as 'none' | 'sm' | 'md',
    tone = 'default' as 'default' | 'positive' | 'warning' | 'danger',
    children,
  }: {
    panelId?: string;
    title: string;
    subtitle?: string;
    actions?: Snippet;
    footer?: Snippet;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    padding?: 'none' | 'sm' | 'md';
    tone?: 'default' | 'positive' | 'warning' | 'danger';
    children?: Snippet;
  } = $props();

  const workbench = getWorkbenchContextOptional();
  const fallbackState = readable(createInitialWorkbenchState());
  const stateStore = workbench?.state ?? fallbackState;
  let workbenchState = $derived($stateStore);
  let localCollapsed = $state(false);

  $effect(() => {
    localCollapsed = defaultCollapsed;
  });

  let collapsed = $derived(
    Boolean((panelId ? workbenchState.panels[panelId]?.collapsed : undefined) ?? localCollapsed)
  );

  function toggleCollapsed() {
    if (panelId && workbench) {
      workbench.actions.patchPanelState(panelId, { collapsed: !collapsed });
      return;
    }

    localCollapsed = !collapsed;
  }
</script>

<section
  class="rlwb-panel"
  class:rlwb-panel--collapsed={collapsed}
  class:rlwb-panel--padding-none={padding === 'none'}
  class:rlwb-panel--padding-sm={padding === 'sm'}
  class:rlwb-panel--padding-md={padding === 'md'}
  class:rlwb-panel--tone-positive={tone === 'positive'}
  class:rlwb-panel--tone-warning={tone === 'warning'}
  class:rlwb-panel--tone-danger={tone === 'danger'}
>
  <header class="rlwb-panel__header">
    <div class="rlwb-panel__titles">
      <div class="rlwb-panel__title">{title}</div>
      {#if subtitle}
        <div class="rlwb-panel__subtitle">{subtitle}</div>
      {/if}
    </div>
    <div class="rlwb-panel__actions">
      {@render actions?.()}
      {#if collapsible}
        <button type="button" class="rlwb-icon-button" onclick={toggleCollapsed}>⌄</button>
      {/if}
    </div>
  </header>

  {#if !collapsed}
    <div class="rlwb-panel__body">
      {@render children?.()}
    </div>
  {/if}

  {#if footer}
    <footer class="rlwb-panel__footer">
      {@render footer()}
    </footer>
  {/if}
</section>
