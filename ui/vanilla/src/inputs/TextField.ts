import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-text-field>` — Text input with label, helper text, and validation.
 *
 * @attr {string} variant - outlined | filled | underlined (default: outlined)
 * @attr {string} size - xs | sm | md | lg | xl (default: md)
 * @attr {string} label - Input label
 * @attr {string} placeholder - Placeholder text
 * @attr {string} value - Current value
 * @attr {string} type - Input type (text, password, email, number, etc.)
 * @attr {string} helper-text - Help text below the input
 * @attr {boolean} disabled - Disables the field
 * @attr {boolean} readonly - Makes the field read-only
 * @attr {boolean} error - Shows error state
 * @attr {boolean} required - Marks field as required
 *
 * @fires ui-input - Fires on every keystroke with detail: { value: string }
 * @fires ui-change - Fires on blur with detail: { value: string }
 */
export class UITextField extends UIElement {
  static observedAttributes = [
    'variant', 'size', 'label', 'placeholder', 'value', 'type',
    'helper-text', 'disabled', 'readonly', 'error', 'required',
  ];

  get value(): string {
    const input = this.$<HTMLInputElement>('input');
    return input ? input.value : this.getAttr('value');
  }

  set value(v: string) {
    this.setAttribute('value', v);
    const input = this.$<HTMLInputElement>('input');
    if (input) input.value = v;
  }

  protected styles(): string {
    return /* css */ `
      :host { display: block; }

      .field { display: flex; flex-direction: column; gap: 0.25rem; }

      label {
        font-size: var(--ui-text-sm, 0.875rem);
        font-weight: var(--ui-weight-medium, 500);
        color: var(--ui-color-text, #0f172a);
      }
      :host([error]) label { color: var(--ui-color-error, #dc2626); }

      .input-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }

      input {
        width: 100%;
        font-family: inherit;
        color: var(--ui-color-text, #0f172a);
        background: var(--ui-color-surface, #fff);
        border: 1px solid var(--ui-color-border, #e2e8f0);
        border-radius: var(--ui-radius-md, 0.5rem);
        transition: border-color 0.15s, box-shadow 0.15s;
        outline: none;
      }

      /* Sizes */
      input.size-xs { padding: 0.25rem 0.5rem;   font-size: var(--ui-text-xs, 0.75rem); }
      input.size-sm { padding: 0.375rem 0.625rem; font-size: var(--ui-text-sm, 0.875rem); }
      input.size-md { padding: 0.5rem 0.75rem;    font-size: var(--ui-text-sm, 0.875rem); }
      input.size-lg { padding: 0.625rem 1rem;     font-size: var(--ui-text-base, 1rem); }
      input.size-xl { padding: 0.75rem 1.25rem;   font-size: var(--ui-text-lg, 1.125rem); }

      /* Variants */
      input.variant-outlined {
        background: transparent;
      }
      input.variant-filled {
        background: var(--ui-color-surface-variant, #f8fafc);
        border-color: transparent;
      }
      input.variant-underlined {
        border: none;
        border-bottom: 1px solid var(--ui-color-border, #e2e8f0);
        border-radius: 0;
        background: transparent;
      }

      /* States */
      input:focus {
        border-color: var(--ui-color-primary, #4f46e5);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-color-primary, #4f46e5) 15%, transparent);
      }
      input.variant-underlined:focus {
        box-shadow: none;
        border-bottom-color: var(--ui-color-primary, #4f46e5);
      }

      :host([error]) input {
        border-color: var(--ui-color-error, #dc2626);
      }
      :host([error]) input:focus {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-color-error, #dc2626) 15%, transparent);
      }

      :host([disabled]) input {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--ui-color-surface-variant, #f8fafc);
      }

      .helper {
        font-size: var(--ui-text-xs, 0.75rem);
        color: var(--ui-color-text-secondary, #64748b);
        margin: 0;
      }
      :host([error]) .helper { color: var(--ui-color-error, #dc2626); }
    `;
  }

  protected template(): string {
    const variant = this.getAttr('variant', 'outlined');
    const size = this.getAttr('size', 'md');
    const label = this.getAttr('label');
    const placeholder = this.getAttr('placeholder');
    const value = this.getAttr('value');
    const type = this.getAttr('type', 'text');
    const helperText = this.getAttr('helper-text');
    const disabled = this.getBoolAttr('disabled');
    const readonly = this.getBoolAttr('readonly');
    const required = this.getBoolAttr('required');

    return `
      <div class="field" part="field">
        ${label ? `<label for="control" part="label">${label}${required ? ' <span aria-hidden="true">*</span>' : ''}</label>` : ''}
        <div class="input-wrap">
          <input
            id="control"
            class="variant-${variant} size-${size}"
            type="${type}"
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${value ? `value="${value}"` : ''}
            ${disabled ? 'disabled' : ''}
            ${readonly ? 'readonly' : ''}
            ${required ? 'required' : ''}
            part="input"
          />
        </div>
        ${helperText ? `<p class="helper" part="helper">${helperText}</p>` : ''}
      </div>
    `;
  }

  protected onRendered(): void {
    const input = this.$<HTMLInputElement>('input');
    if (!input) return;

    input.addEventListener('input', () => {
      this.emit('ui-input', { value: input.value });
    });
    input.addEventListener('change', () => {
      this.emit('ui-change', { value: input.value });
    });
  }
}

register('ui-text-field', UITextField);
