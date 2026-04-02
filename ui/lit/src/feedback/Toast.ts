import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ToastOptions } from '../core/types';

/**
 * `<ui-toast-container>` — Internal container for imperative toasts.
 * Do not use directly — use `UiToast.show()` etc.
 */
@customElement('ui-toast-container')
export class UiToastContainer extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      z-index: var(--ui-z-toast, 1400);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
      max-width: 420px;
    }

    :host([position='top-right'])    { top: 1rem; right: 1rem; }
    :host([position='top-left'])     { top: 1rem; left: 1rem; }
    :host([position='bottom-right']) { bottom: 1rem; right: 1rem; }
    :host([position='bottom-left'])  { bottom: 1rem; left: 1rem; }
    :host([position='top-center'])   { top: 1rem; left: 50%; transform: translateX(-50%); }
    :host([position='bottom-center']){ bottom: 1rem; left: 50%; transform: translateX(-50%); }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--ui-radius-md, 0.5rem);
      font-family: var(--ui-font-family, inherit);
      font-size: 0.875rem;
      color: #fff;
      box-shadow: var(--ui-shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
      pointer-events: auto;
      animation: toast-in 200ms ease forwards;
    }

    .toast--exiting {
      animation: toast-out 200ms ease forwards;
    }

    .toast--success { background: var(--ui-color-success, #16a34a); }
    .toast--info    { background: var(--ui-color-info, #2563eb); }
    .toast--warning { background: var(--ui-color-warning, #d97706); }
    .toast--error   { background: var(--ui-color-error, #dc2626); }

    .close-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 2px;
      opacity: 0.8;
      margin-left: auto;
      flex-shrink: 0;
    }
    .close-btn:hover { opacity: 1; }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(8px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes toast-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(-8px) scale(0.97); }
    }
  `;

  @property({ type: String, reflect: true }) position = 'top-right';

  @state() _toasts: Array<{
    id: number;
    message: string;
    severity: string;
    exiting: boolean;
  }> = [];

  private _nextId = 0;
  private _timers = new Map<number, ReturnType<typeof setTimeout>>();

  disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const timer of this._timers.values()) {
      clearTimeout(timer);
    }
    this._timers.clear();
  }

  addToast(opts: ToastOptions) {
    const id = this._nextId++;
    const severity = opts.severity ?? 'info';
    const duration = opts.duration ?? 4000;
    if (opts.position) this.position = opts.position;

    this._toasts = [...this._toasts, { id, message: opts.message, severity, exiting: false }];

    if (duration > 0) {
      const timer = setTimeout(() => this._dismiss(id), duration);
      this._timers.set(id, timer);
    }
  }

  private _dismiss(id: number) {
    this._timers.delete(id);
    this._toasts = this._toasts.map((t) =>
      t.id === id ? { ...t, exiting: true } : t,
    );
    const exitTimer = setTimeout(() => {
      this._toasts = this._toasts.filter((t) => t.id !== id);
      this._timers.delete(-id);
    }, 220);
    this._timers.set(-id, exitTimer);
  }

  render() {
    return html`
      ${this._toasts.map(
        (t) => html`
          <div class="toast toast--${t.severity} ${t.exiting ? 'toast--exiting' : ''}" role="alert">
            <span>${t.message}</span>
            <button class="close-btn" type="button" aria-label="Close" @click=${() => this._dismiss(t.id)}>✕</button>
          </div>
        `,
      )}
    `;
  }
}

/**
 * Imperative Toast API.
 *
 * @example
 * ```ts
 * import { UiToast } from '@risklab/ui-lit/feedback';
 * UiToast.success('Saved!');
 * UiToast.error('Something failed.');
 * UiToast.show({ message: 'Custom', severity: 'warning', duration: 5000 });
 * ```
 */
export class UiToast {
  private static _container: UiToastContainer | null = null;

  private static _getContainer(): UiToastContainer {
    if (!UiToast._container) {
      UiToast._container = document.createElement('ui-toast-container') as UiToastContainer;
      document.body.appendChild(UiToast._container);
    }
    return UiToast._container;
  }

  static show(opts: ToastOptions): void {
    UiToast._getContainer().addToast(opts);
  }

  static success(message: string, duration?: number): void {
    UiToast.show({ message, severity: 'success', duration });
  }

  static error(message: string, duration?: number): void {
    UiToast.show({ message, severity: 'error', duration });
  }

  static info(message: string, duration?: number): void {
    UiToast.show({ message, severity: 'info', duration });
  }

  static warning(message: string, duration?: number): void {
    UiToast.show({ message, severity: 'warning', duration });
  }

  /** Remove the shared container from the DOM and release the reference. */
  static dispose(): void {
    if (UiToast._container) {
      UiToast._container.remove();
      UiToast._container = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-toast-container': UiToastContainer;
  }
}
