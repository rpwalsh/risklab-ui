import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-checkbox>` — Checkbox with label support.
 *
 * @attr {boolean} checked
 * @attr {boolean} indeterminate
 * @attr {boolean} disabled
 * @attr {string} size - xs | sm | md | lg | xl
 * @attr {string} color - primary | secondary | success | error | …
 * @attr {string} label - Optional label text
 *
 * @fires ui-change - { checked: boolean }
 */
export class UICheckbox extends UIElement {
  static observedAttributes = ['checked', 'indeterminate', 'disabled', 'size', 'color', 'label'];

  get checked(): boolean { return this.getBoolAttr('checked'); }
  set checked(v: boolean) {
    if (v) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
  }

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; align-items: center; gap: var(--ui-space-2, 0.5rem); cursor: pointer; }
      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

      .box {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--ui-color-border-strong, #cbd5e1);
        border-radius: var(--ui-radius-sm, 0.25rem);
        transition: background 0.15s, border-color 0.15s;
        flex-shrink: 0;
      }
      .box.size-xs { width: 14px; height: 14px; }
      .box.size-sm { width: 16px; height: 16px; }
      .box.size-md { width: 18px; height: 18px; }
      .box.size-lg { width: 20px; height: 20px; }
      .box.size-xl { width: 24px; height: 24px; }

      .box.checked, .box.indeterminate {
        background: var(--_cb-color, var(--ui-color-primary, #4f46e5));
        border-color: var(--_cb-color, var(--ui-color-primary, #4f46e5));
      }

      .check { display: none; color: #fff; line-height: 1; font-size: 0.7em; }
      .box.checked .check { display: inline; }
      .box.indeterminate .dash { display: inline; }
      .dash { display: none; width: 60%; height: 2px; background: #fff; border-radius: 1px; }

      :host([color="primary"])   .box { --_cb-color: var(--ui-color-primary); }
      :host([color="secondary"]) .box { --_cb-color: var(--ui-color-secondary); }
      :host([color="success"])   .box { --_cb-color: var(--ui-color-success); }
      :host([color="error"])     .box { --_cb-color: var(--ui-color-error); }
      :host([color="warning"])   .box { --_cb-color: var(--ui-color-warning); }
      :host([color="info"])      .box { --_cb-color: var(--ui-color-info); }

      label { font-size: var(--ui-text-sm, 0.875rem); color: var(--ui-color-text, #0f172a); cursor: inherit; user-select: none; }

      /* Focus */
      :host(:focus-visible) .box {
        outline: 2px solid var(--ui-color-primary, #4f46e5);
        outline-offset: 2px;
      }
    `;
  }

  protected template(): string {
    const size = this.getAttr('size', 'md');
    const checked = this.getBoolAttr('checked');
    const indeterminate = this.getBoolAttr('indeterminate');
    const label = this.getAttr('label');
    const cls = `${size ? `size-${size}` : ''} ${checked ? 'checked' : ''} ${indeterminate && !checked ? 'indeterminate' : ''}`.trim();

    return `
      <span class="box ${cls}" part="box" role="checkbox" aria-checked="${indeterminate ? 'mixed' : String(checked)}" tabindex="0">
        <span class="check" aria-hidden="true">✓</span>
        <span class="dash" aria-hidden="true"></span>
      </span>
      ${label ? `<label part="label">${label}</label>` : '<slot></slot>'}
    `;
  }

  protected onConnected(): void {
    this.setAttribute('role', 'checkbox');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
  }

  protected onRendered(): void {
    const box = this.$('.box');
    const toggle = () => {
      if (this.getBoolAttr('disabled')) return;
      this.checked = !this.checked;
      this.removeAttribute('indeterminate');
      this.render();
      this.emit('ui-change', { checked: this.checked });
    };
    box?.addEventListener('click', toggle);
    box?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === ' ' || (e as KeyboardEvent).key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    });
  }
}

register('ui-checkbox', UICheckbox);
