import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-stack>` — Vertical or horizontal stack layout.
 *
 * @attr {string} direction - row | column (default: column)
 * @attr {string} gap - CSS gap value (default: var(--ui-space-3))
 * @attr {string} align - CSS align-items
 * @attr {string} justify - CSS justify-content
 * @attr {boolean} wrap - Allow wrapping
 */
export class UIStack extends UIElement {
  static observedAttributes = ['direction', 'gap', 'align', 'justify', 'wrap'];

  protected styles(): string {
    return /* css */ `
      :host { display: flex; }
    `;
  }

  protected template(): string {
    const direction = this.getAttr('direction', 'column');
    const gap = this.getAttr('gap', 'var(--ui-space-3, 0.75rem)');
    const align = this.getAttr('align');
    const justify = this.getAttr('justify');
    const wrap = this.getBoolAttr('wrap');

    const style = [
      `display:flex`,
      `flex-direction:${direction}`,
      `gap:${gap}`,
      align ? `align-items:${align}` : '',
      justify ? `justify-content:${justify}` : '',
      wrap ? 'flex-wrap:wrap' : '',
    ].filter(Boolean).join(';');

    return `<div style="${style}" part="stack"><slot></slot></div>`;
  }
}

register('ui-stack', UIStack);
