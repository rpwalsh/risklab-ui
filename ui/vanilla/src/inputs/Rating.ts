import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIRating extends UIElement {
  static observedAttributes = ['value', 'max', 'label', 'readonly', 'disabled'];
  protected styles(): string { return `:host{display:inline-grid;gap:.25rem}.stars{display:flex;gap:.15rem}button{all:unset;cursor:pointer;font-size:1.4rem;line-height:1;color:var(--ui-color-border,#cbd5e1)}button.on{color:var(--ui-color-warning,#f59e0b)}button:focus-visible{outline:2px solid var(--ui-color-primary,#4f46e5);outline-offset:2px}button:disabled{cursor:default}small{color:var(--ui-color-text-secondary,#64748b)}`; }
  protected template(): string { const value = this.getNumAttr('value', 0); const max = this.getNumAttr('max', 5); return `<span class="stars" role="radiogroup" aria-label="${this.getAttr('label', 'Rating')}">${Array.from({ length: max }, (_, index) => `<button type="button" class="${index < value ? 'on' : ''}" role="radio" aria-checked="${index + 1 === value}" data-value="${index + 1}" ${this.getBoolAttr('readonly') || this.getBoolAttr('disabled') ? 'disabled' : ''}>★</button>`).join('')}</span><small>${value} of ${max}</small>`; }
  protected onRendered(): void { this.$$<HTMLButtonElement>('button').forEach((button) => button.addEventListener('click', () => { const value = Number(button.dataset.value); this.setAttribute('value', String(value)); this.emit('ui-change', { value }); })); }
}

register('ui-rating', UIRating);
