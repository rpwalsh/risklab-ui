import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * `<ui-checkbox>` — Accessible checkbox with label, indeterminate, size, color.
 *
 * @fires ui-change - On toggle (detail: { checked }).
 *
 * @example
 * ```html
 * <ui-checkbox label="Accept terms" color="primary"></ui-checkbox>
 * ```
 */
@customElement('ui-checkbox')
export class UiCheckbox extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.5em;
      font-family: var(--ui-font-family, inherit);
      cursor: pointer;
      user-select: none;
    }
    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .box {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--ui-checkbox-border, #d1d5db);
      border-radius: var(--ui-radius-sm, 0.25rem);
      background: transparent;
      transition: all 150ms;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    :host([size='xs']) .box { width: 14px; height: 14px; }
    :host([size='sm']) .box { width: 16px; height: 16px; }
    :host([size='md']) .box { width: 18px; height: 18px; }
    :host([size='lg']) .box { width: 22px; height: 22px; }
    :host([size='xl']) .box { width: 26px; height: 26px; }

    .box--checked, .box--indeterminate {
      background: var(--ui-checkbox-active, var(--ui-color-primary, #4f46e5));
      border-color: var(--ui-checkbox-active, var(--ui-color-primary, #4f46e5));
    }

    :host([color='secondary']) .box--checked,
    :host([color='secondary']) .box--indeterminate { --ui-checkbox-active: var(--ui-color-secondary, #7c3aed); }
    :host([color='success']) .box--checked,
    :host([color='success']) .box--indeterminate { --ui-checkbox-active: var(--ui-color-success, #16a34a); }
    :host([color='warning']) .box--checked,
    :host([color='warning']) .box--indeterminate { --ui-checkbox-active: var(--ui-color-warning, #d97706); }
    :host([color='error']) .box--checked,
    :host([color='error']) .box--indeterminate { --ui-checkbox-active: var(--ui-color-error, #dc2626); }
    :host([color='info']) .box--checked,
    :host([color='info']) .box--indeterminate { --ui-checkbox-active: var(--ui-color-info, #2563eb); }
    :host([color='neutral']) .box--checked,
    :host([color='neutral']) .box--indeterminate { --ui-checkbox-active: var(--ui-color-neutral, #64748b); }

    .icon {
      display: block;
      fill: none;
      stroke: #fff;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;
      top: 0;
      left: 0;
    }
    input:disabled { cursor: not-allowed; }

    .label-text {
      font-size: var(--ui-checkbox-font-size, 0.875rem);
    }
    :host([size='xs']) .label-text { font-size: 0.75rem; }
    :host([size='sm']) .label-text { font-size: 0.8125rem; }
    :host([size='lg']) .label-text { font-size: 1rem; }
    :host([size='xl']) .label-text { font-size: 1.125rem; }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String, reflect: true }) color: ColorVariant = 'primary';
  @property({ type: String }) label = '';

  @query('input') private _input!: HTMLInputElement;

  updated(changed: Map<string, unknown>): void {
    if (changed.has('indeterminate') && this._input) {
      this._input.indeterminate = this.indeterminate;
    }
  }

  private _toggle(e: Event) {
    if (this.disabled) return;
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = false;
    this.dispatchEvent(
      new CustomEvent('ui-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const boxClass = this.indeterminate
      ? 'box box--indeterminate'
      : this.checked
        ? 'box box--checked'
        : 'box';

    return html`
      <span class=${boxClass} part="box">
        ${this.checked && !this.indeterminate
          ? html`<svg class="icon" viewBox="0 0 24 24" width="70%" height="70%"><polyline points="20 6 9 17 4 12"/></svg>`
          : this.indeterminate
            ? html`<svg class="icon" viewBox="0 0 24 24" width="70%" height="70%"><line x1="5" y1="12" x2="19" y2="12"/></svg>`
            : nothing}
        <input
          type="checkbox"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          aria-checked=${this.indeterminate ? 'mixed' : this.checked}
          @change=${this._toggle}
        />
      </span>
      ${this.label ? html`<span class="label-text" part="label">${this.label}</span>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-checkbox': UiCheckbox;
  }
}
