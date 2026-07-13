import { UIElement } from '../core/UIElement'; import { register } from '../core/register';
export class UIContextMenu extends UIElement {
  static observedAttributes=['open','x','y','label'];
  protected styles():string{return `:host{display:contents}.menu{display:none;position:fixed;z-index:90;left:var(--_x,0);top:var(--_y,0);min-width:12rem;padding:.25rem;background:var(--ui-color-surface);border:1px solid var(--ui-color-border,#cbd5e1);border-radius:.5rem;box-shadow:0 14px 34px rgb(0 0 0/.28)}:host([open]) .menu{display:block}`;}
  protected template():string{return `<slot name="trigger"></slot><div class="menu" role="menu" aria-label="${this.getAttr('label','Context menu')}" style="--_x:${this.getNumAttr('x',0)}px;--_y:${this.getNumAttr('y',0)}px"><slot></slot></div>`;}
  protected onConnected():void{this.addEventListener('contextmenu',this.openAt);document.addEventListener('pointerdown',this.close);}
  protected onDisconnected():void{this.removeEventListener('contextmenu',this.openAt);document.removeEventListener('pointerdown',this.close);}
  private openAt=(event:Event)=>{event.preventDefault();const pointer=event as MouseEvent;this.setAttribute('x',String(pointer.clientX));this.setAttribute('y',String(pointer.clientY));this.setAttribute('open','');}; private close=()=>this.removeAttribute('open');
}
register('ui-context-menu',UIContextMenu);
