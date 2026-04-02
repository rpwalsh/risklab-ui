import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { SizeVariant } from '../core/types';

/**
 * `<ui-dialog>` — Modal / non-modal dialog with backdrop, escape key, named slots.
 *
 * @slot header - Dialog title / header area.
 * @slot        - Dialog body content.
 * @slot footer - Dialog footer (actions).
 *
 * @fires ui-close - When dialog requests close (backdrop click, escape, close button).
 *
 * @example
 * ```html
 * <ui-dialog open modal size="md">
 *   <span slot="header">Confirm</span>
 *   <p>Are you sure?</p>
 *   <div slot="footer">
 *     <ui-button variant="ghost">Cancel</ui-button>
 *     <ui-button>OK</ui-button>
 *   </div>
 * </ui-dialog>
 * ```
 */
@customElement('ui-dialog')
export class UiDialog extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: var(--ui-z-modal, 1300);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 200ms, visibility 200ms;
    }
    .backdrop--open {
      opacity: 1;
      visibility: visible;
    }

    .dialog {
      background: var(--ui-color-surface, #fff);
      border-radius: var(--ui-radius-lg, 0.75rem);
      box-shadow: var(--ui-shadow-xl, 0 20px 25px rgba(0,0,0,0.1));
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      overflow: hidden;
      transform: scale(0.95);
      transition: transform 200ms;
      box-sizing: border-box;
    }
    .backdrop--open .dialog {
      transform: scale(1);
    }

    /* Sizes */
    .dialog--xs { width: 320px; }
    .dialog--sm { width: 440px; }
    .dialog--md { width: 560px; }
    .dialog--lg { width: 720px; }
    .dialog--xl { width: 900px; }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--ui-color-border, #e2e8f0);
      font-weight: 600;
      font-size: 1.125rem;
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
      color: var(--ui-color-text-secondary, #64748b);
    }
    .close-btn:hover { color: var(--ui-color-text, #0f172a); }

    .body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .footer {
      padding: 0.75rem 1.5rem;
      border-top: 1px solid var(--ui-color-border, #e2e8f0);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) modal = true;
  @property({ type: String }) size: SizeVariant = 'md';

  @query('.backdrop') private _backdrop!: HTMLElement;

  private _boundEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) this._requestClose();
  };

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this._boundEscape);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._boundEscape);
  }

  private _requestClose() {
    this.dispatchEvent(
      new CustomEvent('ui-close', { bubbles: true, composed: true }),
    );
    this.open = false;
  }

  private _onBackdropClick(e: MouseEvent) {
    if (e.target === this._backdrop && this.modal) {
      this._requestClose();
    }
  }

  render() {
    if (!this.open) return nothing;
    return html`
      <div
        class="backdrop backdrop--open"
        @click=${this._onBackdropClick}
        part="backdrop"
      >
        <div
          class="dialog dialog--${this.size}"
          role="dialog"
          aria-modal=${this.modal}
          part="dialog"
        >
          <div class="header" part="header">
            <slot name="header"></slot>
            <button class="close-btn" type="button" aria-label="Close" @click=${this._requestClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="body" part="body"><slot></slot></div>
          <div class="footer" part="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-dialog': UiDialog;
  }
}
