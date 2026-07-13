import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIBackdrop extends UIElement {
  static observedAttributes = ['open', 'blur', 'invisible'];
  protected styles(): string { return `:host{display:none;position:fixed;inset:0;z-index:100}:host([open]){display:grid;place-items:center}.backdrop{position:absolute;inset:0;background:rgb(2 6 23/.62);backdrop-filter:blur(var(--_blur,0))}:host([blur]){--_blur:4px}:host([invisible]) .backdrop{background:transparent}.content{position:relative;z-index:1}`; }
  protected template(): string { return `<div class="backdrop" part="backdrop"></div><div class="content"><slot></slot></div>`; }
  protected onRendered(): void { this.$('.backdrop')?.addEventListener('click', () => this.emit('ui-dismiss')); }
}

register('ui-backdrop', UIBackdrop);
