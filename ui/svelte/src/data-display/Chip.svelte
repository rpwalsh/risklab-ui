<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { SizeVariant, ColorVariant } from '../core/types.js';

  let {
    variant = 'filled' as 'filled' | 'outlined',
    size = 'md' as SizeVariant,
    color = 'primary' as ColorVariant,
    deletable = false,
    disabled = false,
    ondelete,
    children,
  }: {
    variant?: 'filled' | 'outlined';
    size?: SizeVariant;
    color?: ColorVariant;
    deletable?: boolean;
    disabled?: boolean;
    ondelete?: () => void;
    children?: Snippet;
  } = $props();

  let variantClass = $derived(variant === 'outlined' ? 'ui-chip--outlined' : 'ui-chip--solid');
</script>

<span
  class="ui-chip {variantClass} ui-chip--{size}"
  class:ui-chip--disabled={disabled}
  data-color={color}
>
  <span class="ui-chip__label">
    {@render children?.()}
  </span>
  {#if deletable && !disabled}
    <button
      class="ui-chip__delete"
      type="button"
      aria-label="Remove"
      onclick={(e) => { e.stopPropagation(); ondelete?.(); }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  {/if}
</span>

<style>
  /* Uses global ui.css chip classes — scoped override for layout only */
  .ui-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375em;
    font-family: var(--ui-font-family, inherit);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    box-sizing: border-box;
    user-select: none;
    transition: background-color 150ms, color 150ms, border-color 150ms, opacity 150ms;
  }
  .ui-chip--disabled { opacity: 0.5; pointer-events: none; }

  /* Size */
  .ui-chip--xs { height: 1.25rem; padding: 0 0.375rem; font-size: 0.625rem; border-radius: 0.625rem; }
  .ui-chip--sm { height: 1.5rem; padding: 0 0.5rem; font-size: 0.75rem; border-radius: 0.75rem; }
  .ui-chip--md { height: 2rem; padding: 0 0.75rem; font-size: 0.8125rem; border-radius: 1rem; }
  .ui-chip--lg { height: 2.5rem; padding: 0 1rem; font-size: 0.875rem; border-radius: 1.25rem; }
  .ui-chip--xl { height: 3rem; padding: 0 1.25rem; font-size: 1rem; border-radius: 1.5rem; }

  /* Solid */
  .ui-chip--solid[data-color="primary"]   { background: var(--ui-color-primary); color: #fff; border: 1px solid transparent; }
  .ui-chip--solid[data-color="secondary"] { background: var(--ui-color-secondary); color: #fff; border: 1px solid transparent; }
  .ui-chip--solid[data-color="success"]   { background: var(--ui-color-success); color: #fff; border: 1px solid transparent; }
  .ui-chip--solid[data-color="warning"]   { background: var(--ui-color-warning); color: #fff; border: 1px solid transparent; }
  .ui-chip--solid[data-color="error"]     { background: var(--ui-color-error); color: #fff; border: 1px solid transparent; }
  .ui-chip--solid[data-color="info"]      { background: var(--ui-color-info); color: #fff; border: 1px solid transparent; }
  .ui-chip--solid[data-color="neutral"]   { background: var(--ui-color-neutral); color: #fff; border: 1px solid transparent; }

  /* Outlined */
  .ui-chip--outlined[data-color="primary"]   { background: transparent; color: var(--ui-color-primary); border: 1px solid var(--ui-color-primary); }
  .ui-chip--outlined[data-color="secondary"] { background: transparent; color: var(--ui-color-secondary); border: 1px solid var(--ui-color-secondary); }
  .ui-chip--outlined[data-color="success"]   { background: transparent; color: var(--ui-color-success); border: 1px solid var(--ui-color-success); }
  .ui-chip--outlined[data-color="warning"]   { background: transparent; color: var(--ui-color-warning); border: 1px solid var(--ui-color-warning); }
  .ui-chip--outlined[data-color="error"]     { background: transparent; color: var(--ui-color-error); border: 1px solid var(--ui-color-error); }
  .ui-chip--outlined[data-color="info"]      { background: transparent; color: var(--ui-color-info); border: 1px solid var(--ui-color-info); }
  .ui-chip--outlined[data-color="neutral"]   { background: transparent; color: var(--ui-color-neutral); border: 1px solid var(--ui-color-neutral); }

  .ui-chip__label { overflow: hidden; text-overflow: ellipsis; }
  .ui-chip__delete {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0 -0.25em 0 0;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    opacity: 0.7;
    line-height: 1;
    border-radius: 50%;
    outline: none;
    transition: opacity 150ms;
  }
  .ui-chip__delete:hover { opacity: 1; }
</style>
