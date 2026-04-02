import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * `<ui-tooltip>` — Shows a tooltip on hover/focus of slotted content.
 *
 * @slot - The trigger element.
 *
 * @example
 * ```html
 * <ui-tooltip content="Delete item" placement="top">
 *   <button>🗑</button>
 * </ui-tooltip>
 * ```
 */
@customElement('ui-tooltip')
export class UiTooltip extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
    }

    .tooltip {
      position: absolute;
      padding: 0.375rem 0.625rem;
      font-size: 0.75rem;
      font-family: var(--ui-font-family, inherit);
      font-weight: 500;
      line-height: 1.4;
      border-radius: 0.375rem;
      white-space: nowrap;
      pointer-events: none;
      z-index: var(--ui-z-tooltip, 1500);
      background-color: var(--ui-tooltip-bg, #1f2937);
      color: var(--ui-tooltip-color, #fff);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity 150ms;
      box-sizing: border-box;
    }
    .tooltip--visible {
      opacity: 1;
    }

    /* Placements */
    .tooltip--top {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 6px;
    }
    .tooltip--bottom {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 6px;
    }
    .tooltip--left {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 6px;
    }
    .tooltip--right {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 6px;
    }
  `;

  @property({ type: String }) content = '';
  @property({ type: String }) placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @property({ type: Number }) delay = 200;

  @state() private _visible = false;
  private _timer?: ReturnType<typeof setTimeout>;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this._timer);
  }

  private _show() {
    this._timer = setTimeout(() => {
      this._visible = true;
    }, this.delay);
  }

  private _hide() {
    clearTimeout(this._timer);
    this._visible = false;
  }

  render() {
    return html`
      <span
        @mouseenter=${this._show}
        @mouseleave=${this._hide}
        @focusin=${this._show}
        @focusout=${this._hide}
      >
        <slot></slot>
      </span>
      <span
        class="tooltip tooltip--${this.placement} ${this._visible ? 'tooltip--visible' : ''}"
        role="tooltip"
        part="tooltip"
      >${this.content}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tooltip': UiTooltip;
  }
}
