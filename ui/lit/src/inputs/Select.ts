import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { SizeVariant, SelectOptionData } from '../core/types';

/**
 * `<ui-select>` — Native-style select with label, helper, error state.
 * Accepts `options` property (array) or light-DOM `<option>` children.
 *
 * @fires ui-change - On selection change (detail: { value }).
 *
 * @example
 * ```html
 * <ui-select label="Country" placeholder="Pick one"
 *   .options=${[{ value: 'us', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }]}>
 * </ui-select>
 * ```
 */
@customElement('ui-select')
export class UiSelect extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-family: var(--ui-font-family, inherit);
    }

    .label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--ui-color-text, #374151);
    }

    select {
      height: var(--ui-sel-height, 2.5rem);
      padding: 0 2rem 0 0.75rem;
      font-size: var(--ui-sel-font-size, 0.875rem);
      font-family: inherit;
      background-color: var(--ui-sel-bg, transparent);
      border: 1px solid var(--ui-sel-border, #d1d5db);
      border-radius: var(--ui-sel-radius, 0.375rem);
      color: inherit;
      outline: none;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
      transition: border-color 150ms;
      box-sizing: border-box;
      width: 100%;
    }

    :host([size='xs']) select { height: 1.5rem;  font-size: 0.75rem;   border-radius: 0.25rem; }
    :host([size='sm']) select { height: 2rem;    font-size: 0.8125rem; border-radius: 0.3125rem; }
    :host([size='lg']) select { height: 3rem;    font-size: 1rem;      border-radius: 0.5rem; }
    :host([size='xl']) select { height: 3.5rem;  font-size: 1.125rem;  border-radius: 0.625rem; }

    select:focus {
      border-color: var(--ui-color-primary, #4f46e5);
      box-shadow: 0 0 0 1px var(--ui-color-primary, #4f46e5);
    }

    :host([error]) select {
      border-color: var(--ui-color-error, #dc2626);
    }
    :host([error]) select:focus {
      border-color: var(--ui-color-error, #dc2626);
      box-shadow: 0 0 0 1px var(--ui-color-error, #dc2626);
    }

    select:disabled { opacity: 0.5; cursor: not-allowed; }

    .helper { font-size: 0.75rem; margin: 0; }
    .helper--error { color: var(--ui-color-error, #dc2626); }
    .helper--normal { color: var(--ui-color-text-secondary, #6b7280); }
  `;

  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) error = false;
  @property({ type: String }) helperText = '';
  @property({ type: String }) value = '';
  @property({ type: Array }) options: SelectOptionData[] = [];

  @query('select') private _select!: HTMLSelectElement;

  private _uniqueId = `ui-select-${Math.random().toString(36).slice(2, 9)}`;

  private _onChange() {
    this.value = this._select.value;
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
      <select
        id=${this._uniqueId}
        .value=${this.value}
        ?disabled=${this.disabled}
        aria-invalid=${this.error}
        @change=${this._onChange}
        part="select"
      >
        ${this.placeholder
          ? html`<option value="" disabled ?selected=${!this.value}>${this.placeholder}</option>`
          : nothing}
        ${this.options.map(
          (opt) =>
            html`<option
              value=${opt.value}
              ?disabled=${opt.disabled ?? false}
              ?selected=${opt.value === this.value}
            >${opt.label}</option>`,
        )}
      </select>
      ${this.helperText
        ? html`<p class="helper ${this.error ? 'helper--error' : 'helper--normal'}" part="helper">${this.helperText}</p>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-select': UiSelect;
  }
}
