import { UIElement } from '../core/UIElement'; import { register } from '../core/register';
export class UIFlex extends UIElement {
  static observedAttributes = ['direction','gap','align','justify','wrap','inline'];
  protected styles(): string { return `:host{display:block}.flex{display:flex;flex-direction:var(--_direction,row);gap:var(--_gap,0);align-items:var(--_align,stretch);justify-content:var(--_justify,flex-start);flex-wrap:var(--_wrap,nowrap)}:host([inline]){display:inline-block}.flex{width:100%}`; }
  protected template(): string { const map: Record<string,string> = { start:'flex-start', end:'flex-end', between:'space-between', around:'space-around', evenly:'space-evenly' }; const value=(name:string,fallback:string)=>map[this.getAttr(name)]??this.getAttr(name,fallback); return `<div class="flex" style="--_direction:${this.getAttr('direction','row')};--_gap:${this.getAttr('gap','0')};--_align:${value('align','stretch')};--_justify:${value('justify','flex-start')};--_wrap:${this.getBoolAttr('wrap')?'wrap':'nowrap'}"><slot></slot></div>`; }
}
register('ui-flex', UIFlex);
