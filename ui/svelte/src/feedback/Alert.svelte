<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    severity = 'info' as 'success' | 'info' | 'warning' | 'error',
    variant = 'standard' as 'filled' | 'outlined' | 'standard',
    closable = false,
    visible = $bindable(true),
    onclose,
    children,
  }: {
    severity?: 'success' | 'info' | 'warning' | 'error';
    variant?: 'filled' | 'outlined' | 'standard';
    closable?: boolean;
    visible?: boolean;
    onclose?: () => void;
    children?: Snippet;
  } = $props();

  const iconPaths: Record<string, string> = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  function handleClose() {
    visible = false;
    onclose?.();
  }
</script>

{#if visible}
  <div
    class="ui-alert"
    data-variant={variant}
    data-severity={severity}
    role="alert"
  >
    <span class="ui-alert__icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d={iconPaths[severity]} />
      </svg>
    </span>
    <div class="ui-alert__content">
      {@render children?.()}
    </div>
    {#if closable}
      <button class="ui-alert__close" type="button" aria-label="Close" onclick={handleClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    {/if}
  </div>
{/if}

<style>
  .ui-alert {
    display: flex;
    align-items: flex-start;
    padding: 12px 16px;
    border-radius: var(--ui-alert-border-radius, 4px);
    font-family: var(--ui-font-family, inherit);
    font-size: 0.875rem;
    line-height: 1.43;
    gap: 12px;
  }
  /* Standard */
  .ui-alert[data-variant="standard"][data-severity="success"] { background: var(--ui-alert-success-bg, #f0fdf4); color: #2e7d32; }
  .ui-alert[data-variant="standard"][data-severity="info"]    { background: var(--ui-alert-info-bg, #eff6ff); color: #0288d1; }
  .ui-alert[data-variant="standard"][data-severity="warning"] { background: var(--ui-alert-warning-bg, #fffbeb); color: #ed6c02; }
  .ui-alert[data-variant="standard"][data-severity="error"]   { background: var(--ui-alert-error-bg, #fef2f2); color: #d32f2f; }
  /* Outlined */
  .ui-alert[data-variant="outlined"][data-severity="success"] { background: transparent; border: 1px solid #2e7d32; color: #2e7d32; }
  .ui-alert[data-variant="outlined"][data-severity="info"]    { background: transparent; border: 1px solid #0288d1; color: #0288d1; }
  .ui-alert[data-variant="outlined"][data-severity="warning"] { background: transparent; border: 1px solid #ed6c02; color: #ed6c02; }
  .ui-alert[data-variant="outlined"][data-severity="error"]   { background: transparent; border: 1px solid #d32f2f; color: #d32f2f; }
  /* Filled */
  .ui-alert[data-variant="filled"][data-severity="success"] { background: #2e7d32; color: #fff; }
  .ui-alert[data-variant="filled"][data-severity="info"]    { background: #0288d1; color: #fff; }
  .ui-alert[data-variant="filled"][data-severity="warning"] { background: #ed6c02; color: #fff; }
  .ui-alert[data-variant="filled"][data-severity="error"]   { background: #d32f2f; color: #fff; }

  .ui-alert__icon { display: flex; align-items: center; flex-shrink: 0; margin-top: 2px; }
  .ui-alert__content { flex: 1; min-width: 0; }
  .ui-alert__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    color: inherit;
    opacity: 0.7;
  }
  .ui-alert__close:hover { opacity: 1; }
</style>
