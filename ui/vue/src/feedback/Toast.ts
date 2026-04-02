import {
  defineComponent,
  h,
  ref,
  reactive,
  provide,
  inject,
  Teleport,
  Transition,
  onUnmounted,
  type PropType,
  type CSSProperties,
  type InjectionKey,
} from 'vue';
import type { ToastOptions } from '../core/types';

/* ─── internal types ─── */
interface ToastEntry {
  id: number;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  duration: number;
  timer: ReturnType<typeof setTimeout> | null;
}

interface ToastAPI {
  show(options: ToastOptions): void;
  info(message: string): void;
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
}

export const ToastKey: InjectionKey<ToastAPI> = Symbol('UiToast');

let _nextId = 0;

/* ─── severity icons ─── */
function severityIcon(s: string) {
  const iconPaths: Record<string, string> = {
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    success: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    error: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z',
  };
  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    style: { flexShrink: 0 } as CSSProperties,
  }, [h('path', { d: iconPaths[s] || iconPaths.info })]);
}

/* ─── severity colours ─── */
const SEVERITY_BG: Record<string, string> = {
  info: 'var(--ui-color-info-soft, #e3f2fd)',
  success: 'var(--ui-color-success-soft, #e8f5e9)',
  warning: 'var(--ui-color-warning-soft, #fff3e0)',
  error: 'var(--ui-color-error-soft, #ffebee)',
};
const SEVERITY_FG: Record<string, string> = {
  info: 'var(--ui-color-info-soft-fg, #0d47a1)',
  success: 'var(--ui-color-success-soft-fg, #1b5e20)',
  warning: 'var(--ui-color-warning-soft-fg, #e65100)',
  error: 'var(--ui-color-error-soft-fg, #b71c1c)',
};

/* ─── provider ─── */
export const UiToastProvider = defineComponent({
  name: 'UiToastProvider',
  props: {
    position: {
      type: String as PropType<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>,
      default: 'bottom-left',
    },
    maxToasts: { type: Number, default: 5 },
  },
  setup(props, { slots }) {
    const toasts = reactive<ToastEntry[]>([]);

    function dismiss(id: number) {
      const idx = toasts.findIndex((t) => t.id === id);
      if (idx !== -1) {
        const entry = toasts[idx];
        if (entry.timer) clearTimeout(entry.timer);
        toasts.splice(idx, 1);
      }
    }

    function show(options: ToastOptions) {
      const id = ++_nextId;
      const severity = options.severity ?? 'info';
      const duration = options.duration ?? 5000;
      const entry: ToastEntry = { id, message: options.message, severity, duration, timer: null };
      if (duration > 0) {
        entry.timer = setTimeout(() => dismiss(id), duration);
      }
      toasts.push(entry);
      // evict oldest when max exceeded
      while (toasts.length > props.maxToasts) {
        const oldest = toasts[0];
        if (oldest.timer) clearTimeout(oldest.timer);
        toasts.shift();
      }
    }

    const api: ToastAPI = {
      show,
      info: (m) => show({ message: m, severity: 'info' }),
      success: (m) => show({ message: m, severity: 'success' }),
      warning: (m) => show({ message: m, severity: 'warning' }),
      error: (m) => show({ message: m, severity: 'error' }),
    };

    provide(ToastKey, api);

    onUnmounted(() => {
      toasts.forEach((t) => { if (t.timer) clearTimeout(t.timer); });
    });

    return () => {
      /* position styles */
      const [vEdge, hEdge] = props.position.split('-') as [string, string];
      const containerStyle: CSSProperties = {
        position: 'fixed',
        zIndex: 'var(--ui-z-toast, 1400)' as any,
        display: 'flex',
        flexDirection: vEdge === 'top' ? 'column' : 'column-reverse',
        gap: '8px',
        padding: '16px',
        pointerEvents: 'none',
        maxHeight: '100vh',
        overflow: 'hidden',
      };
      if (vEdge === 'top') containerStyle.top = '0';
      else containerStyle.bottom = '0';
      if (hEdge === 'left') { containerStyle.left = '0'; containerStyle.alignItems = 'flex-start'; }
      else if (hEdge === 'right') { containerStyle.right = '0'; containerStyle.alignItems = 'flex-end'; }
      else { containerStyle.left = '50%'; containerStyle.transform = 'translateX(-50%)'; containerStyle.alignItems = 'center'; }

      const toastEls = toasts.map((t) => {
        const itemStyle: CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: 'var(--ui-radius-md, 8px)',
          background: SEVERITY_BG[t.severity],
          color: SEVERITY_FG[t.severity],
          fontFamily: 'var(--ui-font-family, inherit)',
          fontSize: 'var(--ui-font-size-sm, 0.875rem)',
          boxShadow: 'var(--ui-shadow-lg, 0 8px 24px rgba(0,0,0,.15))',
          pointerEvents: 'auto',
          minWidth: '280px',
          maxWidth: '420px',
        };

        return h('div', {
          key: t.id,
          class: 'ui-toast',
          role: 'alert',
          'aria-live': 'polite',
          'data-severity': t.severity,
          style: itemStyle,
        }, [
          severityIcon(t.severity),
          h('span', { style: { flex: '1' } as CSSProperties }, t.message),
          h('button', {
            type: 'button',
            'aria-label': 'Close',
            onClick: () => dismiss(t.id),
            style: {
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              color: 'inherit',
              opacity: 0.7,
            } as CSSProperties,
          }, [
            h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'currentColor' }, [
              h('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' }),
            ]),
          ]),
        ]);
      });

      return [
        slots.default?.(),
        h(Teleport as any, { to: 'body' }, [
          h('div', { class: 'ui-toast-container', style: containerStyle }, toastEls),
        ]),
      ];
    };
  },
});

/* ─── composable ─── */
export function useToast(): ToastAPI {
  const api = inject(ToastKey);
  if (!api) throw new Error('[UiToast] useToast() must be called inside <UiToastProvider>');
  return api;
}
