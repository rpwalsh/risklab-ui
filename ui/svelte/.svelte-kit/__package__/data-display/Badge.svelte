<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ColorVariant } from '../core/types.js';

  let {
    content = '' as string | number,
    variant = 'standard' as 'standard' | 'dot',
    color = 'error' as ColorVariant,
    max = 99,
    children,
  }: {
    content?: string | number;
    variant?: 'standard' | 'dot';
    color?: ColorVariant;
    max?: number;
    children?: Snippet;
  } = $props();

  let displayContent = $derived(
    typeof content === 'number' && content > max ? `${max}+` : `${content}`
  );
  let invisible = $derived(variant === 'standard' && (content === '' || content === 0));
</script>

<span class="ui-badge" data-color={color} data-anchor="top-right">
  {@render children?.()}
  {#if variant === 'dot'}
    <span class="ui-badge__indicator ui-badge__indicator--dot"></span>
  {:else if !invisible}
    <span class="ui-badge__indicator">{displayContent}</span>
  {/if}
</span>

<style>
  .ui-badge {
    position: relative;
    display: inline-flex;
    vertical-align: middle;
    flex-shrink: 0;
  }
  .ui-badge__indicator {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-family: var(--ui-font-family, inherit);
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    z-index: 1;
    border: 2px solid var(--ui-badge-outline, #fff);
    min-width: 1.25rem;
    height: 1.25rem;
    font-size: 0.75rem;
    padding: 0 0.375rem;
    border-radius: 0.625rem;
    top: 0;
    right: 0;
    transform: translateX(50%) translateY(-50%);
    background-color: var(--ui-badge-bg, var(--ui-color-error, #ef4444));
    color: #fff;
    transition: transform 200ms, opacity 200ms;
  }
  .ui-badge__indicator--dot {
    min-width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    padding: 0;
    font-size: 0;
  }

  /* Color */
  .ui-badge[data-color="primary"]   .ui-badge__indicator { background-color: var(--ui-color-primary); }
  .ui-badge[data-color="secondary"] .ui-badge__indicator { background-color: var(--ui-color-secondary); }
  .ui-badge[data-color="success"]   .ui-badge__indicator { background-color: var(--ui-color-success); }
  .ui-badge[data-color="warning"]   .ui-badge__indicator { background-color: var(--ui-color-warning); }
  .ui-badge[data-color="error"]     .ui-badge__indicator { background-color: var(--ui-color-error); }
  .ui-badge[data-color="info"]      .ui-badge__indicator { background-color: var(--ui-color-info); }
  .ui-badge[data-color="neutral"]   .ui-badge__indicator { background-color: var(--ui-color-neutral); }
</style>
