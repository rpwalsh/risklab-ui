<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { SizeVariant, ColorVariant } from '../core/types.js';

  let {
    variant = 'filled',
    size = 'md' as SizeVariant,
    color = 'primary' as ColorVariant,
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button' as 'button' | 'submit' | 'reset',
    onclick,
    children,
  }: {
    variant?: 'filled' | 'outlined' | 'ghost' | 'link';
    size?: SizeVariant;
    color?: ColorVariant;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  } = $props();

  let cls = $derived(
    [
      'ui-btn',
      `ui-btn--${variant}`,
      `ui-btn--${size}`,
      `ui-btn--${color}`,
      fullWidth && 'ui-btn--full-width',
      loading && 'ui-btn--loading',
      disabled && 'ui-btn--disabled',
    ]
      .filter(Boolean)
      .join(' ')
  );
</script>

<button
  class={cls}
  {type}
  disabled={disabled || loading}
  aria-busy={loading}
  {onclick}
>
  {#if loading}
    <svg class="ui-btn__spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="28" stroke-dashoffset="8" />
    </svg>
  {/if}
  <span class="ui-btn__content" class:ui-btn__content--hidden={loading}>
    {@render children?.()}
  </span>
</button>

<style>
  .ui-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    font-family: var(--ui-font-family, inherit);
    font-weight: var(--ui-weight-medium, 500);
    line-height: 1;
    border: none;
    cursor: pointer;
    outline: none;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color var(--ui-transition-fast, 150ms),
      color var(--ui-transition-fast, 150ms),
      border-color var(--ui-transition-fast, 150ms),
      box-shadow var(--ui-transition-fast, 150ms),
      opacity var(--ui-transition-fast, 150ms);
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    user-select: none;
  }

  /* Sizes */
  .ui-btn--xs { height: 1.5rem; padding: 0 0.5rem; font-size: var(--ui-text-xs, 0.75rem); border-radius: var(--ui-radius-sm, 0.25rem); }
  .ui-btn--sm { height: 2rem; padding: 0 0.75rem; font-size: var(--ui-text-sm, 0.875rem); border-radius: var(--ui-radius-sm, 0.25rem); }
  .ui-btn--md { height: 2.5rem; padding: 0 1rem; font-size: var(--ui-text-sm, 0.875rem); border-radius: var(--ui-radius-md, 0.5rem); }
  .ui-btn--lg { height: 3rem; padding: 0 1.5rem; font-size: var(--ui-text-base, 1rem); border-radius: var(--ui-radius-md, 0.5rem); }
  .ui-btn--xl { height: 3.5rem; padding: 0 2rem; font-size: var(--ui-text-lg, 1.125rem); border-radius: var(--ui-radius-lg, 0.75rem); }

  /* Filled */
  .ui-btn--filled.ui-btn--primary   { background: var(--ui-color-primary); color: #fff; }
  .ui-btn--filled.ui-btn--secondary { background: var(--ui-color-secondary); color: #fff; }
  .ui-btn--filled.ui-btn--success   { background: var(--ui-color-success); color: #fff; }
  .ui-btn--filled.ui-btn--warning   { background: var(--ui-color-warning); color: #fff; }
  .ui-btn--filled.ui-btn--error     { background: var(--ui-color-error); color: #fff; }
  .ui-btn--filled.ui-btn--info      { background: var(--ui-color-info); color: #fff; }
  .ui-btn--filled.ui-btn--neutral   { background: var(--ui-color-neutral); color: #fff; }
  .ui-btn--filled:hover:not(:disabled) { filter: brightness(0.92); }

  /* Outlined */
  .ui-btn--outlined { background: transparent; border: 1px solid currentColor; }
  .ui-btn--outlined.ui-btn--primary   { color: var(--ui-color-primary); }
  .ui-btn--outlined.ui-btn--secondary { color: var(--ui-color-secondary); }
  .ui-btn--outlined.ui-btn--success   { color: var(--ui-color-success); }
  .ui-btn--outlined.ui-btn--warning   { color: var(--ui-color-warning); }
  .ui-btn--outlined.ui-btn--error     { color: var(--ui-color-error); }
  .ui-btn--outlined.ui-btn--info      { color: var(--ui-color-info); }
  .ui-btn--outlined.ui-btn--neutral   { color: var(--ui-color-neutral); }
  .ui-btn--outlined:hover:not(:disabled) { background: rgba(0, 0, 0, 0.04); }

  /* Ghost */
  .ui-btn--ghost { background: transparent; border: none; }
  .ui-btn--ghost.ui-btn--primary   { color: var(--ui-color-primary); }
  .ui-btn--ghost.ui-btn--secondary { color: var(--ui-color-secondary); }
  .ui-btn--ghost.ui-btn--success   { color: var(--ui-color-success); }
  .ui-btn--ghost.ui-btn--warning   { color: var(--ui-color-warning); }
  .ui-btn--ghost.ui-btn--error     { color: var(--ui-color-error); }
  .ui-btn--ghost.ui-btn--info      { color: var(--ui-color-info); }
  .ui-btn--ghost.ui-btn--neutral   { color: var(--ui-color-neutral); }
  .ui-btn--ghost:hover:not(:disabled) { background: rgba(0, 0, 0, 0.06); }

  /* Link */
  .ui-btn--link { background: transparent; border: none; text-decoration: underline; padding: 0; height: auto; }
  .ui-btn--link.ui-btn--primary { color: var(--ui-color-primary); }

  /* Full width */
  .ui-btn--full-width { width: 100%; }

  /* Disabled */
  .ui-btn--disabled,
  .ui-btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

  /* Loading */
  .ui-btn--loading { cursor: wait; }
  .ui-btn__content--hidden { visibility: hidden; }

  .ui-btn__spinner {
    animation: ui-btn-spin 0.75s linear infinite;
    flex-shrink: 0;
  }

  .ui-btn__content {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
  }

  @keyframes ui-btn-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .ui-btn:focus-visible {
    outline: 2px solid var(--ui-color-primary);
    outline-offset: 2px;
  }
</style>
