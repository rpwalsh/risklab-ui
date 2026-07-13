<script lang="ts">
  import { getWorkbenchContext } from './state.js';
  import type { WorkbenchFilterValue } from './state.js';

  export interface FilterOption {
    label: string;
    value: WorkbenchFilterValue;
  }

  export interface FilterDefinition {
    key: string;
    label: string;
    options: FilterOption[];
    multi?: boolean;
    scope?: 'global' | 'panel';
    panelId?: string;
  }

  let {
    filters,
  }: {
    filters: FilterDefinition[];
  } = $props();

  const workbench = getWorkbenchContext();
  const stateStore = workbench.state;
  let state = $derived($stateStore);

  function filterValueIncludes(
    current: WorkbenchFilterValue | undefined,
    expected: WorkbenchFilterValue,
  ): boolean {
    if (Array.isArray(current) && !Array.isArray(expected)) {
      return current.includes(expected);
    }

    if (Array.isArray(current) && Array.isArray(expected)) {
      return current.length === expected.length && current.every((value, index) => value === expected[index]);
    }

    return current === expected;
  }

  function toggleFilterValue(
    current: WorkbenchFilterValue | undefined,
    next: WorkbenchFilterValue,
    multi: boolean,
  ): WorkbenchFilterValue | undefined {
    if (!multi) {
      return filterValueIncludes(current, next) ? undefined : next;
    }

    const nextValue = Array.isArray(next) ? next[0] : next;
    const currentValues = Array.isArray(current)
      ? [...current]
      : current === undefined
        ? []
        : [current];
    const index = currentValues.findIndex((value) => value === nextValue);

    if (index >= 0) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(nextValue);
    }

    return currentValues.length > 0 ? currentValues : undefined;
  }

  function currentValue(filter: FilterDefinition): WorkbenchFilterValue | undefined {
    return filter.scope === 'panel'
      ? state.panels[filter.panelId ?? '']?.filters?.[filter.key]
      : state.filters[filter.key];
  }

  function toggle(filter: FilterDefinition, value: WorkbenchFilterValue) {
    const nextValue = toggleFilterValue(currentValue(filter), value, Boolean(filter.multi));
    if (filter.scope === 'panel' && filter.panelId) {
      workbench.actions.setPanelFilter(filter.panelId, filter.key, nextValue);
    } else {
      workbench.actions.setFilter(filter.key, nextValue);
    }
  }
</script>

<div class="rlwb-filter-bar">
  {#each filters as filter (filter.key)}
    <div class="rlwb-filter-group">
      <span class="rlwb-filter-group__label">{filter.label}</span>
      <div class="rlwb-filter-group__options">
        {#each filter.options as option (option.label)}
          <button
            type="button"
            class="rlwb-filter-chip"
            aria-pressed={filterValueIncludes(currentValue(filter), option.value)}
            onclick={() => toggle(filter, option.value)}
          >
            {option.label}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>
