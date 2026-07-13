import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIPopover extends UIElement {
  static observedAttributes = ['open', 'placement', 'label'];
  protected styles(): string {
    return `:host{display:inline-block;position:relative}.surface{position:absolute;z-index:50;min-width:14rem;padding:.75rem;color:var(--ui-color-text);background:var(--ui-color-surface);border:1px solid var(--ui-color-border,#cbd5e1);border-radius:var(--ui-radius-md,.5rem);box-shadow:0 16px 38px rgb(0 0 0/.24)}:host(:not([open])) .surface{display:none}:host(:not([placement])) .surface,:host([placement=bottom-start]) .surface{inset:calc(100% + .4rem) auto auto 0}:host([placement=bottom-end]) .surface{inset:calc(100% + .4rem) 0 auto auto}:host([placement=top]) .surface{inset:auto auto calc(100% + .4rem) 50%;transform:translateX(-50%)}:host([placement=right]) .surface{inset:50% auto auto calc(100% + .4rem);transform:translateY(-50%)}`;
  }
  protected template(): string { return `<slot name="anchor"></slot><div class="surface" role="dialog" aria-label="${this.getAttr('label', 'Popover')}"><slot></slot></div>`; }
}

register('ui-popover', UIPopover);
