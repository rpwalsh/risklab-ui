<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { WorkbenchState } from './state.js';
  import {
    createWorkbenchContextValue,
    setWorkbenchContext,
  } from './state.js';

  let {
    initialState,
    children,
  }: {
    initialState?: Partial<WorkbenchState>;
    children?: Snippet;
  } = $props();

  const workbench = setWorkbenchContext(createWorkbenchContextValue());

  $effect(() => {
    workbench.actions.reset(initialState);
  });
</script>

{@render children?.()}
