import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UINumberInput extends UIElement {
  static observedAttributes = ['label', 'value', 'min', 'max', 'step', 'precision', 'disabled', 'readonly', 'helper-text'];
  protected styles(): string { return `:host{display:inline-grid;gap:.375rem}label{font-size:.875rem;font-weight:600}.control{display:flex;border:1px solid var(--ui-color-border,#cbd5e1);border-radius:var(--ui-radius-md,.5rem);overflow:hidden;background:var(--ui-color-surface)}input{width:7rem;min-width:0;padding:.55rem .65rem;border:0;outline:0;background:transparent;color:var(--ui-color-text);font:inherit;text-align:right}button{width:2.25rem;border:0;background:transparent;color:var(--ui-color-text);cursor:pointer;font-size:1rem}button:hover{background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 10%,transparent)}button:disabled{opacity:.45;cursor:not-allowed}small{color:var(--ui-color-text-secondary,#64748b)}`; }
  protected template(): string { return `<label>${this.getAttr('label')}</label><div class="control"><button class="dec" type="button" aria-label="Decrease" ${this.getBoolAttr('disabled') || this.getBoolAttr('readonly') ? 'disabled' : ''}>−</button><input type="number" value="${this.getNumAttr('value', 0)}" min="${this.getAttr('min')}" max="${this.getAttr('max')}" step="${this.getNumAttr('step', 1)}" ${this.getBoolAttr('disabled') ? 'disabled' : ''} ${this.getBoolAttr('readonly') ? 'readonly' : ''}/><button class="inc" type="button" aria-label="Increase" ${this.getBoolAttr('disabled') || this.getBoolAttr('readonly') ? 'disabled' : ''}>+</button></div><small>${this.getAttr('helper-text')}</small>`; }
  protected onRendered(): void {
    const input = this.$<HTMLInputElement>('input');
    const update = (next: number) => { const min = this.getNumAttr('min', -Infinity); const max = this.getNumAttr('max', Infinity); const precision = this.getNumAttr('precision', 0); const value = Math.min(max, Math.max(min, next)); const formatted = value.toFixed(precision); this.setAttribute('value', formatted); this.emit('ui-change', { value: Number(formatted) }); };
    this.$('.dec')?.addEventListener('click', () => update((input?.valueAsNumber || 0) - this.getNumAttr('step', 1)));
    this.$('.inc')?.addEventListener('click', () => update((input?.valueAsNumber || 0) + this.getNumAttr('step', 1)));
    input?.addEventListener('change', () => update(input.valueAsNumber));
  }
}

register('ui-number-input', UINumberInput);
