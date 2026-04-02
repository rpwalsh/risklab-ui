import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-dialog>` — Modal/non-modal dialog.
 *
 * @attr {boolean} open - Controls visibility
 * @attr {boolean} modal - Use modal backdrop
 * @attr {string} size - sm | md | lg | xl
 *
 * @slot - Default content
 * @slot header - Dialog header
 * @slot footer - Dialog footer/actions
 *
 * @fires ui-close - Fires when dialog is closed
 *
 * @example
 * ```html
 * <ui-dialog open modal size="md">
 *   <div slot="header"><h2>Confirm</h2></div>
 *   <p>Are you sure?</p>
 *   <div slot="footer">
 *     <ui-button variant="ghost" onclick="this.closest('ui-dialog').open=false">Cancel</ui-button>
 *     <ui-button>Confirm</ui-button>
 *   </div>
 * </ui-dialog>
 * ```
 */
export class UIDialog extends UIElement {
  static observedAttributes = ['open', 'modal', 'size'];

  get open(): boolean { return this.getBoolAttr('open'); }
  set open(v: boolean) {
    if (v) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  protected styles(): string {
    return /* css */ `
      :host { display: contents; }

      .backdrop {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0,0,0,0.5);
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.15s ease-out;
      }
      :host([open]) .backdrop { display: flex; }

      .dialog {
        background: var(--ui-color-surface, #fff);
        border-radius: var(--ui-radius-lg, 0.75rem);
        box-shadow: 0 20px 60px rgba(0,0,0,.2);
        max-height: 90vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        animation: slideUp 0.2s ease-out;
      }

      .dialog.size-sm { width: min(400px, 90vw); }
      .dialog.size-md { width: min(560px, 90vw); }
      .dialog.size-lg { width: min(720px, 90vw); }
      .dialog.size-xl { width: min(960px, 90vw); }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--ui-space-4, 1rem) var(--ui-space-6, 1.5rem);
        border-bottom: 1px solid var(--ui-color-border, #e2e8f0);
      }

      .body {
        padding: var(--ui-space-6, 1.5rem);
        flex: 1;
      }

      .footer {
        padding: var(--ui-space-4, 1rem) var(--ui-space-6, 1.5rem);
        border-top: 1px solid var(--ui-color-border, #e2e8f0);
        display: flex;
        justify-content: flex-end;
        gap: var(--ui-space-2, 0.5rem);
      }

      .close-btn {
        all: unset;
        cursor: pointer;
        font-size: 1.25rem;
        color: var(--ui-color-text-secondary, #64748b);
        padding: 0.25rem;
        line-height: 1;
        border-radius: var(--ui-radius-sm, 0.25rem);
        transition: background 0.15s;
      }
      .close-btn:hover {
        background: var(--ui-color-surface-variant, #f8fafc);
      }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
  }

  protected template(): string {
    const size = this.getAttr('size', 'md');

    return `
      <div class="backdrop" part="backdrop">
        <div class="dialog size-${size}" role="dialog" aria-modal="true" part="dialog">
          <div class="header" part="header">
            <slot name="header"></slot>
            <button class="close-btn" aria-label="Close dialog" part="close">✕</button>
          </div>
          <div class="body" part="body"><slot></slot></div>
          <div class="footer" part="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `;
  }

  protected onRendered(): void {
    // Close button
    this.$('.close-btn')?.addEventListener('click', () => {
      this.open = false;
      this.emit('ui-close');
    });

    // Backdrop click
    const modal = this.getBoolAttr('modal');
    if (modal) {
      this.$('.backdrop')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          this.open = false;
          this.emit('ui-close');
        }
      });
    }

    // Escape key
    this._keyHandler = (e: Event) => {
      if ((e as KeyboardEvent).key === 'Escape' && this.open) {
        this.open = false;
        this.emit('ui-close');
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  }

  private _keyHandler: ((e: Event) => void) | null = null;

  protected onDisconnected(): void {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
    }
  }
}

register('ui-dialog', UIDialog);
