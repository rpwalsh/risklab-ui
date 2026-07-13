import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIIconButton extends UIElement {
  static observedAttributes = ['label', 'size', 'variant', 'color', 'disabled', 'loading'];
  protected styles(): string { return `:host{display:inline-flex}button{all:unset;display:grid;place-items:center;width:var(--_size,2.5rem);height:var(--_size,2.5rem);border-radius:50%;cursor:pointer;color:var(--_color,var(--ui-color-text));background:var(--_bg,transparent);border:1px solid var(--_border,transparent)}:host([size=sm]){--_size:2rem}:host([size=lg]){--_size:3rem}:host([variant=filled]){--_bg:var(--ui-color-primary,#4f46e5);--_color:#fff}:host([variant=outlined]){--_border:var(--ui-color-border,#cbd5e1)}button:hover{background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 12%,var(--_bg,transparent))}button:focus-visible{outline:2px solid var(--ui-color-primary,#4f46e5);outline-offset:2px}button:disabled{opacity:.45;cursor:not-allowed}`; }
  protected template(): string { return `<button type="button" aria-label="${this.getAttr('label', 'Action')}" ${this.getBoolAttr('disabled') ? 'disabled' : ''}><slot></slot></button>`; }
}

register('ui-icon-button', UIIconButton);
