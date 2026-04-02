import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-badge>` — Badge overlay for counts/dots.
 *
 * @attr {string} content - Badge content (text/number)
 * @attr {string} variant - standard | dot
 * @attr {string} color - primary | secondary | success | warning | error | info
 * @attr {number} max - Maximum display number (shows max+ if exceeded)
 *
 * @example
 * ```html
 * <ui-badge content="5" color="error">
 *   <span>🔔</span>
 * </ui-badge>
 * ```
 */
export class UIBadge extends UIElement {
  static observedAttributes = ['content', 'variant', 'color', 'max'];

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; position: relative; vertical-align: middle; }

      .badge {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        font-size: var(--ui-text-xs, 0.75rem);
        font-weight: var(--ui-weight-semibold, 600);
        color: #fff;
        background: var(--_badge-bg, var(--ui-color-error, #dc2626));
        border-radius: var(--ui-radius-full, 9999px);
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        line-height: 1;
        white-space: nowrap;
        pointer-events: none;
        z-index: 1;
      }

      .badge.dot {
        min-width: 8px;
        width: 8px;
        height: 8px;
        padding: 0;
      }

      :host([color="primary"])   .badge { --_badge-bg: var(--ui-color-primary); }
      :host([color="secondary"]) .badge { --_badge-bg: var(--ui-color-secondary); }
      :host([color="success"])   .badge { --_badge-bg: var(--ui-color-success); }
      :host([color="warning"])   .badge { --_badge-bg: var(--ui-color-warning); }
      :host([color="error"])     .badge { --_badge-bg: var(--ui-color-error); }
      :host([color="info"])      .badge { --_badge-bg: var(--ui-color-info); }
    `;
  }

  protected template(): string {
    const variant = this.getAttr('variant', 'standard');
    const content = this.getAttr('content');
    const max = this.getNumAttr('max', 99);
    const isDot = variant === 'dot';

    let display = content;
    if (!isDot && content) {
      const num = Number(content);
      if (!isNaN(num) && num > max) display = `${max}+`;
    }

    return `
      <slot></slot>
      <span class="badge ${isDot ? 'dot' : ''}" part="badge" aria-label="${content || ''}">${isDot ? '' : display}</span>
    `;
  }
}

register('ui-badge', UIBadge);
