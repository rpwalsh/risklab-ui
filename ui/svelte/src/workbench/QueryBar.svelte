<script lang="ts">
  import { getWorkbenchContext } from './state.js';

  let {
    label = 'Query',
    placeholder = 'Search, scope, or command',
  }: {
    label?: string;
    placeholder?: string;
  } = $props();

  const workbench = getWorkbenchContext();
  const stateStore = workbench.state;
  let state = $derived($stateStore);
</script>

<label class="rlwb-query-bar">
  <span class="rlwb-query-label">{label}</span>
  <input
    class="rlwb-query-input"
    type="search"
    value={state.query}
    {placeholder}
    oninput={(event) => workbench.actions.setQuery((event.currentTarget as HTMLInputElement).value)}
  />
</label>
