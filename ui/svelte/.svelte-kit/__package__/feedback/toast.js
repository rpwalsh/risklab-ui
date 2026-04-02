let items = [];
let subscribers = [];
const timerIds = new Map();
function notify() {
    for (const sub of subscribers)
        sub([...items]);
}
function addToast(options) {
    const id = Math.random().toString(36).slice(2, 9);
    const item = {
        id,
        message: options.message,
        severity: options.severity ?? 'info',
        duration: options.duration ?? 4000,
        position: options.position ?? 'top-right',
        createdAt: Date.now(),
    };
    items = [...items, item];
    notify();
    const duration = item.duration ?? 0;
    if (duration > 0) {
        const timerId = setTimeout(() => removeToast(id), duration);
        timerIds.set(id, timerId);
    }
    return id;
}
function removeToast(id) {
    const timerId = timerIds.get(id);
    if (timerId !== undefined) {
        clearTimeout(timerId);
        timerIds.delete(id);
    }
    items = items.filter((t) => t.id !== id);
    notify();
}
export const toast = {
    show: (options) => addToast(options),
    success: (message, opts) => addToast({ message, severity: 'success', ...opts }),
    error: (message, opts) => addToast({ message, severity: 'error', ...opts }),
    warning: (message, opts) => addToast({ message, severity: 'warning', ...opts }),
    info: (message, opts) => addToast({ message, severity: 'info', ...opts }),
    dismiss: (id) => removeToast(id),
    dismissAll: () => {
        for (const timerId of timerIds.values()) {
            clearTimeout(timerId);
        }
        timerIds.clear();
        items = [];
        notify();
    },
};
/**
 * Svelte-compatible store for toast notifications.
 * Usage: const toasts = toastStore; $toasts (in .svelte files)
 */
export const toastStore = {
    subscribe(fn) {
        subscribers.push(fn);
        fn([...items]);
        return () => {
            subscribers = subscribers.filter((s) => s !== fn);
        };
    },
};
