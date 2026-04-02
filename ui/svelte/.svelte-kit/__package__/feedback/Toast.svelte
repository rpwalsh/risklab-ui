<script lang="ts">
  import { toastStore, toast } from './toast.js';
  import type { ToastItem } from './toast.js';

  let {
    position = 'top-right',
  }: {
    position?: string;
  } = $props();

  let toasts = $state<ToastItem[]>([]);

  $effect(() => {
    const unsubscribe = toastStore.subscribe((items) => {
      toasts = items;
    });
    return unsubscribe;
  });

  let posClass = $derived(`ui-toast-container--${position}`);
</script>

<div class="ui-toast-container {posClass}" aria-live="polite" aria-atomic="false">
  {#each toasts as t (t.id)}
    <div class="ui-toast ui-toast--{t.severity}" role="status">
      <span class="ui-toast__message">{t.message}</span>
      <button class="ui-toast__close" type="button" aria-label="Dismiss" onclick={() => { toast.dismiss(t.id); }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  {/each}
</div>

<style>
  .ui-toast-container {
    position: fixed;
    z-index: var(--ui-z-toast, 1400);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    pointer-events: none;
    max-width: 420px;
  }
  .ui-toast-container--top-right    { top: 0; right: 0; }
  .ui-toast-container--top-left     { top: 0; left: 0; }
  .ui-toast-container--bottom-right { bottom: 0; right: 0; }
  .ui-toast-container--bottom-left  { bottom: 0; left: 0; }
  .ui-toast-container--top-center   { top: 0; left: 50%; transform: translateX(-50%); }
  .ui-toast-container--bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); }

  .ui-toast {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--ui-toast-border-radius, 0.5rem);
    font-family: var(--ui-font-family, inherit);
    font-size: 0.875rem;
    box-shadow: var(--ui-shadow-lg);
    animation: ui-toast-slide-in 200ms ease;
    min-width: 288px;
  }
  .ui-toast--success { background: var(--ui-color-success, #16a34a); color: #fff; }
  .ui-toast--info    { background: var(--ui-color-info, #2563eb); color: #fff; }
  .ui-toast--warning { background: var(--ui-color-warning, #d97706); color: #fff; }
  .ui-toast--error   { background: var(--ui-color-error, #dc2626); color: #fff; }

  .ui-toast__message { flex: 1; }
  .ui-toast__close {
    display: inline-flex;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    opacity: 0.8;
    padding: 2px;
    border-radius: 50%;
  }
  .ui-toast__close:hover { opacity: 1; }

  @keyframes ui-toast-slide-in {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
</style>
