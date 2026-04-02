import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-box>` — Generic container with configurable padding, display, etc.
 *
 * @attr {string} p - Padding (CSS value)
 * @attr {string} m - Margin (CSS value)
 * @attr {string} display - CSS display value
 * @attr {string} bg - Background color (CSS value)
 */
export class UIBox extends UIElement {
  static observedAttributes = ['p', 'm', 'display', 'bg'];

  protected styles(): string {
    return ':host { display: block; }';
  }

  protected template(): string {
    const p = this.getAttr('p');
    const m = this.getAttr('m');
    const display = this.getAttr('display');
    const bg = this.getAttr('bg');

    const style = [
      p ? `padding:${p}` : '',
      m ? `margin:${m}` : '',
      display ? `display:${display}` : '',
      bg ? `background:${bg}` : '',
    ].filter(Boolean).join(';');

    return `<div ${style ? `style="${style}"` : ''} part="box"><slot></slot></div>`;
  }
}

register('ui-box', UIBox);
