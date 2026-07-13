<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    columns,
    rows,
    minColumnWidth,
    dense = false,
    children,
  }: {
    columns?: string;
    rows?: string;
    minColumnWidth?: number;
    dense?: boolean;
    children?: Snippet;
  } = $props();

  let templateColumns = $derived(
    minColumnWidth
      ? `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`
      : columns ?? 'repeat(auto-fit, minmax(320px, 1fr))'
  );
</script>

<div
  class="rlwb-panel-layout"
  class:rlwb-panel-layout--dense={dense}
  style:grid-template-columns={templateColumns}
  style:grid-template-rows={rows || undefined}
>
  {@render children?.()}
</div>
