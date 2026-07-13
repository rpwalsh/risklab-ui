import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UITextarea extends UIElement {
  static observedAttributes = ['label', 'placeholder', 'value', 'rows', 'disabled', 'readonly', 'error', 'helper-text', 'max-length'];

  protected styles(): string {
    return `
      :host { display:block; }
      label { display:grid; gap:.375rem; font-size:var(--ui-text-sm,.875rem); }
      textarea { width:100%; resize:vertical; min-height:5rem; padding:.625rem .75rem; color:var(--ui-color-text); background:var(--ui-color-surface); border:1px solid var(--ui-color-border,#cbd5e1); border-radius:var(--ui-radius-md,.5rem); font:inherit; line-height:1.45; }
      textarea:focus { outline:2px solid color-mix(in srgb,var(--ui-color-primary,#4f46e5) 30%,transparent); border-color:var(--ui-color-primary,#4f46e5); }
      :host([error]) textarea { border-color:var(--ui-color-error,#dc2626); }
      .meta { display:flex; justify-content:space-between; color:var(--ui-color-text-secondary,#64748b); font-size:var(--ui-text-xs,.75rem); }
    `;
  }

  protected template(): string {
    const value = this.getAttr('value');
    const max = this.getNumAttr('max-length', 0);
    return `<label><span>${this.getAttr('label')}</span><textarea rows="${this.getNumAttr('rows', 4)}" placeholder="${this.getAttr('placeholder')}" ${this.getBoolAttr('disabled') ? 'disabled' : ''} ${this.getBoolAttr('readonly') ? 'readonly' : ''} ${max ? `maxlength="${max}"` : ''}>${value}</textarea><span class="meta"><span>${this.getAttr('helper-text')}</span><span class="count">${max ? `${value.length}/${max}` : ''}</span></span></label>`;
  }

  protected onRendered(): void {
    const textarea = this.$<HTMLTextAreaElement>('textarea');
    textarea?.addEventListener('input', () => {
      const count = this.$('.count');
      const max = this.getNumAttr('max-length', 0);
      if (count && max) count.textContent = `${textarea.value.length}/${max}`;
      this.emit('ui-input', { value: textarea.value });
    });
    textarea?.addEventListener('change', () => this.emit('ui-change', { value: textarea.value }));
  }
}

register('ui-textarea', UITextarea);
