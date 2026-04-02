import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-select>` — Dropdown select component.
 *
 * @attr {string} size - xs | sm | md | lg | xl
 * @attr {string} label - Select label
 * @attr {string} placeholder - Placeholder text
 * @attr {string} value - Currently selected value
 * @attr {string} helper-text - Help text below the select
 * @attr {boolean} disabled
 * @attr {boolean} error
 * @attr {boolean} multiple
 *
 * @fires ui-change - { value: string }
 *
 * @example
 * ```html
 * <ui-select label="Country" placeholder="Choose…">
 *   <option value="us">United States</option>
 *   <option value="uk">United Kingdom</option>
 * </ui-select>
 * ```
 */
export class UISelect extends UIElement {
  static observedAttributes = [
    'size', 'label', 'placeholder', 'value', 'helper-text',
    'disabled', 'error', 'multiple',
  ];

  get value(): string {
    const sel = this.$<HTMLSelectElement>('select');
    return sel ? sel.value : this.getAttr('value');
  }

  set value(v: string) {
    this.setAttribute('value', v);
    const sel = this.$<HTMLSelectElement>('select');
    if (sel) sel.value = v;
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

      select {
        width: 100%;
        font-family: inherit;
        color: var(--ui-color-text, #0f172a);
        background: var(--ui-color-surface, #fff);
        border: 1px solid var(--ui-color-border, #e2e8f0);
        border-radius: var(--ui-radius-md, 0.5rem);
        outline: none;
        cursor: pointer;
        transition: border-color 0.15s;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M3 4.5L6 7.5L9 4.5'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        padding-right: 2.5rem;
      }

      select.size-xs { padding: 0.25rem 0.5rem;   font-size: var(--ui-text-xs); }
      select.size-sm { padding: 0.375rem 0.625rem; font-size: var(--ui-text-sm); }
      select.size-md { padding: 0.5rem 0.75rem;    font-size: var(--ui-text-sm); }
      select.size-lg { padding: 0.625rem 1rem;     font-size: var(--ui-text-base); }
      select.size-xl { padding: 0.75rem 1.25rem;   font-size: var(--ui-text-lg); }

      select:focus {
        border-color: var(--ui-color-primary, #4f46e5);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-color-primary) 15%, transparent);
      }

      :host([error]) select { border-color: var(--ui-color-error, #dc2626); }
      :host([disabled]) select { opacity: 0.5; cursor: not-allowed; }

      .helper {
        font-size: var(--ui-text-xs, 0.75rem);
        color: var(--ui-color-text-secondary, #64748b);
        margin: 0;
      }
      :host([error]) .helper { color: var(--ui-color-error); }
    `;
  }

  protected template(): string {
    const size = this.getAttr('size', 'md');
    const label = this.getAttr('label');
    const placeholder = this.getAttr('placeholder');
    const value = this.getAttr('value');
    const helperText = this.getAttr('helper-text');
    const disabled = this.getBoolAttr('disabled');
    const multiple = this.getBoolAttr('multiple');

    // Read <option> children from light DOM
    const options = Array.from(this.querySelectorAll('option'))
      .map(
        (opt) =>
          `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''}>${opt.textContent}</option>`,
      )
      .join('');

    return `
      <div class="field" part="field">
        ${label ? `<label part="label">${label}</label>` : ''}
        <select
          class="size-${size}"
          ${disabled ? 'disabled' : ''}
          ${multiple ? 'multiple' : ''}
          part="select"
        >
          ${placeholder ? `<option value="" disabled selected hidden>${placeholder}</option>` : ''}
          ${options}
        </select>
        ${helperText ? `<p class="helper" part="helper">${helperText}</p>` : ''}
      </div>
    `;
  }

  protected onRendered(): void {
    this.$<HTMLSelectElement>('select')?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.emit('ui-change', { value: target.value });
    });
  }
}

register('ui-select', UISelect);
