import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import { Toast, type AnchorOrigin } from './Toast';

type Severity = 'success' | 'info' | 'warning' | 'error';
type ToastVariant = 'standard' | 'outlined' | 'filled';

export interface ToastOptions {
  message?: ReactNode;
  severity?: Severity;
  variant?: ToastVariant;
  action?: ReactNode;
  autoHideDuration?: number;
  anchorOrigin?: AnchorOrigin;
  icon?: ReactNode | false;
}

interface ToastEntry extends ToastOptions {
  id: string;
  open: boolean;
}

interface ToastContextValue {
  show: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

const defaultAnchor: AnchorOrigin = { vertical: 'bottom', horizontal: 'center' };

function anchorKey(anchor: AnchorOrigin): string {
  return `${anchor.vertical}-${anchor.horizontal}`;
}

function getContainerStyle(anchor: AnchorOrigin): CSSProperties {
  const base: CSSProperties = {
    position: 'fixed',
    display: 'flex',
    flexDirection: anchor.vertical === 'top' ? 'column' : 'column-reverse',
    gap: 'var(--ui-toast-stack-gap, 8px)',
    zIndex: 'var(--ui-toast-z-index, 1400)' as never,
    padding: 'var(--ui-toast-container-padding, 8px)',
    pointerEvents: 'none',
  };

  if (anchor.vertical === 'top') {
    base.top = 0;
  } else {
    base.bottom = 0;
  }

  if (anchor.horizontal === 'left') {
    base.left = 0;
  } else if (anchor.horizontal === 'right') {
    base.right = 0;
  } else {
    base.left = '50%';
    base.transform = 'translateX(-50%)';
  }

  return base;
}

const toastItemStyle: CSSProperties = {
  pointerEvents: 'auto',
  animation: 'var(--ui-toast-animation, ui-toast-slide-in 0.3s ease forwards)',
};

const keyframesId = 'ui-toast-keyframes';

function ensureKeyframes(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(keyframesId)) return;
  const styleEl = document.createElement('style');
  styleEl.id = keyframesId;
  styleEl.textContent = `
@keyframes ui-toast-slide-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ui-toast-slide-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(20px); }
}
`;
  document.head.appendChild(styleEl);
}

export interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export function ToastProvider({
  children,
  maxToasts = 5,
}: ToastProviderProps): React.JSX.Element {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counterRef = useRef(0);
  const timerMapRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  React.useEffect(() => {
    ensureKeyframes();
    // Cleanup all timers on unmount
    return () => {
      timerMapRef.current.forEach(t => clearTimeout(t));
      timerMapRef.current.clear();
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, open: false } : t)),
    );
    // Remove from DOM after animation
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timerMapRef.current.delete(id);
    }, 300);
    timerMapRef.current.set(id, timer);
  }, []);

  const dismissAll = useCallback(() => {
    setToasts((prev) => prev.map((t) => ({ ...t, open: false })));
    const timer = setTimeout(() => {
      setToasts([]);
    }, 300);
    timerMapRef.current.set('__all', timer);
  }, []);

  const show = useCallback(
    (options: ToastOptions): string => {
      const id = `ui-toast-${++counterRef.current}`;
      const entry: ToastEntry = {
        ...options,
        id,
        open: true,
      };
      setToasts((prev) => {
        const next = [...prev, entry];
        return next.length > maxToasts ? next.slice(next.length - maxToasts) : next;
      });
      return id;
    },
    [maxToasts],
  );

  const contextValue = React.useMemo<ToastContextValue>(
    () => ({ show, dismiss, dismissAll }),
    [show, dismiss, dismissAll],
  );

  // Group toasts by anchor
  const grouped = new Map<string, { anchor: AnchorOrigin; items: ToastEntry[] }>();
  for (const toast of toasts) {
    const anchor = toast.anchorOrigin ?? defaultAnchor;
    const key = anchorKey(anchor);
    const group = grouped.get(key);
    if (group) {
      group.items.push(toast);
    } else {
      grouped.set(key, { anchor, items: [toast] });
    }
  }

  const portal =
    typeof document !== 'undefined'
      ? createPortal(
          <>
            {Array.from(grouped.entries()).map(([key, { anchor, items }]) => (
              <div
                key={key}
                style={getContainerStyle(anchor)}
                aria-label="Notifications"
                role="region"
              >
                {items.map((toast) => (
                  <div
                    key={toast.id}
                    style={{
                      ...toastItemStyle,
                      animation: toast.open
                        ? 'var(--ui-toast-animation, ui-toast-slide-in 0.3s ease forwards)'
                        : 'ui-toast-slide-out 0.3s ease forwards',
                    }}
                  >
                    <Toast
                      message={toast.message}
                      severity={toast.severity}
                      variant={toast.variant}
                      action={toast.action}
                      icon={toast.icon}
                      autoHideDuration={toast.autoHideDuration}
                      onClose={() => dismiss(toast.id)}
                      open={toast.open}
                    />
                  </div>
                ))}
              </div>
            ))}
          </>,
          document.body,
        )
      : null;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
