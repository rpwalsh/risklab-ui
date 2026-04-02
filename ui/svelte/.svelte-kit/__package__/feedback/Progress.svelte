<script lang="ts">
  import type { SizeVariant, ColorVariant } from '../core/types.js';

  let {
    value = 0,
    variant = 'determinate' as 'determinate' | 'indeterminate',
    type = 'linear' as 'linear' | 'circular',
    size = 'md' as SizeVariant,
    color = 'primary' as ColorVariant,
  }: {
    value?: number;
    variant?: 'determinate' | 'indeterminate';
    type?: 'linear' | 'circular';
    size?: SizeVariant;
    color?: ColorVariant;
  } = $props();

  let clampedValue = $derived(Math.min(100, Math.max(0, value)));

  // Circular SVG calculations
  let circularSize = $derived(
    size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 56
  );
  let strokeWidth = $derived(size === 'xs' || size === 'sm' ? 3 : 4);
  let radius = $derived((circularSize - strokeWidth) / 2);
  let circumference = $derived(2 * Math.PI * radius);
  let dashOffset = $derived(
    variant === 'determinate' ? circumference - (clampedValue / 100) * circumference : 0
  );
</script>

{#if type === 'linear'}
  <div
    class="ui-linear-progress"
    data-size={size}
    role="progressbar"
    aria-valuenow={variant === 'determinate' ? clampedValue : undefined}
    aria-valuemin={0}
    aria-valuemax={100}
    style="--ui-progress-color: var(--ui-color-{color})"
  >
    {#if variant === 'determinate'}
      <div
        class="ui-linear-progress__bar ui-linear-progress__bar--determinate"
        style="width: {clampedValue}%; background-color: var(--ui-color-{color})"
      ></div>
    {:else}
      <div class="ui-linear-progress__bar ui-linear-progress__bar--indeterminate" style="background-color: var(--ui-color-{color})"></div>
    {/if}
  </div>
{:else}
  <svg
    class="ui-circular-progress"
    class:ui-circular-progress--indeterminate={variant === 'indeterminate'}
    width={circularSize}
    height={circularSize}
    viewBox="0 0 {circularSize} {circularSize}"
    role="progressbar"
    aria-valuenow={variant === 'determinate' ? clampedValue : undefined}
    style="color: var(--ui-color-{color})"
  >
    <circle
      cx={circularSize / 2}
      cy={circularSize / 2}
      r={radius}
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.15"
      stroke-width={strokeWidth}
    />
    <circle
      class="ui-circular-progress__circle"
      class:ui-circular-progress__circle--determinate={variant === 'determinate'}
      class:ui-circular-progress__circle--indeterminate={variant === 'indeterminate'}
      cx={circularSize / 2}
      cy={circularSize / 2}
      r={radius}
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={dashOffset}
      transform="rotate(-90 {circularSize / 2} {circularSize / 2})"
    />
  </svg>
{/if}

<style>
  .ui-linear-progress {
    position: relative;
    overflow: hidden;
    display: block;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    height: 4px;
  }
  .ui-linear-progress[data-size="sm"] { height: 2px; }
  .ui-linear-progress[data-size="md"] { height: 4px; }
  .ui-linear-progress[data-size="lg"] { height: 8px; }

  .ui-linear-progress__bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-radius: inherit;
  }
  .ui-linear-progress__bar--determinate {
    transition: width 0.4s linear;
  }
  .ui-linear-progress__bar--indeterminate {
    width: 50%;
    animation: ui-linear-indeterminate 1.5s ease-in-out infinite;
  }

  @keyframes ui-linear-indeterminate {
    0% { left: -50%; }
    100% { left: 100%; }
  }

  .ui-circular-progress { display: inline-block; }
  .ui-circular-progress--indeterminate { animation: ui-circular-rotate 1.4s linear infinite; }
  .ui-circular-progress__circle--determinate { transition: stroke-dashoffset 0.3s ease; }
  .ui-circular-progress__circle--indeterminate { animation: ui-circular-dash 1.4s ease-in-out infinite; }

  @keyframes ui-circular-rotate { 100% { transform: rotate(360deg); } }
  @keyframes ui-circular-dash {
    0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
    50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
    100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
  }
</style>
