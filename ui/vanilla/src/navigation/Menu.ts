import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIMenuItem extends UIElement {
  static observedAttributes = ['disabled', 'selected', 'value'];
  protected styles(): string { return `:host{display:block}.item{display:flex;align-items:center;gap:.625rem;min-height:2.5rem;padding:.45rem .75rem;cursor:pointer;border-radius:var(--ui-radius-sm,.25rem);font-size:.875rem}.item:hover,.item:focus-visible{outline:0;background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 10%,transparent)}:host([selected]) .item{color:var(--ui-color-primary,#4f46e5);background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 14%,transparent)}:host([disabled]) .item{opacity:.45;pointer-events:none}`; }
  protected template(): string { return `<div class="item" role="menuitem" tabindex="${this.getBoolAttr('disabled') ? '-1' : '0'}" aria-disabled="${this.getBoolAttr('disabled')}"><slot></slot></div>`; }
  protected onRendered(): void {
    const activate = () => this.emit('ui-select', { value: this.getAttr('value') });
    this.$('.item')?.addEventListener('click', activate);
    this.$('.item')?.addEventListener('keydown', (event) => { if ((event as KeyboardEvent).key === 'Enter' || (event as KeyboardEvent).key === ' ') activate(); });
  }
}

export class UIMenu extends UIElement {
  static observedAttributes = ['open', 'label'];
  protected styles(): string { return `:host{display:inline-block;position:relative}.menu{position:absolute;z-index:50;inset:calc(100% + .25rem) auto auto 0;min-width:12rem;padding:.25rem;color:var(--ui-color-text);background:var(--ui-color-surface);border:1px solid var(--ui-color-border,#cbd5e1);border-radius:var(--ui-radius-md,.5rem);box-shadow:0 14px 34px rgb(0 0 0/.24)}:host(:not([open])) .menu{display:none}`; }
  protected template(): string { return `<div class="menu" role="menu" aria-label="${this.getAttr('label', 'Menu')}"><slot></slot></div>`; }
  protected onRendered(): void {
    this.addEventListener('ui-select', () => { this.removeAttribute('open'); });
    const items = this.$$<HTMLElement>('slot');
    void items;
  }
}

register('ui-menu-item', UIMenuItem);
register('ui-menu', UIMenu);
