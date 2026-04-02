<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { SizeVariant } from '../core/types.js';

  let {
    open = $bindable(false),
    modal = true,
    size = 'md' as SizeVariant,
    children,
  }: {
    open?: boolean;
    modal?: boolean;
    size?: SizeVariant;
    children?: Snippet;
  } = $props();

  function handleBackdrop() {
    if (modal) {
      open = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeydown);
      return () => window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

{#if open}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="ui-dialog-overlay"
    role="dialog"
    aria-modal={modal}
  >
    <div class="ui-dialog-backdrop" onclick={handleBackdrop}></div>
    <div class="ui-dialog ui-dialog--{size}">
      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  .ui-dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: var(--ui-z-modal, 1300);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  .ui-dialog-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .ui-dialog {
    position: relative;
    background: var(--ui-color-surface, #fff);
    border-radius: var(--ui-radius-lg, 0.75rem);
    box-shadow: var(--ui-shadow-xl);
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }
  .ui-dialog--xs { width: 320px; }
  .ui-dialog--sm { width: 440px; }
  .ui-dialog--md { width: 560px; }
  .ui-dialog--lg { width: 720px; }
  .ui-dialog--xl { width: 900px; }
</style>
