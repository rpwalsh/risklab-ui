<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'elevated' as 'elevated' | 'outlined' | 'filled',
    elevation = 1,
    children,
  }: {
    variant?: 'elevated' | 'outlined' | 'filled';
    elevation?: number;
    children?: Snippet;
  } = $props();

  let shadow = $derived(
    variant === 'elevated'
      ? elevation === 0
        ? 'none'
        : elevation <= 1
          ? 'var(--ui-shadow-sm)'
          : elevation <= 3
            ? 'var(--ui-shadow-md)'
            : elevation <= 6
              ? 'var(--ui-shadow-lg)'
              : 'var(--ui-shadow-xl)'
      : 'none'
  );
</script>

<div
  class="ui-paper ui-paper--{variant}"
  style:box-shadow={shadow}
>
  {@render children?.()}
</div>

<style>
  .ui-paper {
    font-family: var(--ui-font-family, inherit);
    color: var(--ui-color-text, inherit);
    border-radius: var(--ui-radius-lg, 0.75rem);
    box-sizing: border-box;
  }
  .ui-paper--elevated {
    background: var(--ui-color-surface, #fff);
  }
  .ui-paper--outlined {
    background: var(--ui-color-surface, #fff);
    border: 1px solid var(--ui-color-border, #e2e8f0);
  }
  .ui-paper--filled {
    background: var(--ui-color-surface-variant, #f8fafc);
  }
</style>
