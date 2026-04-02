import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-divider>` — Visual separator.
 *
 * @attr {string} orientation - horizontal | vertical (default: horizontal)
 * @attr {string} color - CSS color
 */
export class UIDivider extends UIElement {
  static observedAttributes = ['orientation', 'color'];

  protected styles(): string {
    return /* css */ `
      :host { display: block; }
      .divider {
        border: none;
        background: var(--ui-color-border, #e2e8f0);
      }
      .divider.horizontal {
        height: 1px;
        width: 100%;
      }
      .divider.vertical {
        width: 1px;
        height: 100%;
        min-height: 1em;
        display: inline-block;
      }
    `;
  }

  protected template(): string {
    const orientation = this.getAttr('orientation', 'horizontal');
    const color = this.getAttr('color');

    return `<hr class="divider ${orientation}" role="separator" aria-orientation="${orientation}" ${color ? `style="background:${color}"` : ''} part="divider" />`;
  }
}

register('ui-divider', UIDivider);
