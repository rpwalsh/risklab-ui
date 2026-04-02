<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    direction = 'column' as 'row' | 'column' | 'row-reverse' | 'column-reverse',
    gap = '1rem',
    align = 'stretch',
    justify = 'flex-start',
    wrap = false,
    children,
  }: {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    gap?: string;
    align?: string;
    justify?: string;
    wrap?: boolean;
    children?: Snippet;
  } = $props();
</script>

<div
  class="ui-stack"
  style:flex-direction={direction}
  style:gap={gap}
  style:align-items={align}
  style:justify-content={justify}
  style:flex-wrap={wrap ? 'wrap' : 'nowrap'}
>
  {@render children?.()}
</div>

<style>
  .ui-stack {
    display: flex;
    box-sizing: border-box;
    font-family: var(--ui-font-family, inherit);
  }
</style>
