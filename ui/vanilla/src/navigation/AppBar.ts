import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIAppBar extends UIElement {
  static observedAttributes = ['position', 'color', 'elevation'];
  protected styles(): string {
    return `:host{display:block;position:var(--_position,relative);inset:var(--_inset,auto);z-index:var(--_z,auto)}:host([position=sticky]){--_position:sticky;--_inset:0 0 auto;--_z:20}:host([position=fixed]){--_position:fixed;--_inset:0 0 auto;--_z:20}header{display:flex;align-items:center;min-height:3.5rem;padding:0 1rem;color:var(--ui-color-text);background:var(--ui-color-surface);border-bottom:1px solid var(--ui-color-border,#cbd5e1)}:host([color=primary]) header{background:var(--ui-color-primary,#4f46e5);color:#fff}:host([elevation]) header{box-shadow:0 4px 16px rgb(0 0 0/.2)}`;
  }
  protected template(): string { return `<header><slot></slot></header>`; }
}

export class UIToolbar extends UIElement {
  protected styles(): string { return `:host{display:flex;align-items:center;gap:.75rem;width:100%;min-height:3rem}::slotted([data-spacer]){margin-inline-start:auto}`; }
  protected template(): string { return `<slot></slot>`; }
}

register('ui-app-bar', UIAppBar);
register('ui-toolbar', UIToolbar);
