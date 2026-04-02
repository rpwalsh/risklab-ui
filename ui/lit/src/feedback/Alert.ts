import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-alert>` — Contextual alert with severity, variant, close button.
 *
 * @slot - Alert message content.
 * @fires ui-close - When close button is clicked.
 *
 * @example
 * ```html
 * <ui-alert severity="success" closable>Changes saved!</ui-alert>
 * <ui-alert severity="error" variant="filled">Something went wrong.</ui-alert>
 * ```
 */
@customElement('ui-alert')
export class UiAlert extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    :host([hidden]) { display: none; }

    .alert {
      display: flex;
      align-items: flex-start;
      padding: 12px 16px;
      border-radius: var(--ui-radius-sm, 0.25rem);
      font-family: var(--ui-font-family, inherit);
      font-size: 0.875rem;
      line-height: 1.43;
      gap: 12px;
    }

    /* Standard */
    .alert--standard.severity-success { background: var(--ui-alert-success-bg, #f0fdf4); color: #166534; }
    .alert--standard.severity-info    { background: var(--ui-alert-info-bg, #eff6ff);    color: #1e40af; }
    .alert--standard.severity-warning { background: var(--ui-alert-warning-bg, #fffbeb); color: #92400e; }
    .alert--standard.severity-error   { background: var(--ui-alert-error-bg, #fef2f2);   color: #991b1b; }

    /* Outlined */
    .alert--outlined.severity-success { background: transparent; border: 1px solid #16a34a; color: #166534; }
    .alert--outlined.severity-info    { background: transparent; border: 1px solid #2563eb; color: #1e40af; }
    .alert--outlined.severity-warning { background: transparent; border: 1px solid #d97706; color: #92400e; }
    .alert--outlined.severity-error   { background: transparent; border: 1px solid #dc2626; color: #991b1b; }

    /* Filled */
    .alert--filled.severity-success { background: #16a34a; color: #fff; }
    .alert--filled.severity-info    { background: #2563eb; color: #fff; }
    .alert--filled.severity-warning { background: #d97706; color: #fff; }
    .alert--filled.severity-error   { background: #dc2626; color: #fff; }

    .icon {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .content {
      flex: 1;
      min-width: 0;
    }

    .close-btn {
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
      margin-left: auto;
      flex-shrink: 0;
    }
    .close-btn:hover { opacity: 1; }
  `;

  @property({ type: String, reflect: true }) severity: 'success' | 'info' | 'warning' | 'error' = 'info';
  @property({ type: String, reflect: true }) variant: 'filled' | 'outlined' | 'standard' = 'standard';
  @property({ type: Boolean }) closable = false;

  private get _icon(): string {
    const icons: Record<string, string> = {
      success: '✓',
      info: 'ℹ',
      warning: '⚠',
      error: '✕',
    };
    return icons[this.severity] ?? 'ℹ';
  }

  private _close() {
    this.dispatchEvent(
      new CustomEvent('ui-close', { bubbles: true, composed: true }),
    );
    this.hidden = true;
  }

  render() {
    return html`
      <div
        class="alert alert--${this.variant} severity-${this.severity}"
        role="alert"
        part="alert"
      >
        <span class="icon" aria-hidden="true">${this._icon}</span>
        <div class="content" part="content"><slot></slot></div>
        ${this.closable
          ? html`<button class="close-btn" type="button" aria-label="Close" @click=${this._close}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-alert': UiAlert;
  }
}
