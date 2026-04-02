<script lang="ts">
  import type { SizeVariant, ColorVariant } from '../core/types.js';

  let {
    checked = $bindable(false),
    indeterminate = false,
    disabled = false,
    size = 'md' as SizeVariant,
    color = 'primary' as ColorVariant,
    label = '',
    onchange,
  }: {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    size?: SizeVariant;
    color?: ColorVariant;
    label?: string;
    onchange?: (e: Event) => void;
  } = $props();

  let inputRef: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (inputRef) {
      inputRef.indeterminate = indeterminate;
    }
  });
</script>

<label
  class="ui-checkbox"
  data-size={size}
  data-color={color}
  class:ui-checkbox--disabled={disabled}
>
  <input
    bind:this={inputRef}
    type="checkbox"
    class="ui-checkbox__input"
    bind:checked
    {disabled}
    {onchange}
  />
  <span class="ui-checkbox__box">
    {#if checked && !indeterminate}
      <svg class="ui-checkbox__icon" viewBox="0 0 16 16" fill="none">
        <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    {:else if indeterminate}
      <svg class="ui-checkbox__icon" viewBox="0 0 16 16" fill="none">
        <path d="M4 8H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    {/if}
  </span>
  {#if label}
    <span class="ui-checkbox__label">{label}</span>
  {/if}
</label>

<style>
  .ui-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    user-select: none;
    font-family: var(--ui-font-family, inherit);
    font-size: var(--ui-cb-font-size, 0.875rem);
  }
  .ui-checkbox--disabled { opacity: 0.5; cursor: not-allowed; }

  .ui-checkbox__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .ui-checkbox__box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ui-cb-size, 1.25rem);
    height: var(--ui-cb-size, 1.25rem);
    border: 2px solid var(--ui-cb-border, #d1d5db);
    border-radius: var(--ui-radius-sm, 0.25rem);
    background: transparent;
    transition: background-color 150ms, border-color 150ms;
    flex-shrink: 0;
  }

  .ui-checkbox__input:checked + .ui-checkbox__box,
  .ui-checkbox__input:indeterminate + .ui-checkbox__box {
    background-color: var(--ui-cb-active, var(--ui-color-primary, #4f46e5));
    border-color: var(--ui-cb-active, var(--ui-color-primary, #4f46e5));
    color: #fff;
  }

  .ui-checkbox__input:focus-visible + .ui-checkbox__box {
    outline: 2px solid var(--ui-color-primary);
    outline-offset: 2px;
  }

  .ui-checkbox__icon {
    width: 0.75em;
    height: 0.75em;
  }

  .ui-checkbox__label {
    line-height: 1.4;
  }

  /* Size */
  .ui-checkbox[data-size="xs"] { --ui-cb-size: 0.875rem; --ui-cb-font-size: 0.75rem; }
  .ui-checkbox[data-size="sm"] { --ui-cb-size: 1rem; --ui-cb-font-size: 0.8125rem; }
  .ui-checkbox[data-size="md"] { --ui-cb-size: 1.25rem; --ui-cb-font-size: 0.875rem; }
  .ui-checkbox[data-size="lg"] { --ui-cb-size: 1.5rem; --ui-cb-font-size: 1rem; }
  .ui-checkbox[data-size="xl"] { --ui-cb-size: 1.75rem; --ui-cb-font-size: 1.125rem; }

  /* Color */
  .ui-checkbox[data-color="primary"]   { --ui-cb-active: var(--ui-color-primary, #4f46e5); }
  .ui-checkbox[data-color="secondary"] { --ui-cb-active: var(--ui-color-secondary, #7c3aed); }
  .ui-checkbox[data-color="success"]   { --ui-cb-active: var(--ui-color-success, #16a34a); }
  .ui-checkbox[data-color="warning"]   { --ui-cb-active: var(--ui-color-warning, #d97706); }
  .ui-checkbox[data-color="error"]     { --ui-cb-active: var(--ui-color-error, #dc2626); }
  .ui-checkbox[data-color="info"]      { --ui-cb-active: var(--ui-color-info, #2563eb); }
  .ui-checkbox[data-color="neutral"]   { --ui-cb-active: var(--ui-color-neutral, #64748b); }
</style>
