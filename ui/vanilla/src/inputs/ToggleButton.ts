import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIToggleButton extends UIElement {
  static observedAttributes = ['selected', 'disabled', 'value'];
  protected styles(): string { return `:host{display:inline-flex}button{all:unset;cursor:pointer;padding:.5rem .75rem;border:1px solid var(--ui-color-border,#cbd5e1);color:var(--ui-color-text);background:var(--ui-color-surface);font:inherit;font-size:.875rem}button[aria-pressed=true]{color:var(--ui-color-primary,#4f46e5);background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 15%,transparent);border-color:var(--ui-color-primary,#4f46e5)}button:focus-visible{outline:2px solid var(--ui-color-primary,#4f46e5);outline-offset:2px}button:disabled{opacity:.5;cursor:not-allowed}`; }
  protected template(): string { return `<button type="button" aria-pressed="${this.getBoolAttr('selected')}" ${this.getBoolAttr('disabled') ? 'disabled' : ''}><slot></slot></button>`; }
  protected onRendered(): void { this.$('button')?.addEventListener('click', () => { const selected = !this.getBoolAttr('selected'); this.toggleAttribute('selected', selected); this.emit('ui-change', { selected, value: this.getAttr('value') }); }); }
}

export class UIToggleButtonGroup extends UIElement {
  static observedAttributes = ['exclusive', 'value', 'orientation'];
  private handleChange = (event: Event) => {
    const target = event.target as UIToggleButton;
    if (!target.matches('ui-toggle-button')) return;
    if (this.getBoolAttr('exclusive')) {
      this.querySelectorAll('ui-toggle-button').forEach((item) => item.toggleAttribute('selected', item === target));
      this.setAttribute('value', target.getAttribute('value') ?? '');
    }
  };
  protected styles(): string { return `:host{display:inline-flex}:host([orientation=vertical]){display:inline-grid}::slotted(ui-toggle-button:not(:first-child)){margin-left:-1px}`; }
  protected template(): string { return `<div role="group"><slot></slot></div>`; }
  protected onConnected(): void { this.addEventListener('ui-change', this.handleChange); }
  protected onDisconnected(): void { this.removeEventListener('ui-change', this.handleChange); }
}

register('ui-toggle-button', UIToggleButton);
register('ui-toggle-button-group', UIToggleButtonGroup);
