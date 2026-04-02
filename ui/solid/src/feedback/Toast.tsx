/**
 * @risklab/ui-solid — Toast
 * Context-based toast system: ToastProvider + useToast().
 * ToastContainer rendered via Portal. Uses <For> and <Dynamic>.
 */

import {
  createContext,
  createSignal,
  useContext,
  For,
  Show,
  onCleanup,
  type Component,
  type JSX,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import type { ToastOptions, ToastEntry } from '../core/types';

// ─── Context ──────────────────────────────────────────────────────

export interface ToastAPI {
  show: (options: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastAPI>();

export function useToast(): ToastAPI {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
  return ctx;
}

// ─── Provider ──────────────────────────────────────────────────────

export interface ToastProviderProps {
  children?: JSX.Element;
}

export const ToastProvider: Component<ToastProviderProps> = (props) => {
  let toastIdCounter = 0;
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const [toasts, setToasts] = createSignal<ToastEntry[]>([]);

  const removeToast = (id: string) => {
    const timer = timers.get(id);
    if (timer != null) {
      clearTimeout(timer);
      timers.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const show = (options: ToastOptions) => {
    const id = `toast-${++toastIdCounter}`;
    const entry: ToastEntry = { ...options, id };
    setToasts((prev) => [...prev, entry]);
    const duration = options.duration ?? 4000;
    if (duration > 0) {
      const timer = setTimeout(() => removeToast(id), duration);
      timers.set(id, timer);
    }
  };

  onCleanup(() => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  });

  const api: ToastAPI = {
    show,
    success: (message, duration) => show({ message, severity: 'success', duration }),
    error: (message, duration) => show({ message, severity: 'error', duration }),
    info: (message, duration) => show({ message, severity: 'info', duration }),
    warning: (message, duration) => show({ message, severity: 'warning', duration }),
  };

  const SEVERITY_COLORS: Record<string, { bg: string; color: string }> = {
    success: { bg: 'var(--ui-color-success, #16a34a)', color: '#fff' },
    info: { bg: 'var(--ui-color-info, #2563eb)', color: '#fff' },
    warning: { bg: 'var(--ui-color-warning, #d97706)', color: '#fff' },
    error: { bg: 'var(--ui-color-error, #dc2626)', color: '#fff' },
  };

  const positionStyle = (pos?: string): Record<string, string> => {
    const base: Record<string, string> = {
      position: 'fixed',
      'z-index': 'var(--ui-z-toast, 1400)',
      display: 'flex',
      'flex-direction': 'column',
      gap: '0.5rem',
      padding: '1rem',
      'pointer-events': 'none',
      'max-width': '420px',
    };
    switch (pos) {
      case 'top-left':
        base.top = '0'; base.left = '0';
        break;
      case 'top-center':
        base.top = '0'; base.left = '50%'; base.transform = 'translateX(-50%)';
        break;
      case 'bottom-left':
        base.bottom = '0'; base.left = '0';
        break;
      case 'bottom-center':
        base.bottom = '0'; base.left = '50%'; base.transform = 'translateX(-50%)';
        break;
      case 'bottom-right':
        base.bottom = '0'; base.right = '0';
        break;
      case 'top-right':
      default:
        base.top = '0'; base.right = '0';
        break;
    }
    return base;
  };

  return (
    <ToastContext.Provider value={api}>
      {props.children}
      <Portal>
        <div style={positionStyle('top-right')}>
          <For each={toasts()}>
            {(toast) => {
              const sc = SEVERITY_COLORS[toast.severity ?? 'info'] ?? SEVERITY_COLORS.info;
              return (
                <div
                  style={{
                    display: 'flex',
                    'align-items': 'center',
                    gap: '0.75rem',
                    'min-width': '288px',
                    padding: '0.75rem 1rem',
                    'border-radius': 'var(--ui-radius-sm, 4px)',
                    'box-shadow': 'var(--ui-shadow-lg)',
                    'background-color': sc.bg,
                    color: sc.color,
                    'font-family': 'var(--ui-font-family, inherit)',
                    'font-size': '0.875rem',
                    'pointer-events': 'auto',
                    animation: 'ui-toast-in 200ms ease forwards',
                  }}
                  role="alert"
                >
                  <span style={{ flex: '1' }}>{toast.message}</span>
                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: '2px',
                      opacity: '0.8',
                      'font-size': '1rem',
                      'line-height': '1',
                    }}
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              );
            }}
          </For>
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};
