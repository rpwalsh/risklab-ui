<script lang="ts">
  import type { SizeVariant, SelectOptionData } from '../core/types.js';

  let {
    value = $bindable(''),
    options = [] as SelectOptionData[],
    size = 'md' as SizeVariant,
    label = '',
    placeholder = '',
    disabled = false,
    error = false,
    helperText = '',
    onchange,
  }: {
    value?: string;
    options?: SelectOptionData[];
    size?: SizeVariant;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    onchange?: (e: Event) => void;
  } = $props();

  const selectId = `ui-sel-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div
  class="ui-select"
  data-size={size}
  data-variant="outlined"
  data-error={error || undefined}
>
  {#if label}
    <label class="ui-select__label" for={selectId}>{label}</label>
  {/if}
  <select
    id={selectId}
    class="ui-select__native"
    bind:value
    {disabled}
    {onchange}
    aria-invalid={error || undefined}
    aria-describedby={helperText ? `${selectId}-helper` : undefined}
  >
    {#if placeholder}
      <option value="" disabled selected hidden>{placeholder}</option>
    {/if}
    {#each options as opt}
      <option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
    {/each}
  </select>
  {#if helperText}
    <p
      id="{selectId}-helper"
      class="ui-select__helper"
      class:ui-select__helper--error={error}
      class:ui-select__helper--normal={!error}
    >
      {helperText}
    </p>
  {/if}
</div>

<style>
  .ui-select {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: var(--ui-font-family, inherit);
  }
  .ui-select__label {
    font-size: var(--ui-sel-label-size, 0.8125rem);
    font-weight: 500;
    color: var(--ui-sel-label-color, #374151);
  }
  .ui-select__native {
    height: var(--ui-sel-height, 2.5rem);
    padding: var(--ui-sel-padding, 0 2rem 0 0.75rem);
    font-size: var(--ui-sel-font-size, 0.875rem);
    font-family: inherit;
    background-color: var(--ui-sel-bg, transparent);
    border: 1px solid var(--ui-sel-border, #d1d5db);
    border-radius: var(--ui-sel-radius, 0.375rem);
    color: inherit;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    transition: border-color 150ms;
    box-sizing: border-box;
    width: 100%;
  }
  .ui-select__native:focus {
    border-color: var(--ui-sel-focus-border, var(--ui-color-primary, #3b82f6));
    box-shadow: 0 0 0 1px var(--ui-sel-focus-border, var(--ui-color-primary, #3b82f6));
  }
  .ui-select__native:disabled { opacity: 0.5; cursor: not-allowed; }
  .ui-select__helper { font-size: 0.75rem; margin: 0; }
  .ui-select__helper--error { color: var(--ui-color-error, #ef4444); }
  .ui-select__helper--normal { color: var(--ui-sel-helper-color, #6b7280); }

  /* Size variants */
  .ui-select[data-size="xs"] { --ui-sel-height: 1.5rem; --ui-sel-font-size: 0.75rem; --ui-sel-padding: 0 1.5rem 0 0.375rem; --ui-sel-radius: 0.25rem; --ui-sel-label-size: 0.6875rem; }
  .ui-select[data-size="sm"] { --ui-sel-height: 2rem; --ui-sel-font-size: 0.8125rem; --ui-sel-padding: 0 1.75rem 0 0.5rem; --ui-sel-radius: 0.3125rem; --ui-sel-label-size: 0.75rem; }
  .ui-select[data-size="md"] { --ui-sel-height: 2.5rem; --ui-sel-font-size: 0.875rem; --ui-sel-padding: 0 2rem 0 0.75rem; --ui-sel-radius: 0.375rem; --ui-sel-label-size: 0.8125rem; }
  .ui-select[data-size="lg"] { --ui-sel-height: 3rem; --ui-sel-font-size: 1rem; --ui-sel-padding: 0 2.25rem 0 1rem; --ui-sel-radius: 0.5rem; --ui-sel-label-size: 0.875rem; }
  .ui-select[data-size="xl"] { --ui-sel-height: 3.5rem; --ui-sel-font-size: 1.125rem; --ui-sel-padding: 0 2.5rem 0 1.25rem; --ui-sel-radius: 0.625rem; --ui-sel-label-size: 1rem; }

  /* Error */
  .ui-select[data-error] .ui-select__native {
    border-color: var(--ui-color-error, #ef4444);
  }
  .ui-select[data-error] .ui-select__native:focus {
    border-color: var(--ui-color-error, #ef4444);
    box-shadow: 0 0 0 1px var(--ui-color-error, #ef4444);
  }
</style>
