import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export class UITimelineItem extends UIElement {
  static observedAttributes = ['time', 'title', 'status'];
  protected styles(): string { return `:host{display:grid;grid-template-columns:5.5rem 1rem 1fr;gap:.65rem;min-height:3.5rem;position:relative}.time{color:var(--ui-color-text-secondary,#64748b);font-size:.75rem;text-align:right;padding-top:.15rem}.rail{position:relative}.rail:before{content:"";position:absolute;left:50%;top:1rem;bottom:-.5rem;border-left:1px solid var(--ui-color-border,#cbd5e1)}.dot{display:block;width:.7rem;height:.7rem;margin:.15rem auto 0;border-radius:50%;background:var(--ui-color-primary,#4f46e5);box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-color-primary,#4f46e5) 18%,transparent)}:host([status=warning]) .dot{background:var(--ui-color-warning,#f59e0b)}:host([status=error]) .dot{background:var(--ui-color-error,#ef4444)}.content{display:grid;gap:.15rem}.content small{color:var(--ui-color-text-secondary,#64748b)}`; }
  protected template(): string { return `<time class="time">${this.getAttr('time')}</time><span class="rail"><span class="dot"></span></span><span class="content"><strong>${this.getAttr('title')}</strong><small><slot></slot></small></span>`; }
}
export class UITimeline extends UIElement { protected styles(): string { return `:host{display:grid}`; } protected template(): string { return `<div role="list"><slot></slot></div>`; } }
register('ui-timeline-item', UITimelineItem);
register('ui-timeline', UITimeline);
