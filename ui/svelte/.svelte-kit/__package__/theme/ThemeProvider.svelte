<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { ThemeMode } from '../core/types.js';

  let {
    mode = 'system' as ThemeMode,
    children,
  }: {
    mode?: ThemeMode;
    children?: Snippet;
  } = $props();

  let resolvedMode = $state<'light' | 'dark'>('light');

  $effect(() => {
    if (mode === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      resolvedMode = mql.matches ? 'dark' : 'light';
      const handler = (e: MediaQueryListEvent) => {
        resolvedMode = e.matches ? 'dark' : 'light';
      };
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else {
      resolvedMode = mode;
    }
  });

  let isDark = $derived(resolvedMode === 'dark');

  const themeContext = {
    get mode() { return resolvedMode; },
    get isDark() { return isDark; },
  };

  setContext('ui-theme', themeContext);
</script>

<div class="ui-root" class:ui-dark={isDark} data-ui-theme={resolvedMode}>
  {@render children?.()}
</div>

<style>
  div {
    display: contents;
  }
</style>
