<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';

  let {
    value = '',
    disabled = false,
    children,
  }: {
    value?: string;
    disabled?: boolean;
    children?: Snippet;
  } = $props();

  const tabs = getContext<{ value: string; select: (v: string) => void }>('ui-tabs');

  let isSelected = $derived(tabs.value === value);

  function handleClick() {
    if (!disabled) {
      tabs.select(value);
    }
  }
</script>

<button
  class="ui-tab ui-tab--md"
  type="button"
  role="tab"
  aria-selected={isSelected}
  {disabled}
  tabindex={isSelected ? 0 : -1}
  onclick={handleClick}
>
  {@render children?.()}
</button>

<style>
  .ui-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    border: none;
    background: none;
    cursor: pointer;
    white-space: nowrap;
    outline: none;
    transition: all 150ms;
    color: var(--ui-color-text-secondary, #64748b);
    padding: 0.5rem 1rem;
    font-size: var(--ui-text-sm, 0.875rem);
    border-bottom: 2px solid transparent;
    font-family: var(--ui-font-family, inherit);
  }
  .ui-tab[aria-selected="true"] {
    color: var(--ui-color-primary, #4f46e5);
    border-bottom-color: var(--ui-color-primary, #4f46e5);
  }
  .ui-tab:disabled { opacity: 0.5; cursor: not-allowed; }
  .ui-tab:hover:not(:disabled):not([aria-selected="true"]) {
    color: var(--ui-color-text, #0f172a);
  }
  .ui-tab:focus-visible {
    outline: 2px solid var(--ui-color-primary);
    outline-offset: -2px;
  }
</style>
