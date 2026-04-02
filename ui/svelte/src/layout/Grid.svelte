<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    columns = 12,
    gap = '1rem',
    rows,
    minChildWidth,
    children,
  }: {
    columns?: number | string;
    gap?: string;
    rows?: string;
    minChildWidth?: string;
    children?: Snippet;
  } = $props();

  let templateColumns = $derived(
    minChildWidth
      ? `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`
      : typeof columns === 'number'
        ? `repeat(${columns}, 1fr)`
        : columns
  );
</script>

<div
  class="ui-grid"
  style:grid-template-columns={templateColumns}
  style:gap={gap}
  style:grid-template-rows={rows || undefined}
>
  {@render children?.()}
</div>

<style>
  .ui-grid {
    display: grid;
    box-sizing: border-box;
    font-family: var(--ui-font-family, inherit);
  }
</style>
