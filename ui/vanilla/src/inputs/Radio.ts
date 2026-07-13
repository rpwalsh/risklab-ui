import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIRadio extends UIElement {
  static observedAttributes = ['checked', 'disabled', 'value', 'name', 'label'];

  protected styles(): string {
    return `
      :host { display: inline-flex; }
      label { display:inline-flex; align-items:center; gap:.5rem; cursor:pointer; color:var(--ui-color-text); }
      input { width:1rem; height:1rem; margin:0; accent-color:var(--ui-color-primary,#4f46e5); }
      input:disabled + span { opacity:.5; cursor:not-allowed; }
      input:focus-visible { outline:2px solid var(--ui-color-primary,#4f46e5); outline-offset:2px; }
    `;
  }

  protected template(): string {
    return `<label><input type="radio" name="${this.getAttr('name')}" value="${this.getAttr('value')}"
      ${this.getBoolAttr('checked') ? 'checked' : ''} ${this.getBoolAttr('disabled') ? 'disabled' : ''} />
      <span>${this.getAttr('label')}<slot></slot></span></label>`;
  }

  protected onRendered(): void {
    this.$<HTMLInputElement>('input')?.addEventListener('change', (event) => {
      const input = event.currentTarget as HTMLInputElement;
      this.toggleAttribute('checked', input.checked);
      this.emit('ui-change', { checked: input.checked, value: input.value });
    });
  }
}

export class UIRadioGroup extends UIElement {
  static observedAttributes = ['label', 'value', 'disabled', 'orientation'];
  private handleChange = (event: Event) => {
    const radio = event.target as UIRadio;
    if (!radio.matches('ui-radio')) return;
    const value = radio.getAttribute('value') ?? '';
    this.setAttribute('value', value);
    this.querySelectorAll('ui-radio').forEach((item) => item.toggleAttribute('checked', item === radio));
    this.emit('ui-change', { value });
  };

  protected styles(): string {
    return `
      :host { display:grid; gap:.5rem; }
      fieldset { border:0; padding:0; margin:0; display:flex; gap:.75rem; flex-direction:column; }
      :host([orientation="horizontal"]) fieldset { flex-direction:row; flex-wrap:wrap; }
      legend { font-size:var(--ui-text-sm,.875rem); font-weight:600; margin-bottom:.5rem; }
    `;
  }

  protected template(): string {
    return `<fieldset ${this.getBoolAttr('disabled') ? 'disabled' : ''}><legend>${this.getAttr('label')}</legend><slot></slot></fieldset>`;
  }

  protected onConnected(): void { this.addEventListener('ui-change', this.handleChange); }
  protected onDisconnected(): void { this.removeEventListener('ui-change', this.handleChange); }
}

register('ui-radio', UIRadio);
register('ui-radio-group', UIRadioGroup);
