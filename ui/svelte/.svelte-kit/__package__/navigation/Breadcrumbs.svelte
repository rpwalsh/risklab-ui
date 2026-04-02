<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    separator = '/',
    children,
  }: {
    separator?: string;
    children?: Snippet;
  } = $props();
</script>

<nav class="ui-breadcrumbs" aria-label="Breadcrumb" style="--ui-breadcrumb-separator: '{separator}';">
  <ol class="ui-breadcrumbs__list">
    {@render children?.()}
  </ol>
</nav>

<style>
  .ui-breadcrumbs {
    display: flex;
    align-items: center;
    font-size: var(--ui-text-sm, 0.875rem);
    color: var(--ui-color-text-secondary, #64748b);
    font-family: var(--ui-font-family, inherit);
  }
  .ui-breadcrumbs__list {
    display: flex;
    align-items: center;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
  }

  /* Separator between items via CSS — also supported via slot */
  .ui-breadcrumbs__list > :global(li + li)::before {
    content: var(--ui-breadcrumb-separator, '/');
    margin-inline: var(--ui-space-2, 0.5rem);
    color: var(--ui-color-text-secondary, #64748b);
    user-select: none;
  }
</style>
