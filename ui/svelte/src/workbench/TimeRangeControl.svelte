<script lang="ts">
  import { getWorkbenchContext } from './state.js';
  import type { TimeWindow } from './state.js';

  export interface TimeRangeOption {
    label: string;
    value: TimeWindow;
  }

  const defaultTimeRanges: TimeRangeOption[] = [
    { label: '1h', value: { preset: '1h', label: 'Last hour' } },
    { label: '24h', value: { preset: '24h', label: 'Last 24 hours' } },
    { label: '7d', value: { preset: '7d', label: 'Last 7 days' } },
    { label: '30d', value: { preset: '30d', label: 'Last 30 days' } },
  ];

  let {
    options = defaultTimeRanges,
  }: {
    options?: TimeRangeOption[];
  } = $props();

  const workbench = getWorkbenchContext();
  const stateStore = workbench.state;
  let state = $derived($stateStore);

  function timeWindowsEqual(
    left: TimeWindow | null | undefined,
    right: TimeWindow | null | undefined,
  ): boolean {
    if (!left && !right) {
      return true;
    }
    if (!left || !right) {
      return false;
    }
    return left.preset === right.preset
      && left.from === right.from
      && left.to === right.to
      && left.timezone === right.timezone
      && left.label === right.label;
  }
</script>

<div class="rlwb-time-range">
  {#each options as option (option.label)}
    <button
      type="button"
      class="rlwb-filter-chip"
      aria-pressed={timeWindowsEqual(state.timeWindow, option.value)}
      onclick={() => workbench.actions.setTimeWindow(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>
