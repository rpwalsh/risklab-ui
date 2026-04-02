import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-card>` — Surface card container.
 *
 * @attr {string} variant - elevated | outlined | flat
 * @attr {boolean} interactive - Adds hover effect
 *
 * @slot - Default slot for card content
 * @slot header - Card header
 * @slot footer - Card footer/actions
 *
 * @example
 * ```html
 * <ui-card variant="elevated">
 *   <div slot="header"><h3>Title</h3></div>
 *   <p>Card content goes here.</p>
 *   <div slot="footer"><ui-button>Action</ui-button></div>
 * </ui-card>
 * ```
 */
export class UICard extends UIElement {
  static observedAttributes = ['variant', 'interactive'];

  protected styles(): string {
    return /* css */ `
      :host { display: block; }

      .card {
        background: var(--ui-color-surface, #fff);
        border-radius: var(--ui-radius-lg, 0.75rem);
        overflow: hidden;
        transition: box-shadow 0.2s, transform 0.2s;
      }

      .card.variant-elevated {
        box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06);
      }
      .card.variant-outlined {
        border: 1px solid var(--ui-color-border, #e2e8f0);
      }
      .card.variant-flat {
        background: var(--ui-color-surface-variant, #f8fafc);
      }

      :host([interactive]) .card {
        cursor: pointer;
      }
      :host([interactive]) .card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,.1);
        transform: translateY(-1px);
      }

      .header {
        padding: var(--ui-space-4, 1rem) var(--ui-space-4, 1rem) 0;
      }
      .body {
        padding: var(--ui-space-4, 1rem);
      }
      .footer {
        padding: 0 var(--ui-space-4, 1rem) var(--ui-space-4, 1rem);
        display: flex;
        gap: var(--ui-space-2, 0.5rem);
        justify-content: flex-end;
      }
    `;
  }

  protected template(): string {
    const variant = this.getAttr('variant', 'elevated');

    return `
      <div class="card variant-${variant}" part="card">
        <div class="header" part="header"><slot name="header"></slot></div>
        <div class="body" part="body"><slot></slot></div>
        <div class="footer" part="footer"><slot name="footer"></slot></div>
      </div>
    `;
  }
}

register('ui-card', UICard);
