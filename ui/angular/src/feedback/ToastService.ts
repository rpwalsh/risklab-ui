import { Injectable, signal } from '@angular/core';
import type { ToastOptions } from '../core/types';

export interface ToastItem {
  id: number;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  duration: number;
  position: string;
  exiting?: boolean;
}

let toastIdCounter = 0;

/**
 * ToastService — Injectable service managing toast notifications via signals.
 *
 * @example
 * ```typescript
 * @Component({ template: `<button (click)="toast.success('Done!')">Notify</button>` })
 * export class App {
 *   toast = inject(ToastService);
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  /** Signal array of active toasts */
  readonly toasts = signal<ToastItem[]>([]);

  /** Map of toast ID to auto-dismiss timer ID */
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  /** Show a toast with given options */
  show(options: ToastOptions): number {
    const id = ++toastIdCounter;
    const toast: ToastItem = {
      id,
      message: options.message,
      severity: options.severity ?? 'info',
      duration: options.duration ?? 4000,
      position: options.position ?? 'top-right',
    };
    this.toasts.update(list => [...list, toast]);

    if (toast.duration > 0) {
      const timerId = setTimeout(() => this.dismiss(id), toast.duration);
      this.timers.set(id, timerId);
    }
    return id;
  }

  /** Dismiss a toast by id */
  dismiss(id: number): void {
    const timerId = this.timers.get(id);
    if (timerId != null) {
      clearTimeout(timerId);
      this.timers.delete(id);
    }
    // Mark as exiting for animation, then remove
    this.toasts.update(list =>
      list.map(t => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      this.toasts.update(list => list.filter(t => t.id !== id));
    }, 200);
  }

  /** Dismiss all toasts */
  dismissAll(): void {
    for (const timerId of this.timers.values()) {
      clearTimeout(timerId);
    }
    this.timers.clear();
    this.toasts.set([]);
  }

  success(message: string, duration?: number): number {
    return this.show({ message, severity: 'success', duration });
  }

  error(message: string, duration?: number): number {
    return this.show({ message, severity: 'error', duration });
  }

  info(message: string, duration?: number): number {
    return this.show({ message, severity: 'info', duration });
  }

  warning(message: string, duration?: number): number {
    return this.show({ message, severity: 'warning', duration });
  }
}
