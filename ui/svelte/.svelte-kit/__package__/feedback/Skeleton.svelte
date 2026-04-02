<script lang="ts">
  let {
    variant = 'text' as 'text' | 'circular' | 'rectangular' | 'rounded',
    width = '' as string,
    height = '' as string,
    animation = 'pulse' as 'pulse' | 'wave' | 'none',
  }: {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string;
    height?: string;
    animation?: 'pulse' | 'wave' | 'none';
  } = $props();
</script>

<span
  class="ui-skeleton ui-skeleton--{variant}"
  class:ui-skeleton--pulse={animation === 'pulse'}
  class:ui-skeleton--wave={animation === 'wave'}
  style:width={width || undefined}
  style:height={height || undefined}
>
  {#if animation === 'wave'}
    <span class="ui-skeleton__inner"></span>
  {/if}
</span>

<style>
  .ui-skeleton {
    display: block;
    background-color: var(--ui-skeleton-bg, rgba(0, 0, 0, 0.11));
  }
  .ui-skeleton--text {
    height: 1.2em;
    border-radius: 4px;
    width: 100%;
    transform-origin: 0 55%;
    transform: scale(1, 0.6);
  }
  .ui-skeleton--circular {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .ui-skeleton--rectangular {
    width: 100%;
    height: 100px;
    border-radius: 0;
  }
  .ui-skeleton--rounded {
    width: 100%;
    height: 100px;
    border-radius: 8px;
  }
  .ui-skeleton--pulse {
    animation: ui-skeleton-pulse 2s ease-in-out 0.5s infinite;
  }
  .ui-skeleton--wave {
    overflow: hidden;
    position: relative;
  }
  .ui-skeleton__inner {
    position: absolute;
    inset: 0;
    animation: ui-skeleton-wave 2s linear 0.5s infinite;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  }

  @keyframes ui-skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes ui-skeleton-wave {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
</style>
