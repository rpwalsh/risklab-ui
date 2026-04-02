import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * `<ui-switch>` — Toggle switch with smooth animation.
 *
 * @fires ui-change - On toggle (detail: { checked }).
 *
 * @example
 * ```html
 * <ui-switch label="Dark mode" color="primary" checked></ui-switch>
 * ```
 */
@customElement('ui-switch')
export class UiSwitch extends LitElement {
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

    .track {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: var(--ui-sw-track-w, 2.75rem);
      height: var(--ui-sw-track-h, 1.5rem);
      background-color: var(--ui-sw-bg, #d1d5db);
      border-radius: 9999px;
      transition: background-color 200ms;
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .track--checked {
      background-color: var(--ui-sw-active, var(--ui-color-primary, #4f46e5));
    }

    :host([color='secondary']) .track--checked { --ui-sw-active: var(--ui-color-secondary, #7c3aed); }
    :host([color='success'])   .track--checked { --ui-sw-active: var(--ui-color-success, #16a34a); }
    :host([color='warning'])   .track--checked { --ui-sw-active: var(--ui-color-warning, #d97706); }
    :host([color='error'])     .track--checked { --ui-sw-active: var(--ui-color-error, #dc2626); }
    :host([color='info'])      .track--checked { --ui-sw-active: var(--ui-color-info, #2563eb); }
    :host([color='neutral'])   .track--checked { --ui-sw-active: var(--ui-color-neutral, #64748b); }

    .thumb {
      position: absolute;
      width: var(--ui-sw-thumb, 1.125rem);
      height: var(--ui-sw-thumb, 1.125rem);
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 200ms;
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
    }
    .thumb--checked {
      transform: translateY(-50%) translateX(calc(var(--ui-sw-track-w, 2.75rem) - var(--ui-sw-thumb, 1.125rem) - 4px));
    }

    /* Sizes */
    :host([size='xs']) { --ui-sw-track-w: 1.75rem; --ui-sw-track-h: 1rem;    --ui-sw-thumb: 0.75rem;   font-size: 0.75rem; }
    :host([size='sm']) { --ui-sw-track-w: 2.25rem; --ui-sw-track-h: 1.25rem; --ui-sw-thumb: 0.9375rem; font-size: 0.8125rem; }
    :host([size='md']) { --ui-sw-track-w: 2.75rem; --ui-sw-track-h: 1.5rem;  --ui-sw-thumb: 1.125rem;  font-size: 0.875rem; }
    :host([size='lg']) { --ui-sw-track-w: 3.25rem; --ui-sw-track-h: 1.75rem; --ui-sw-thumb: 1.375rem;  font-size: 1rem; }
    :host([size='xl']) { --ui-sw-track-w: 3.75rem; --ui-sw-track-h: 2rem;    --ui-sw-thumb: 1.625rem;  font-size: 1.125rem; }

    input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;
      top: 0;
      left: 0;
      z-index: 1;
    }
    input:disabled { cursor: not-allowed; }

    .label-text {
      font-size: inherit;
    }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String, reflect: true }) color: ColorVariant = 'primary';
  @property({ type: String }) label = '';

  private _toggle(e: Event) {
    if (this.disabled) return;
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.dispatchEvent(
      new CustomEvent('ui-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <span class="track ${this.checked ? 'track--checked' : ''}" part="track">
        <span class="thumb ${this.checked ? 'thumb--checked' : ''}" part="thumb"></span>
        <input
          type="checkbox"
          role="switch"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          aria-checked=${this.checked}
          @change=${this._toggle}
        />
      </span>
      ${this.label ? html`<span class="label-text" part="label">${this.label}</span>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-switch': UiSwitch;
  }
}
