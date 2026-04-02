<script lang="ts">
  import type { SizeVariant, ColorVariant } from '../core/types.js';

  let {
    checked = $bindable(false),
    disabled = false,
    size = 'md' as SizeVariant,
    color = 'primary' as ColorVariant,
    label = '',
    onchange,
  }: {
    checked?: boolean;
    disabled?: boolean;
    size?: SizeVariant;
    color?: ColorVariant;
    label?: string;
    onchange?: (e: Event) => void;
  } = $props();

  function handleClick() {
    if (!disabled) {
      checked = !checked;
      onchange?.(new Event('change'));
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  }
</script>

<label
  class="ui-switch"
  data-size={size}
  data-color={color}
  data-disabled={disabled || undefined}
>
  <span
    class="ui-switch__track"
    data-checked={checked || undefined}
    role="switch"
    aria-checked={checked}
    tabindex={disabled ? -1 : 0}
    onclick={handleClick}
    onkeydown={handleKeydown}
  >
    <input
      type="checkbox"
      class="ui-switch__input"
      bind:checked
      {disabled}
      {onchange}
      tabindex={-1}
      aria-hidden="true"
    />
    <span class="ui-switch__thumb" data-checked={checked || undefined}></span>
  </span>
  {#if label}
    <span class="ui-switch__label">{label}</span>
  {/if}
</label>

<style>
  .ui-switch {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    font-size: var(--ui-sw-font-size, 0.875rem);
    user-select: none;
    font-family: var(--ui-font-family, inherit);
  }
  .ui-switch[data-disabled] { opacity: 0.5; cursor: not-allowed; }

  .ui-switch__track {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: var(--ui-sw-track-w, 2.75rem);
    height: var(--ui-sw-track-h, 1.5rem);
    background-color: var(--ui-sw-bg, #d1d5db);
    border-radius: 9999px;
    transition: background-color 200ms;
    flex-shrink: 0;
    box-sizing: border-box;
    outline: none;
  }
  .ui-switch__track:focus-visible {
    outline: 2px solid var(--ui-color-primary);
    outline-offset: 2px;
  }
  .ui-switch__track[data-checked] {
    background-color: var(--ui-sw-active-bg, var(--ui-color-primary, #4f46e5));
  }

  .ui-switch__thumb {
    position: absolute;
    width: var(--ui-sw-thumb, 1.125rem);
    height: var(--ui-sw-thumb, 1.125rem);
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,.2);
    transition: transform 200ms;
    left: 2px;
    top: 50%;
    transform: translateY(-50%);
  }
  .ui-switch__thumb[data-checked] {
    transform: translateY(-50%) translateX(calc(var(--ui-sw-track-w, 2.75rem) - var(--ui-sw-thumb, 1.125rem) - 4px));
  }

  .ui-switch__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .ui-switch__label { line-height: 1.4; }

  /* Size */
  .ui-switch[data-size="xs"] { --ui-sw-track-w: 1.75rem; --ui-sw-track-h: 1rem; --ui-sw-thumb: 0.75rem; --ui-sw-font-size: 0.75rem; }
  .ui-switch[data-size="sm"] { --ui-sw-track-w: 2.25rem; --ui-sw-track-h: 1.25rem; --ui-sw-thumb: 0.9375rem; --ui-sw-font-size: 0.8125rem; }
  .ui-switch[data-size="md"] { --ui-sw-track-w: 2.75rem; --ui-sw-track-h: 1.5rem; --ui-sw-thumb: 1.125rem; --ui-sw-font-size: 0.875rem; }
  .ui-switch[data-size="lg"] { --ui-sw-track-w: 3.25rem; --ui-sw-track-h: 1.75rem; --ui-sw-thumb: 1.375rem; --ui-sw-font-size: 1rem; }
  .ui-switch[data-size="xl"] { --ui-sw-track-w: 3.75rem; --ui-sw-track-h: 2rem; --ui-sw-thumb: 1.625rem; --ui-sw-font-size: 1.125rem; }

  /* Color */
  .ui-switch[data-color="primary"]   { --ui-sw-active-bg: var(--ui-color-primary, #4f46e5); }
  .ui-switch[data-color="secondary"] { --ui-sw-active-bg: var(--ui-color-secondary, #7c3aed); }
  .ui-switch[data-color="success"]   { --ui-sw-active-bg: var(--ui-color-success, #16a34a); }
  .ui-switch[data-color="warning"]   { --ui-sw-active-bg: var(--ui-color-warning, #d97706); }
  .ui-switch[data-color="error"]     { --ui-sw-active-bg: var(--ui-color-error, #dc2626); }
  .ui-switch[data-color="info"]      { --ui-sw-active-bg: var(--ui-color-info, #2563eb); }
  .ui-switch[data-color="neutral"]   { --ui-sw-active-bg: var(--ui-color-neutral, #64748b); }
</style>
