import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UIStep extends UIElement {
  static observedAttributes = ['label', 'description', 'status', 'index'];
  protected styles(): string { return `:host{display:flex;flex:1;min-width:8rem;position:relative}.step{display:grid;grid-template-columns:2rem 1fr;gap:.55rem;align-items:start;width:100%}.marker{display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;border:1px solid var(--ui-color-border,#cbd5e1);background:var(--ui-color-surface);font-size:.75rem;font-weight:700}:host([status=active]) .marker,:host([status=complete]) .marker{border-color:var(--ui-color-primary,#4f46e5);background:var(--ui-color-primary,#4f46e5);color:#fff}.copy{display:grid;gap:.15rem}.copy small{color:var(--ui-color-text-secondary,#64748b)}`; }
  protected template(): string { const complete = this.getAttr('status') === 'complete'; return `<div class="step" aria-current="${this.getAttr('status') === 'active' ? 'step' : 'false'}"><span class="marker">${complete ? '✓' : this.getAttr('index', '1')}</span><span class="copy"><strong>${this.getAttr('label')}<slot></slot></strong><small>${this.getAttr('description')}</small></span></div>`; }
}

export class UIStepper extends UIElement {
  static observedAttributes = ['orientation'];
  protected styles(): string { return `:host{display:flex;gap:1rem;width:100%}:host([orientation=vertical]){display:grid}`; }
  protected template(): string { return `<div role="list" style="display:contents"><slot></slot></div>`; }
}

register('ui-step', UIStep);
register('ui-stepper', UIStepper);
