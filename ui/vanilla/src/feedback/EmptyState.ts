import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIEmptyState extends UIElement {
  static observedAttributes = ['title', 'description', 'compact'];
  protected styles(): string { return `:host{display:grid;place-items:center;text-align:center;padding:var(--_padding,2.5rem);border:1px dashed var(--ui-color-border,#cbd5e1);border-radius:var(--ui-radius-lg,.75rem)}:host([compact]){--_padding:1rem}.wrap{display:grid;gap:.55rem;justify-items:center;max-width:30rem}.icon{font-size:1.75rem;color:var(--ui-color-text-secondary,#64748b)}h3,p{margin:0}p{color:var(--ui-color-text-secondary,#64748b);font-size:.875rem}.actions{margin-top:.5rem}`; }
  protected template(): string { return `<div class="wrap"><div class="icon"><slot name="icon">◇</slot></div><h3>${this.getAttr('title')}</h3><p>${this.getAttr('description')}</p><div class="actions"><slot></slot></div></div>`; }
}

register('ui-empty-state', UIEmptyState);
