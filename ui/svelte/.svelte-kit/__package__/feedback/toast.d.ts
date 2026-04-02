import type { ToastOptions } from '../core/types.js';
export interface ToastItem extends ToastOptions {
    id: string;
    createdAt: number;
}
type Subscriber = (toasts: ToastItem[]) => void;
export declare const toast: {
    show: (options: ToastOptions) => string;
    success: (message: string, opts?: Partial<ToastOptions>) => string;
    error: (message: string, opts?: Partial<ToastOptions>) => string;
    warning: (message: string, opts?: Partial<ToastOptions>) => string;
    info: (message: string, opts?: Partial<ToastOptions>) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
};
/**
 * Svelte-compatible store for toast notifications.
 * Usage: const toasts = toastStore; $toasts (in .svelte files)
 */
export declare const toastStore: {
    subscribe(fn: Subscriber): () => void;
};
export {};
