import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * `<ui-slider>` — Range slider with min/max/step/value/disabled.
 *
 * @fires ui-input - On every movement (detail: { value }).
 *
 * @example
 * ```html
 * <ui-slider min="0" max="100" step="1" value="50" color="primary"></ui-slider>
 * ```
 */
@customElement('ui-slider')
export class UiSlider extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-family: var(--ui-font-family, inherit);
      width: 100%;
    }

    input[type='range'] {
      width: 100%;
      height: var(--ui-slider-thumb, 16px);
      appearance: none;
      background: transparent;
      cursor: pointer;
      outline: none;
      margin: 0;
      padding: 0;
    }
    input[type='range']:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* WebKit track */
    input[type='range']::-webkit-slider-runnable-track {
      height: var(--ui-slider-track-h, 4px);
      background: var(--ui-color-border, #e2e8f0);
      border-radius: 9999px;
    }
    /* WebKit thumb */
    input[type='range']::-webkit-slider-thumb {
      appearance: none;
      width: var(--ui-slider-thumb, 16px);
      height: var(--ui-slider-thumb, 16px);
      border-radius: 50%;
      background: var(--ui-slider-color, var(--ui-color-primary, #4f46e5));
      border: 2px solid #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      margin-top: calc((var(--ui-slider-track-h, 4px) - var(--ui-slider-thumb, 16px)) / 2);
      cursor: pointer;
    }

    /* Firefox track */
    input[type='range']::-moz-range-track {
      height: var(--ui-slider-track-h, 4px);
      background: var(--ui-color-border, #e2e8f0);
      border-radius: 9999px;
      border: none;
    }
    /* Firefox progress (filled portion) */
    input[type='range']::-moz-range-progress {
      height: var(--ui-slider-track-h, 4px);
      background: var(--ui-slider-color, var(--ui-color-primary, #4f46e5));
      border-radius: 9999px;
    }
    /* Firefox thumb */
    input[type='range']::-moz-range-thumb {
      width: var(--ui-slider-thumb, 16px);
      height: var(--ui-slider-thumb, 16px);
      border-radius: 50%;
      background: var(--ui-slider-color, var(--ui-color-primary, #4f46e5));
      border: 2px solid #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      cursor: pointer;
    }

    /* Sizes */
    :host([size='xs']) { --ui-slider-track-h: 2px; --ui-slider-thumb: 12px; }
    :host([size='sm']) { --ui-slider-track-h: 3px; --ui-slider-thumb: 14px; }
    :host([size='md']) { --ui-slider-track-h: 4px; --ui-slider-thumb: 16px; }
    :host([size='lg']) { --ui-slider-track-h: 6px; --ui-slider-thumb: 20px; }
    :host([size='xl']) { --ui-slider-track-h: 8px; --ui-slider-thumb: 24px; }

    /* Colors */
    :host([color='secondary']) { --ui-slider-color: var(--ui-color-secondary, #7c3aed); }
    :host([color='success'])   { --ui-slider-color: var(--ui-color-success, #16a34a); }
    :host([color='warning'])   { --ui-slider-color: var(--ui-color-warning, #d97706); }
    :host([color='error'])     { --ui-slider-color: var(--ui-color-error, #dc2626); }
    :host([color='info'])      { --ui-slider-color: var(--ui-color-info, #2563eb); }
    :host([color='neutral'])   { --ui-slider-color: var(--ui-color-neutral, #64748b); }
  `;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) value = 50;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String, reflect: true }) color: ColorVariant = 'primary';

  @query('input') private _input!: HTMLInputElement;

  private _onInput() {
    this.value = Number(this._input.value);
    this.dispatchEvent(
      new CustomEvent('ui-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <input
        type="range"
        .min=${String(this.min)}
        .max=${String(this.max)}
        .step=${String(this.step)}
        .value=${String(this.value)}
        ?disabled=${this.disabled}
        aria-valuenow=${this.value}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        @input=${this._onInput}
        part="input"
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-slider': UiSlider;
  }
}
