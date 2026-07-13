import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export interface AutocompleteOption { value: string; label: string; description?: string; }

export class UIAutocomplete extends UIElement {
  static observedAttributes = ['label', 'placeholder', 'value', 'disabled', 'options'];
  private _options: AutocompleteOption[] = [];
  private open = false;
  private activeIndex = -1;

  set options(value: AutocompleteOption[]) { this._options = Array.isArray(value) ? value : []; this.render(); }
  get options(): AutocompleteOption[] {
    if (this._options.length) return this._options;
    try { return JSON.parse(this.getAttr('options', '[]')) as AutocompleteOption[]; } catch { return []; }
  }

  protected styles(): string {
    return `
      :host { display:block; position:relative; }
      label { display:grid; gap:.375rem; font-size:var(--ui-text-sm,.875rem); }
      input { width:100%; padding:.625rem .75rem; color:var(--ui-color-text); background:var(--ui-color-surface); border:1px solid var(--ui-color-border,#cbd5e1); border-radius:var(--ui-radius-md,.5rem); font:inherit; }
      input:focus { outline:2px solid color-mix(in srgb,var(--ui-color-primary,#4f46e5) 30%,transparent); border-color:var(--ui-color-primary,#4f46e5); }
      [role=listbox] { position:absolute; z-index:40; inset:calc(100% + .25rem) 0 auto; max-height:16rem; overflow:auto; padding:.25rem; background:var(--ui-color-surface); border:1px solid var(--ui-color-border,#cbd5e1); border-radius:var(--ui-radius-md,.5rem); box-shadow:0 12px 30px rgb(0 0 0/.22); }
      [role=option] { display:grid; gap:.1rem; padding:.55rem .65rem; border-radius:var(--ui-radius-sm,.25rem); cursor:pointer; }
      [role=option][aria-selected=true] { background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 14%,transparent); }
      small { color:var(--ui-color-text-secondary,#64748b); }
    `;
  }

  protected template(): string {
    return `<label><span>${this.getAttr('label')}</span><input role="combobox" aria-autocomplete="list" aria-expanded="${this.open}" placeholder="${this.getAttr('placeholder')}" value="${this.getAttr('value')}" ${this.getBoolAttr('disabled') ? 'disabled' : ''}/></label><div role="listbox" ${this.open ? '' : 'hidden'}></div>`;
  }

  private show(query = ''): void {
    this.open = true;
    const list = this.$<HTMLElement>('[role=listbox]');
    const filtered = this.options.filter((option) => `${option.label} ${option.description ?? ''}`.toLowerCase().includes(query.toLowerCase()));
    if (!list) return;
    list.hidden = false;
    list.innerHTML = filtered.map((option, index) => `<div role="option" tabindex="-1" data-value="${option.value}" aria-selected="${index === this.activeIndex}"><strong>${option.label}</strong>${option.description ? `<small>${option.description}</small>` : ''}</div>`).join('') || '<div role="option" aria-disabled="true">No results</div>';
    list.querySelectorAll<HTMLElement>('[data-value]').forEach((item) => item.addEventListener('mousedown', (event) => { event.preventDefault(); this.select(item.dataset.value ?? '', item.querySelector('strong')?.textContent ?? ''); }));
  }

  private select(value: string, label: string): void {
    this.setAttribute('value', label);
    this.open = false;
    this.$<HTMLElement>('[role=listbox]')!.hidden = true;
    this.emit('ui-change', { value, label });
  }

  protected onRendered(): void {
    const input = this.$<HTMLInputElement>('input');
    input?.addEventListener('focus', () => this.show(input.value));
    input?.addEventListener('input', () => { this.activeIndex = -1; this.show(input.value); this.emit('ui-input', { value: input.value }); });
    input?.addEventListener('blur', () => setTimeout(() => { this.open = false; const list = this.$<HTMLElement>('[role=listbox]'); if (list) list.hidden = true; }, 80));
    input?.addEventListener('keydown', (event) => {
      const items = Array.from(this.root.querySelectorAll<HTMLElement>('[data-value]'));
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); this.activeIndex = Math.max(0, Math.min(items.length - 1, this.activeIndex + (event.key === 'ArrowDown' ? 1 : -1))); this.show(input.value); }
      if (event.key === 'Enter' && this.activeIndex >= 0 && items[this.activeIndex]) { event.preventDefault(); const item = items[this.activeIndex]; this.select(item.dataset.value ?? '', item.querySelector('strong')?.textContent ?? ''); }
      if (event.key === 'Escape') { this.open = false; const list = this.$<HTMLElement>('[role=listbox]'); if (list) list.hidden = true; }
    });
  }
}

register('ui-autocomplete', UIAutocomplete);
