<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(false),
    anchor = 'left' as 'left' | 'right' | 'top' | 'bottom',
    size = '280px',
    overlay = true,
    children,
  }: {
    open?: boolean;
    anchor?: 'left' | 'right' | 'top' | 'bottom';
    size?: string;
    overlay?: boolean;
    children?: Snippet;
  } = $props();

  let sizeVar = $derived(
    anchor === 'left' || anchor === 'right' ? `--ui-drawer-w: ${size}` : `--ui-drawer-h: ${size}`
  );

  function handleBackdrop() {
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open = false;
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="ui-drawer-container"
  data-open={open || undefined}
  onkeydown={handleKeydown}
>
  {#if overlay}
    <div class="ui-drawer-backdrop" onclick={handleBackdrop}></div>
  {/if}
  <aside
    class="ui-drawer ui-drawer--{anchor}"
    data-open={open || undefined}
    style={sizeVar}
    role="dialog"
    aria-hidden={!open}
    inert={!open || undefined}
  >
    {@render children?.()}
  </aside>
</div>

<style>
  .ui-drawer-container {
    position: fixed;
    inset: 0;
    z-index: var(--ui-z-drawer, 1200);
    pointer-events: none;
  }
  .ui-drawer-container[data-open] { pointer-events: auto; }
  .ui-drawer-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity var(--ui-transition-base, 250ms);
  }
  .ui-drawer-container[data-open] .ui-drawer-backdrop { opacity: 1; }

  .ui-drawer {
    position: fixed;
    background: var(--ui-color-surface, #fff);
    box-shadow: var(--ui-shadow-xl);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    transition: transform var(--ui-transition-base, 250ms);
    z-index: 1;
  }
  .ui-drawer--left   { top: 0; left: 0; bottom: 0; width: var(--ui-drawer-w, 280px); transform: translateX(-100%); }
  .ui-drawer--right  { top: 0; right: 0; bottom: 0; width: var(--ui-drawer-w, 280px); transform: translateX(100%); }
  .ui-drawer--top    { top: 0; left: 0; right: 0; height: var(--ui-drawer-h, 320px); transform: translateY(-100%); }
  .ui-drawer--bottom { bottom: 0; left: 0; right: 0; height: var(--ui-drawer-h, 320px); transform: translateY(100%); }
  .ui-drawer--left[data-open],
  .ui-drawer--right[data-open]  { transform: translateX(0); }
  .ui-drawer--top[data-open],
  .ui-drawer--bottom[data-open] { transform: translateY(0); }
</style>
