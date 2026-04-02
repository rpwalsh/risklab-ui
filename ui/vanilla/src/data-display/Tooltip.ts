import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-tooltip>` — Tooltip that wraps any content.
 *
 * @attr {string} content - Tooltip text
 * @attr {string} placement - top | bottom | left | right (default: top)
 * @attr {number} delay - Show delay in ms (default: 200)
 *
 * @example
 * ```html
 * <ui-tooltip content="Save your work" placement="bottom">
 *   <ui-button>Save</ui-button>
 * </ui-tooltip>
 * ```
 */
export class UITooltip extends UIElement {
  static observedAttributes = ['content', 'placement', 'delay'];

  private _timer: ReturnType<typeof setTimeout> | null = null;

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; position: relative; }

      .tip {
        position: absolute;
        z-index: 9999;
        background: var(--ui-gray-800, #1e293b);
        color: #fff;
        font-size: var(--ui-text-xs, 0.75rem);
        padding: 0.375rem 0.625rem;
        border-radius: var(--ui-radius-sm, 0.25rem);
        pointer-events: none;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.15s;
        line-height: 1.4;
      }
      :host(.show) .tip { opacity: 1; }

      /* Placement */
      .tip.top    { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
      .tip.bottom { top: calc(100% + 6px);    left: 50%; transform: translateX(-50%); }
      .tip.left   { right: calc(100% + 6px);  top: 50%;  transform: translateY(-50%); }
      .tip.right  { left: calc(100% + 6px);   top: 50%;  transform: translateY(-50%); }
    `;
  }

  protected template(): string {
    const content = this.getAttr('content');
    const placement = this.getAttr('placement', 'top');

    return `
      <slot></slot>
      ${content ? `<span class="tip ${placement}" role="tooltip" part="tooltip">${content}</span>` : ''}
    `;
  }

  protected onConnected(): void {
    this.addEventListener('mouseenter', this._show);
    this.addEventListener('mouseleave', this._hide);
    this.addEventListener('focusin', this._show);
    this.addEventListener('focusout', this._hide);
  }

  protected onDisconnected(): void {
    this.removeEventListener('mouseenter', this._show);
    this.removeEventListener('mouseleave', this._hide);
    this.removeEventListener('focusin', this._show);
    this.removeEventListener('focusout', this._hide);
    if (this._timer) clearTimeout(this._timer);
  }

  private _show = (): void => {
    const delay = this.getNumAttr('delay', 200);
    this._timer = setTimeout(() => this.classList.add('show'), delay);
  };

  private _hide = (): void => {
    if (this._timer) clearTimeout(this._timer);
    this.classList.remove('show');
  };
}

register('ui-tooltip', UITooltip);
