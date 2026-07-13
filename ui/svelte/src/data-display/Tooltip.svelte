<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    content = '',
    placement = 'top' as 'top' | 'bottom' | 'left' | 'right',
    delay = 200,
    children,
  }: {
    content?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    children?: Snippet;
  } = $props();

  let visible = $state(false);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function show() {
    timeoutId = setTimeout(() => { visible = true; }, delay);
  }

  function hide() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
    visible = false;
  }

  $effect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  });
</script>

<span
  class="ui-tooltip-wrapper"
  role="presentation"
  onmouseenter={show}
  onmouseleave={hide}
  onfocusin={show}
  onfocusout={hide}
>
  {@render children?.()}
  {#if visible && content}
    <span
      class="ui-tooltip ui-tooltip--dark ui-tooltip--{placement}"
      role="tooltip"
    >
      {content}
    </span>
  {/if}
</span>

<style>
  .ui-tooltip-wrapper {
    position: relative;
    display: inline-flex;
  }
  .ui-tooltip {
    position: absolute;
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
    font-family: var(--ui-font-family, inherit);
    font-weight: 500;
    line-height: 1.4;
    border-radius: 0.375rem;
    white-space: nowrap;
    pointer-events: none;
    z-index: var(--ui-z-tooltip, 1500);
    box-sizing: border-box;
  }
  .ui-tooltip--dark {
    background-color: var(--ui-tooltip-bg, #1f2937);
    color: var(--ui-tooltip-color, #fff);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .ui-tooltip--top    { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
  .ui-tooltip--bottom { top: calc(100% + 8px); left: 50%; transform: translateX(-50%); }
  .ui-tooltip--left   { right: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
  .ui-tooltip--right  { left: calc(100% + 8px); top: 50%; transform: translateY(-50%); }
</style>
