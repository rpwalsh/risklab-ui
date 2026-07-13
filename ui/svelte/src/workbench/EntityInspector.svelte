<script lang="ts">
  import { readable } from 'svelte/store';
  import { createInitialWorkbenchState } from './state.js';
  import { getWorkbenchContextOptional } from './state.js';
  import type { WorkbenchSelection } from './state.js';

  let {
    title = 'Inspector',
    emptyState = 'Select a record, point, or entity to inspect it here.',
    renderContent,
  }: {
    title?: string;
    emptyState?: string;
    renderContent?: (selection: WorkbenchSelection | null) => string | null | undefined;
  } = $props();

  const workbench = getWorkbenchContextOptional();
  const fallbackState = readable(createInitialWorkbenchState());
  const stateStore = workbench?.state ?? fallbackState;
  let workbenchState = $derived($stateStore);
  let selection = $derived(workbenchState.selection ?? null);
  let renderedContent = $derived(renderContent?.(selection) ?? null);

  let entries = $derived.by(() => {
    if (!selection) {
      return [] as Array<[string, string]>;
    }

    const next = [
      ['Panel', selection.panelId ?? ''],
      ['Entity', selection.entityId ?? ''],
      ['Series', selection.seriesId ?? ''],
      ['Point', selection.pointId ?? ''],
      ['Label', selection.label ?? ''],
    ].filter(([, value]) => value.trim().length > 0) as Array<[string, string]>;

    for (const [key, value] of Object.entries(selection.meta ?? {})) {
      next.push([key, typeof value === 'object' ? JSON.stringify(value) : String(value)]);
    }

    return next;
  });
</script>

<section class="rlwb-inspector">
  <header class="rlwb-inspector__header">
    <div class="rlwb-panel__titles">
      <div class="rlwb-panel__title">{title}</div>
    </div>
  </header>
  <div class="rlwb-inspector__body">
    {#if renderedContent}
      <div>{@html renderedContent}</div>
    {:else if entries.length > 0}
      <dl class="rlwb-selection-list">
        {#each entries as [label, value] (label)}
          <dt>{label}</dt>
          <dd>{value}</dd>
        {/each}
      </dl>
    {:else}
      <div class="rlwb-empty-state">{emptyState}</div>
    {/if}
  </div>
</section>
