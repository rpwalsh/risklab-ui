<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'elevated' as 'elevated' | 'outlined' | 'filled',
    interactive = false,
    onclick,
    header,
    children,
    footer,
  }: {
    variant?: 'elevated' | 'outlined' | 'filled';
    interactive?: boolean;
    onclick?: (e: MouseEvent) => void;
    header?: Snippet;
    children?: Snippet;
    footer?: Snippet;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onclick?.(new MouseEvent('click'));
    }
  }
</script>

<div
  class="ui-card ui-card--{variant}"
  class:ui-card--interactive={interactive}
  role={interactive ? 'button' : undefined}
  tabindex={interactive ? 0 : undefined}
  {onclick}
  onkeydown={interactive ? handleKeydown : undefined}
>
  {#if header}
    <div class="ui-card-header">
      {@render header()}
    </div>
  {/if}
  {#if children}
    <div class="ui-card-content">
      {@render children()}
    </div>
  {/if}
  {#if footer}
    <div class="ui-card-actions">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .ui-card {
    display: flex;
    flex-direction: column;
    border-radius: var(--ui-card-radius, 0.75rem);
    overflow: hidden;
    font-family: var(--ui-font-family, inherit);
    color: var(--ui-card-color, inherit);
    transition: box-shadow 200ms, transform 100ms;
    box-sizing: border-box;
  }
  .ui-card--elevated {
    background-color: var(--ui-card-bg, #fff);
    box-shadow: var(--ui-shadow-sm, 0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06));
    border: none;
  }
  .ui-card--outlined {
    background-color: var(--ui-card-bg, #fff);
    box-shadow: none;
    border: 1px solid var(--ui-card-border-color, #e5e7eb);
  }
  .ui-card--filled {
    background-color: var(--ui-card-filled-bg, #f9fafb);
    box-shadow: none;
    border: none;
  }
  .ui-card--interactive { cursor: pointer; }
  .ui-card--interactive:hover { box-shadow: var(--ui-shadow-md); }

  .ui-card-header { padding: var(--ui-card-header-padding, 1rem 1rem 0); }
  .ui-card-content { padding: var(--ui-card-content-padding, 1rem); flex: 1; }
  .ui-card-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: var(--ui-card-actions-padding, 0.5rem 1rem 1rem);
    justify-content: flex-end;
  }
</style>
