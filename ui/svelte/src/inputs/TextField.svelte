<script lang="ts">
  import type { SizeVariant } from '../core/types.js';

  let {
    value = $bindable(''),
    variant = 'outlined' as 'outlined' | 'filled' | 'underlined',
    size = 'md' as SizeVariant,
    label = '',
    placeholder = '',
    disabled = false,
    readonly = false,
    error = false,
    helperText = '',
    type = 'text',
    oninput,
    onchange,
  }: {
    value?: string;
    variant?: 'outlined' | 'filled' | 'underlined';
    size?: SizeVariant;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    error?: boolean;
    helperText?: string;
    type?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
  } = $props();

  const inputId = `ui-tf-${Math.random().toString(36).slice(2, 9)}`;
</script>

<div
  class="ui-textfield"
  data-size={size}
  data-variant={variant}
  data-error={error || undefined}
>
  {#if label}
    <label class="ui-textfield__label" for={inputId}>{label}</label>
  {/if}
  <div class="ui-textfield__wrapper" class:ui-textfield__wrapper--disabled={disabled}>
    <input
      id={inputId}
      class="ui-textfield__input"
      {type}
      {placeholder}
      {disabled}
      {readonly}
      bind:value
      {oninput}
      {onchange}
      aria-invalid={error || undefined}
      aria-describedby={helperText ? `${inputId}-helper` : undefined}
    />
  </div>
  {#if helperText}
    <p
      id="{inputId}-helper"
      class="ui-textfield__helper"
      class:ui-textfield__helper--error={error}
      class:ui-textfield__helper--normal={!error}
    >
      {helperText}
    </p>
  {/if}
</div>

<style>
  .ui-textfield {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: var(--ui-font-family, inherit);
  }
  .ui-textfield__label {
    font-size: var(--ui-tf-label-size, 0.8125rem);
    font-weight: 500;
    color: var(--ui-tf-label-color, #374151);
  }
  .ui-textfield__wrapper {
    display: flex;
    align-items: center;
    gap: 0.5em;
    height: var(--ui-tf-height, 2.5rem);
    padding: var(--ui-tf-padding, 0 0.75rem);
    font-size: var(--ui-tf-font-size, 0.875rem);
    background-color: var(--ui-tf-bg, transparent);
    border: 1px solid var(--ui-tf-border, #d1d5db);
    border-radius: var(--ui-tf-radius, 0.375rem);
    transition: border-color 150ms;
    box-sizing: border-box;
  }
  .ui-textfield__wrapper:focus-within {
    border-color: var(--ui-tf-focus-border, var(--ui-color-primary, #3b82f6));
    box-shadow: 0 0 0 1px var(--ui-tf-focus-border, var(--ui-color-primary, #3b82f6));
  }
  .ui-textfield__wrapper--disabled { opacity: 0.5; pointer-events: none; }
  .ui-textfield__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font: inherit;
    color: inherit;
    padding: 0;
    min-width: 0;
  }
  .ui-textfield__helper {
    font-size: 0.75rem;
    margin: 0;
  }
  .ui-textfield__helper--error { color: var(--ui-color-error, #ef4444); }
  .ui-textfield__helper--normal { color: var(--ui-tf-helper-color, #6b7280); }

  /* Size variants */
  .ui-textfield[data-size="xs"] { --ui-tf-height: 1.5rem; --ui-tf-font-size: 0.75rem; --ui-tf-padding: 0 0.375rem; --ui-tf-radius: 0.25rem; --ui-tf-label-size: 0.6875rem; }
  .ui-textfield[data-size="sm"] { --ui-tf-height: 2rem; --ui-tf-font-size: 0.8125rem; --ui-tf-padding: 0 0.5rem; --ui-tf-radius: 0.3125rem; --ui-tf-label-size: 0.75rem; }
  .ui-textfield[data-size="md"] { --ui-tf-height: 2.5rem; --ui-tf-font-size: 0.875rem; --ui-tf-padding: 0 0.75rem; --ui-tf-radius: 0.375rem; --ui-tf-label-size: 0.8125rem; }
  .ui-textfield[data-size="lg"] { --ui-tf-height: 3rem; --ui-tf-font-size: 1rem; --ui-tf-padding: 0 1rem; --ui-tf-radius: 0.5rem; --ui-tf-label-size: 0.875rem; }
  .ui-textfield[data-size="xl"] { --ui-tf-height: 3.5rem; --ui-tf-font-size: 1.125rem; --ui-tf-padding: 0 1.25rem; --ui-tf-radius: 0.625rem; --ui-tf-label-size: 1rem; }

  /* Variant: outlined */
  .ui-textfield[data-variant="outlined"] { --ui-tf-bg: transparent; --ui-tf-border: #d1d5db; }
  /* Variant: filled */
  .ui-textfield[data-variant="filled"] { --ui-tf-bg: #f3f4f6; --ui-tf-border: transparent; }
  /* Variant: underlined */
  .ui-textfield[data-variant="underlined"] .ui-textfield__wrapper {
    border: none;
    border-bottom: 1px solid var(--ui-tf-border, #d1d5db);
    border-radius: 0;
    background: transparent;
  }
  .ui-textfield[data-variant="underlined"] .ui-textfield__wrapper:focus-within {
    border-bottom-color: var(--ui-tf-focus-border, var(--ui-color-primary, #3b82f6));
    box-shadow: none;
  }

  /* Error state */
  .ui-textfield[data-error] .ui-textfield__wrapper {
    border-color: var(--ui-color-error, #ef4444);
  }
  .ui-textfield[data-error] .ui-textfield__wrapper:focus-within {
    border-color: var(--ui-color-error, #ef4444);
    box-shadow: 0 0 0 1px var(--ui-color-error, #ef4444);
  }
</style>
