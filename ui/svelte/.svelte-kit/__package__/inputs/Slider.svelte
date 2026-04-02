<script lang="ts">
  import type { SizeVariant, ColorVariant } from '../core/types.js';

  let {
    value = $bindable(50),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    size = 'md' as SizeVariant,
    color = 'primary' as ColorVariant,
    oninput,
  }: {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    size?: SizeVariant;
    color?: ColorVariant;
    oninput?: (e: Event) => void;
  } = $props();

  let percent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="ui-slider" data-size={size} data-color={color}>
  <input
    type="range"
    class="ui-slider__input"
    class:ui-slider__input--disabled={disabled}
    bind:value
    {min}
    {max}
    {step}
    {disabled}
    {oninput}
    style="--ui-slider-fill: {percent}%"
  />
</div>

<style>
  .ui-slider {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: var(--ui-font-family, inherit);
    position: relative;
  }
  .ui-slider__input {
    width: 100%;
    height: var(--ui-slider-thumb, 16px);
    appearance: none;
    background: transparent;
    cursor: pointer;
    outline: none;
    margin: 0;
    padding: 0;
  }
  .ui-slider__input--disabled { opacity: 0.5; cursor: not-allowed; }

  /* Track — Webkit */
  .ui-slider__input::-webkit-slider-runnable-track {
    height: var(--ui-slider-track-h, 4px);
    border-radius: 9999px;
    background: linear-gradient(
      to right,
      var(--ui-slider-color, var(--ui-color-primary, #4f46e5)) 0%,
      var(--ui-slider-color, var(--ui-color-primary, #4f46e5)) var(--ui-slider-fill, 50%),
      #d1d5db var(--ui-slider-fill, 50%),
      #d1d5db 100%
    );
  }
  /* Track — Firefox */
  .ui-slider__input::-moz-range-track {
    height: var(--ui-slider-track-h, 4px);
    border-radius: 9999px;
    background: #d1d5db;
  }
  .ui-slider__input::-moz-range-progress {
    height: var(--ui-slider-track-h, 4px);
    border-radius: 9999px;
    background: var(--ui-slider-color, var(--ui-color-primary, #4f46e5));
  }
  /* Thumb — Webkit */
  .ui-slider__input::-webkit-slider-thumb {
    appearance: none;
    width: var(--ui-slider-thumb, 16px);
    height: var(--ui-slider-thumb, 16px);
    border-radius: 50%;
    background: var(--ui-slider-color, var(--ui-color-primary, #4f46e5));
    border: 2px solid #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    margin-top: calc((var(--ui-slider-track-h, 4px) - var(--ui-slider-thumb, 16px)) / 2);
    cursor: pointer;
  }
  /* Thumb — Firefox */
  .ui-slider__input::-moz-range-thumb {
    width: var(--ui-slider-thumb, 16px);
    height: var(--ui-slider-thumb, 16px);
    border-radius: 50%;
    background: var(--ui-slider-color, var(--ui-color-primary, #4f46e5));
    border: 2px solid #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    cursor: pointer;
  }

  .ui-slider__input:focus-visible::-webkit-slider-thumb {
    outline: 2px solid var(--ui-color-primary);
    outline-offset: 2px;
  }

  /* Size */
  .ui-slider[data-size="xs"] { --ui-slider-track-h: 2px; --ui-slider-thumb: 12px; }
  .ui-slider[data-size="sm"] { --ui-slider-track-h: 3px; --ui-slider-thumb: 14px; }
  .ui-slider[data-size="md"] { --ui-slider-track-h: 4px; --ui-slider-thumb: 16px; }
  .ui-slider[data-size="lg"] { --ui-slider-track-h: 6px; --ui-slider-thumb: 20px; }
  .ui-slider[data-size="xl"] { --ui-slider-track-h: 8px; --ui-slider-thumb: 24px; }

  /* Color */
  .ui-slider[data-color="primary"]   { --ui-slider-color: var(--ui-color-primary, #4f46e5); }
  .ui-slider[data-color="secondary"] { --ui-slider-color: var(--ui-color-secondary, #7c3aed); }
  .ui-slider[data-color="success"]   { --ui-slider-color: var(--ui-color-success, #16a34a); }
  .ui-slider[data-color="warning"]   { --ui-slider-color: var(--ui-color-warning, #d97706); }
  .ui-slider[data-color="error"]     { --ui-slider-color: var(--ui-color-error, #dc2626); }
  .ui-slider[data-color="info"]      { --ui-slider-color: var(--ui-color-info, #2563eb); }
  .ui-slider[data-color="neutral"]   { --ui-slider-color: var(--ui-color-neutral, #64748b); }
</style>
