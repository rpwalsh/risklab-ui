import { UIElement } from '../core/UIElement'; import { register } from '../core/register';
export class UIContainer extends UIElement {
  static observedAttributes = ['max-width', 'padding', 'fluid'];
  protected styles(): string { return `:host{display:block;width:100%}.container{width:100%;max-width:var(--_max,72rem);margin-inline:auto;padding-inline:var(--_pad,1rem)}`; }
  protected template(): string { const max = this.getAttr('max-width', 'lg'); const widths: Record<string,string> = { xs:'28rem', sm:'40rem', md:'52rem', lg:'64rem', xl:'80rem' }; return `<div class="container" style="--_max:${this.getBoolAttr('fluid')?'none':widths[max] ?? max};--_pad:${this.getAttr('padding', '1rem')}"><slot></slot></div>`; }
}
register('ui-container', UIContainer);
