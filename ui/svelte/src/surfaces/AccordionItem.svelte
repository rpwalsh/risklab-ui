<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';

  let {
    value = '',
    disabled = false,
    header,
    children,
  }: {
    value?: string;
    disabled?: boolean;
    header?: Snippet;
    children?: Snippet;
  } = $props();

  const accordion = getContext<{
    value: string[];
    toggle: (v: string) => void;
    isExpanded: (v: string) => boolean;
  }>('ui-accordion');

  let expanded = $derived(accordion.isExpanded(value));

  function handleToggle() {
    if (!disabled) {
      accordion.toggle(value);
    }
  }
</script>

<div class="ui-accordion-item">
  <button
    class="ui-accordion-header"
    type="button"
    class:ui-accordion-header--disabled={disabled}
    {disabled}
    aria-expanded={expanded}
    onclick={handleToggle}
  >
    <span class="ui-accordion-header__title">
      {@render header?.()}
    </span>
    <span
      class="ui-accordion-header__icon"
      class:ui-accordion-header__icon--expanded={expanded}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </button>
  {#if expanded}
    <div class="ui-accordion-panel" role="region">
      {@render children?.()}
    </div>
  {/if}
</div>

<style>
  .ui-accordion-item {
    border-bottom: 1px solid var(--ui-color-border, #e2e8f0);
  }
  .ui-accordion-item:last-child { border-bottom: none; }

  .ui-accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 14px 18px;
    background: var(--ui-color-surface, #fff);
    border: none;
    cursor: pointer;
    color: var(--ui-color-text, #0f172a);
    font-weight: 500;
    font-size: var(--ui-text-sm, 0.875rem);
    text-align: left;
    font-family: var(--ui-font-family, inherit);
  }
  .ui-accordion-header--disabled { cursor: not-allowed; opacity: 0.5; }
  .ui-accordion-header:focus-visible {
    outline: 2px solid var(--ui-color-primary);
    outline-offset: -2px;
  }

  .ui-accordion-header__icon {
    flex-shrink: 0;
    transition: transform 200ms;
    display: inline-flex;
  }
  .ui-accordion-header__icon--expanded { transform: rotate(180deg); }

  .ui-accordion-panel {
    padding: 14px 18px;
    background: var(--ui-color-surface, #fff);
    font-size: var(--ui-text-sm, 0.875rem);
    color: var(--ui-color-text-secondary, #64748b);
  }
</style>
