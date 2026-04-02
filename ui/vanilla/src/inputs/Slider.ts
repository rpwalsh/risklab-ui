import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-slider>` — Range slider.
 *
 * @attr {number} min - Minimum value (default: 0)
 * @attr {number} max - Maximum value (default: 100)
 * @attr {number} step - Step size (default: 1)
 * @attr {number} value - Current value (default: 50)
 * @attr {boolean} disabled
 * @attr {string} size - sm | md | lg
 * @attr {string} color - primary | secondary | …
 *
 * @fires ui-input - { value: number } — continuous
 * @fires ui-change - { value: number } — on release
 */
export class UISlider extends UIElement {
  static observedAttributes = ['min', 'max', 'step', 'value', 'disabled', 'size', 'color'];

  get value(): number { return this.getNumAttr('value', 50); }
  set value(v: number) { this.setAttribute('value', String(v)); }

  protected styles(): string {
    return /* css */ `
      :host { display: block; }
      :host([disabled]) { opacity: 0.5; pointer-events: none; }

      input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        background: transparent;
        cursor: pointer;
      }

      /* Track */
      input[type="range"]::-webkit-slider-runnable-track {
        height: var(--_track-h, 6px);
        background: var(--ui-color-border, #e2e8f0);
        border-radius: var(--ui-radius-full, 9999px);
      }
      input[type="range"]::-moz-range-track {
        height: var(--_track-h, 6px);
        background: var(--ui-color-border, #e2e8f0);
        border-radius: var(--ui-radius-full, 9999px);
      }

      /* Thumb */
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: var(--_thumb-sz, 18px);
        height: var(--_thumb-sz, 18px);
        border-radius: 50%;
        background: var(--_sl-color, var(--ui-color-primary, #4f46e5));
        margin-top: calc((var(--_track-h, 6px) - var(--_thumb-sz, 18px)) / 2);
        box-shadow: 0 1px 3px rgba(0,0,0,.2);
        transition: transform 0.1s;
      }
      input[type="range"]::-moz-range-thumb {
        width: var(--_thumb-sz, 18px);
        height: var(--_thumb-sz, 18px);
        border: none;
        border-radius: 50%;
        background: var(--_sl-color, var(--ui-color-primary, #4f46e5));
        box-shadow: 0 1px 3px rgba(0,0,0,.2);
      }

      /* Sizes */
      :host([size="sm"]) input { --_track-h: 4px; --_thumb-sz: 14px; }
      :host([size="md"]) input, input { --_track-h: 6px; --_thumb-sz: 18px; }
      :host([size="lg"]) input { --_track-h: 8px; --_thumb-sz: 22px; }

      :host([color="primary"])   input { --_sl-color: var(--ui-color-primary); }
      :host([color="secondary"]) input { --_sl-color: var(--ui-color-secondary); }
      :host([color="success"])   input { --_sl-color: var(--ui-color-success); }
      :host([color="error"])     input { --_sl-color: var(--ui-color-error); }

      input:focus-visible { outline: 2px solid var(--ui-color-primary); outline-offset: 4px; }
    `;
  }

  protected template(): string {
    const min = this.getNumAttr('min', 0);
    const max = this.getNumAttr('max', 100);
    const step = this.getNumAttr('step', 1);
    const value = this.getNumAttr('value', 50);
    const disabled = this.getBoolAttr('disabled');

    return `
      <input
        type="range"
        min="${min}" max="${max}" step="${step}" value="${value}"
        ${disabled ? 'disabled' : ''}
        part="input"
      />
    `;
  }

  protected onRendered(): void {
    const input = this.$<HTMLInputElement>('input');
    if (!input) return;
    input.addEventListener('input', () => {
      this.emit('ui-input', { value: Number(input.value) });
    });
    input.addEventListener('change', () => {
      this.emit('ui-change', { value: Number(input.value) });
    });
  }
}

register('ui-slider', UISlider);
