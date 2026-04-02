<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';

  let {
    value = $bindable(''),
    children,
  }: {
    value?: string;
    children?: Snippet;
  } = $props();

  const tabsContext = {
    get value() { return value; },
    select(v: string) { value = v; },
  };

  setContext('ui-tabs', tabsContext);
</script>

<div class="ui-tabs ui-tabs--horizontal" role="tablist">
  {@render children?.()}
</div>

<style>
  .ui-tabs {
    display: flex;
    flex-direction: column;
  }
</style>
