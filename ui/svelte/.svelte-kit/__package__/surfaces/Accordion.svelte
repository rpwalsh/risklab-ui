<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';

  let {
    multiple = false,
    value = $bindable([] as string[]),
    children,
  }: {
    multiple?: boolean;
    value?: string[];
    children?: Snippet;
  } = $props();

  const accordionContext = {
    get value() { return value; },
    toggle(v: string) {
      if (value.includes(v)) {
        value = value.filter((i) => i !== v);
      } else if (multiple) {
        value = [...value, v];
      } else {
        value = [v];
      }
    },
    isExpanded(v: string) {
      return value.includes(v);
    },
  };

  setContext('ui-accordion', accordionContext);
</script>

<div class="ui-accordion">
  {@render children?.()}
</div>

<style>
  .ui-accordion {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--ui-color-border, #e2e8f0);
    border-radius: var(--ui-radius-lg, 0.75rem);
  }
</style>
