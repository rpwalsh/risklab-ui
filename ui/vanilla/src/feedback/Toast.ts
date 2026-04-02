import { register } from '../core/register';
import type { ToastOptions } from '../core/types';

/**
 * `<ui-toast-container>` — Global toast notification container.
 *
 * Place one instance in your page, then use `UIToast.show()` to push toasts.
 *
 * @example
 * ```html
 * <ui-toast-container></ui-toast-container>
 * <script type="module">
 *   import { UIToast } from '@risklab/ui-vanilla/feedback';
 *   UIToast.show({ message: 'Saved!', severity: 'success', duration: 3000 });
 * </script>
 * ```
 */
class UIToastContainer extends HTMLElement {
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.innerHTML = `
      <style>
        :host {
          position: fixed;
          z-index: 99999;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 400px;
          padding: 1rem;
        }
        :host([position="top-right"])    { top: 0; right: 0; }
        :host([position="top-left"])     { top: 0; left: 0; }
        :host([position="bottom-right"]) { bottom: 0; right: 0; }
        :host([position="bottom-left"])  { bottom: 0; left: 0; }
        :host([position="top-center"])   { top: 0; left: 50%; transform: translateX(-50%); }
        :host([position="bottom-center"]){ bottom: 0; left: 50%; transform: translateX(-50%); }

        .toast {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-family: var(--ui-font-family, sans-serif);
          font-size: 0.875rem;
          line-height: 1.4;
          color: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.2s ease-out;
          transition: opacity 0.2s, transform 0.2s;
        }
        .toast.removing {
          opacity: 0;
          transform: translateX(100%);
        }

        .toast.success { background: var(--ui-color-success, #16a34a); }
        .toast.info    { background: var(--ui-color-info, #2563eb); }
        .toast.warning { background: var(--ui-color-warning, #d97706); }
        .toast.error   { background: var(--ui-color-error, #dc2626); }

        .close {
          all: unset;
          cursor: pointer;
          opacity: 0.7;
          font-size: 1rem;
          line-height: 1;
          margin-left: auto;
        }
        .close:hover { opacity: 1; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      </style>
    `;
  }

  addToast(options: ToastOptions): void {
    const severity = options.severity || 'info';
    const duration = options.duration ?? 4000;

    const el = document.createElement('div');
    el.className = `toast ${severity}`;
    el.setAttribute('role', 'alert');
    el.innerHTML = `
      <span>${options.message}</span>
      <button class="close" aria-label="close">✕</button>
    `;

    this.root.appendChild(el);

    const remove = () => {
      el.classList.add('removing');
      setTimeout(() => el.remove(), 200);
    };

    el.querySelector('.close')?.addEventListener('click', remove);

    if (duration > 0) {
      setTimeout(remove, duration);
    }
  }
}

register('ui-toast-container', UIToastContainer);

/**
 * UIToast — Imperative toast API.
 * Automatically creates a toast container if none exists.
 */
export class UIToast {
  private static _container: UIToastContainer | null = null;

  private static _getContainer(position: string): UIToastContainer {
    if (!UIToast._container) {
      UIToast._container = document.createElement('ui-toast-container') as UIToastContainer;
      document.body.appendChild(UIToast._container);
    }
    UIToast._container.setAttribute('position', position);
    return UIToast._container;
  }

  /**
   * Show a toast notification.
   *
   * ```ts
   * UIToast.show({ message: 'Operation complete!', severity: 'success' });
   * ```
   */
  static show(options: ToastOptions): void {
    const position = options.position || 'top-right';
    const container = UIToast._getContainer(position);
    container.addToast(options);
  }

  static success(message: string, duration?: number): void {
    UIToast.show({ message, severity: 'success', duration });
  }

  static error(message: string, duration?: number): void {
    UIToast.show({ message, severity: 'error', duration });
  }

  static info(message: string, duration?: number): void {
    UIToast.show({ message, severity: 'info', duration });
  }

  static warning(message: string, duration?: number): void {
    UIToast.show({ message, severity: 'warning', duration });
  }
}
