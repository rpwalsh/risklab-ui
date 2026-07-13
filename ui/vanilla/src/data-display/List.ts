import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIListItem extends UIElement {
  static observedAttributes = ['selected', 'disabled', 'interactive', 'value'];
  protected styles(): string { return `:host{display:block}.item{display:flex;align-items:center;gap:.75rem;min-height:3rem;padding:.55rem .75rem;border-radius:var(--ui-radius-md,.5rem)}:host([interactive]) .item{cursor:pointer}:host([interactive]) .item:hover{background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 8%,transparent)}:host([selected]) .item{background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 14%,transparent);color:var(--ui-color-primary,#4f46e5)}:host([disabled]){opacity:.45;pointer-events:none}::slotted([slot=secondary]){margin-inline-start:auto;color:var(--ui-color-text-secondary,#64748b)}`; }
  protected template(): string { return `<div class="item" role="listitem" tabindex="${this.getBoolAttr('interactive') ? '0' : '-1'}"><slot name="leading"></slot><slot></slot><slot name="secondary"></slot></div>`; }
  protected onRendered(): void { if (this.getBoolAttr('interactive')) this.$('.item')?.addEventListener('click', () => this.emit('ui-select', { value: this.getAttr('value') })); }
}

export class UIList extends UIElement {
  static observedAttributes = ['dense', 'dividers', 'label'];
  protected styles(): string { return `:host{display:grid}:host([dividers]) ::slotted(ui-list-item:not(:last-child)){border-bottom:1px solid var(--ui-color-border,#cbd5e1)}:host([dense]) ::slotted(ui-list-item){--ui-list-min-height:2.25rem}`; }
  protected template(): string { return `<div role="list" aria-label="${this.getAttr('label', 'List')}"><slot></slot></div>`; }
}

register('ui-list-item', UIListItem);
register('ui-list', UIList);
