import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ColorVariant } from '../core/types';

/**
 * `<ui-badge>` — Notification badge wrapping child content.
 *
 * @slot - The element to badge (e.g., an icon).
 *
 * @example
 * ```html
 * <ui-badge content="5" color="error">
 *   <span>🔔</span>
 * </ui-badge>
 * ```
 */
@customElement('ui-badge')
export class UiBadge extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-flex;
      vertical-align: middle;
      flex-shrink: 0;
    }

    .indicator {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      font-family: var(--ui-font-family, inherit);
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
      z-index: 1;
      border: 2px solid var(--ui-badge-outline, #fff);
      min-width: 1.25rem;
      height: 1.25rem;
      font-size: 0.75rem;
      padding: 0 0.375rem;
      border-radius: 0.625rem;
      top: 0;
      right: 0;
      transform: translateX(50%) translateY(-50%);
      color: #fff;
    }

    .indicator--dot {
      min-width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      padding: 0;
      font-size: 0;
    }

    /* Colors */
    .c-primary   { background-color: var(--ui-color-primary, #4f46e5); }
    .c-secondary { background-color: var(--ui-color-secondary, #7c3aed); }
    .c-success   { background-color: var(--ui-color-success, #16a34a); }
    .c-warning   { background-color: var(--ui-color-warning, #d97706); }
    .c-error     { background-color: var(--ui-color-error, #dc2626); }
    .c-info      { background-color: var(--ui-color-info, #2563eb); }
    .c-neutral   { background-color: var(--ui-color-neutral, #64748b); }
  `;

  @property({ type: String }) content: string | number = '';
  @property({ type: String }) variant: 'standard' | 'dot' = 'standard';
  @property({ type: String }) color: ColorVariant = 'error';
  @property({ type: Number }) max = 99;

  private get _displayContent(): string {
    if (this.variant === 'dot') return '';
    const num = Number(this.content);
    if (!isNaN(num) && num > this.max) return `${this.max}+`;
    return String(this.content);
  }

  render() {
    const isDot = this.variant === 'dot';
    const hasContent = this.content !== '' && this.content !== undefined;

    return html`
      <slot></slot>
      ${hasContent || isDot
        ? html`<span
            class="indicator ${isDot ? 'indicator--dot' : ''} c-${this.color}"
            part="indicator"
          >${isDot ? nothing : this._displayContent}</span>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-badge': UiBadge;
  }
}
