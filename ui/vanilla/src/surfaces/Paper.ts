import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-paper>` — Elevated/outlined surface container.
 *
 * @attr {string} variant - elevated | outlined | flat
 * @attr {number} elevation - Shadow depth 0-5 (only for elevated variant)
 */
export class UIPaper extends UIElement {
  static observedAttributes = ['variant', 'elevation'];

  protected styles(): string {
    return /* css */ `
      :host { display: block; }

      .paper {
        background: var(--ui-color-surface, #fff);
        border-radius: var(--ui-radius-lg, 0.75rem);
        padding: var(--ui-space-4, 1rem);
      }
      .paper.variant-outlined {
        border: 1px solid var(--ui-color-border, #e2e8f0);
      }
      .paper.variant-flat {
        background: var(--ui-color-surface-variant, #f8fafc);
      }
      .paper.elevation-0 { box-shadow: none; }
      .paper.elevation-1 { box-shadow: 0 1px 2px rgba(0,0,0,.05); }
      .paper.elevation-2 { box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06); }
      .paper.elevation-3 { box-shadow: 0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06); }
      .paper.elevation-4 { box-shadow: 0 10px 15px rgba(0,0,0,.1), 0 4px 6px rgba(0,0,0,.05); }
      .paper.elevation-5 { box-shadow: 0 20px 25px rgba(0,0,0,.1), 0 8px 10px rgba(0,0,0,.04); }
    `;
  }

  protected template(): string {
    const variant = this.getAttr('variant', 'elevated');
    const elevation = this.getNumAttr('elevation', 2);

    return `
      <div class="paper variant-${variant} ${variant === 'elevated' ? `elevation-${elevation}` : ''}" part="paper">
        <slot></slot>
      </div>
    `;
  }
}

register('ui-paper', UIPaper);
