import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UITreeItem extends UIElement {
  static observedAttributes = ['label', 'expanded', 'selected', 'disabled', 'value'];
  protected styles(): string { return `:host{display:block}.row{display:flex;align-items:center;gap:.35rem;min-height:2rem;padding:.25rem .4rem;border-radius:.3rem;cursor:pointer}:host([selected]) .row{color:var(--ui-color-primary,#4f46e5);background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 12%,transparent)}:host([disabled]){opacity:.45;pointer-events:none}.toggle{all:unset;width:1rem;text-align:center}.children{margin-left:1.2rem}:host(:not([expanded])) .children{display:none}`; }
  protected template(): string { const hasChildren = this.children.length > 0; return `<div class="row" role="treeitem" tabindex="0" aria-expanded="${hasChildren ? this.getBoolAttr('expanded') : ''}" aria-selected="${this.getBoolAttr('selected')}"><button class="toggle" type="button" aria-label="Toggle children">${hasChildren ? (this.getBoolAttr('expanded') ? '▾' : '▸') : '·'}</button><span>${this.getAttr('label')}<slot name="label"></slot></span></div><div class="children" role="group"><slot></slot></div>`; }
  protected onRendered(): void { const activate = () => { this.toggleAttribute('selected', true); this.emit('ui-select', { value: this.getAttr('value') }); }; this.$('.row')?.addEventListener('click', activate); this.$('.toggle')?.addEventListener('click', (event) => { event.stopPropagation(); this.toggleAttribute('expanded'); this.emit('ui-toggle', { value: this.getAttr('value'), expanded: this.getBoolAttr('expanded') }); }); }
}
export class UITreeView extends UIElement { static observedAttributes = ['label']; protected template(): string { return `<div role="tree" aria-label="${this.getAttr('label', 'Tree')}"><slot></slot></div>`; } }
register('ui-tree-item', UITreeItem);
register('ui-tree-view', UITreeView);
