import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-tab>` — Individual tab trigger button, used inside `<ui-tabs>`.
 *
 * @slot - Tab label content.
 *
 * @example
 * ```html
 * <ui-tab value="settings">Settings</ui-tab>
 * ```
 */
@customElement('ui-tab')
export class UiTab extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: var(--ui-font-family, inherit);
      border: none;
      background: none;
      cursor: pointer;
      white-space: nowrap;
      outline: none;
      color: var(--ui-color-text-secondary, #64748b);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 150ms;
    }

    button:focus-visible {
      outline: 2px solid var(--ui-color-primary, #4f46e5);
      outline-offset: -2px;
    }

    button[aria-selected='true'] {
      color: var(--ui-color-primary, #4f46e5);
      border-bottom-color: var(--ui-color-primary, #4f46e5);
    }

    button:hover:not([aria-selected='true']):not(:disabled) {
      color: var(--ui-color-text, #0f172a);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) selected = false;

  private _onClick() {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('ui-tab-click', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button
        type="button"
        role="tab"
        aria-selected=${this.selected}
        ?disabled=${this.disabled}
        @click=${this._onClick}
        part="tab"
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tab': UiTab;
  }
}
