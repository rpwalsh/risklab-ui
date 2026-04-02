<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';

  let {
    value = '',
    children,
  }: {
    value?: string;
    children?: Snippet;
  } = $props();

  const tabs = getContext<{ value: string }>('ui-tabs');

  let isActive = $derived(tabs.value === value);
</script>

{#if isActive}
  <div class="ui-tab-panel" role="tabpanel">
    {@render children?.()}
  </div>
{/if}

<style>
  .ui-tab-panel {
    padding: var(--ui-space-4, 1rem);
  }
</style>
