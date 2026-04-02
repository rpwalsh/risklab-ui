import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { SizeVariant } from '../core/types';

/**
 * `<ui-text-field>` — Text input with label, helper text, error state,
 * and multiple visual variants.
 *
 * @fires ui-input  - On every keystroke (detail: { value }).
 * @fires ui-change - On blur/committed change (detail: { value }).
 *
 * @example
 * ```html
 * <ui-text-field label="Email" placeholder="you@example.com" type="email"></ui-text-field>
 * ```
 */
@customElement('ui-text-field')
export class UiTextField extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-family: var(--ui-font-family, inherit);
    }

    .label {
      font-size: var(--ui-tf-label-size, 0.8125rem);
      font-weight: 500;
      color: var(--ui-color-text, #374151);
    }

    .wrapper {
      display: flex;
      align-items: center;
      gap: 0.5em;
      height: var(--ui-tf-height, 2.5rem);
      padding: var(--ui-tf-padding, 0 0.75rem);
      font-size: var(--ui-tf-font-size, 0.875rem);
      background: var(--ui-tf-bg, transparent);
      border: 1px solid var(--ui-tf-border, #d1d5db);
      border-radius: var(--ui-tf-radius, 0.375rem);
      transition: border-color 150ms;
      box-sizing: border-box;
    }

    :host([size='xs']) .wrapper { height: 1.5rem;  font-size: 0.75rem;   padding: 0 0.375rem; border-radius: 0.25rem; }
    :host([size='sm']) .wrapper { height: 2rem;    font-size: 0.8125rem; padding: 0 0.5rem;   border-radius: 0.3125rem; }
    :host([size='md']) .wrapper { height: 2.5rem;  font-size: 0.875rem;  padding: 0 0.75rem;  border-radius: 0.375rem; }
    :host([size='lg']) .wrapper { height: 3rem;    font-size: 1rem;      padding: 0 1rem;     border-radius: 0.5rem; }
    :host([size='xl']) .wrapper { height: 3.5rem;  font-size: 1.125rem;  padding: 0 1.25rem;  border-radius: 0.625rem; }

    :host([variant='filled']) .wrapper {
      background: var(--ui-tf-filled-bg, #f3f4f6);
      border-color: transparent;
    }
    :host([variant='underlined']) .wrapper {
      background: transparent;
      border-color: transparent;
      border-bottom-color: var(--ui-tf-border-color, #d1d5db);
      border-radius: 0;
    }

    .wrapper:focus-within {
      border-color: var(--ui-color-primary, #4f46e5);
      box-shadow: 0 0 0 1px var(--ui-color-primary, #4f46e5);
    }

    :host([error]) .wrapper {
      border-color: var(--ui-color-error, #dc2626);
    }
    :host([error]) .wrapper:focus-within {
      border-color: var(--ui-color-error, #dc2626);
      box-shadow: 0 0 0 1px var(--ui-color-error, #dc2626);
    }

    .wrapper--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font: inherit;
      color: inherit;
      padding: 0;
      min-width: 0;
    }

    .helper {
      font-size: 0.75rem;
      margin: 0;
    }
    .helper--error {
      color: var(--ui-color-error, #dc2626);
    }
    .helper--normal {
      color: var(--ui-color-text-secondary, #6b7280);
    }
  `;

  @property({ type: String, reflect: true }) variant: 'outlined' | 'filled' | 'underlined' = 'outlined';
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) error = false;
  @property({ type: String }) helperText = '';
  @property({ type: String }) type = 'text';
  @property({ type: String }) value = '';

  @query('input') private _input!: HTMLInputElement;

  private _uniqueId = `ui-text-field-${Math.random().toString(36).slice(2, 9)}`;

  private _onInput() {
    this.value = this._input.value;
    this.dispatchEvent(
      new CustomEvent('ui-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onChange() {
    this.value = this._input.value;
    this.dispatchEvent(
      new CustomEvent('ui-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      ${this.label ? html`<label class="label" for=${this._uniqueId} part="label">${this.label}</label>` : nothing}
      <div class="wrapper ${this.disabled ? 'wrapper--disabled' : ''}" part="wrapper">
        <input
          id=${this._uniqueId}
          .type=${this.type}
          .value=${this.value}
          .placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          aria-invalid=${this.error}
          @input=${this._onInput}
          @change=${this._onChange}
          part="input"
        />
      </div>
      ${this.helperText
        ? html`<p class="helper ${this.error ? 'helper--error' : 'helper--normal'}" part="helper">${this.helperText}</p>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-text-field': UiTextField;
  }
}
