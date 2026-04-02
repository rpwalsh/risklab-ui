import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SizeVariant } from '../core/types';

/**
 * `<ui-pagination>` — Page navigation with smart range, ellipsis, prev/next.
 *
 * @fires ui-page - On page change (detail: { page }).
 *
 * @example
 * ```html
 * <ui-pagination count="20" page="3" siblingCount="1" boundaryCount="1" size="md"></ui-pagination>
 * ```
 */
@customElement('ui-pagination')
export class UiPagination extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: var(--ui-space-1, 4px);
      font-family: var(--ui-font-family, inherit);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--ui-color-border, #e2e8f0);
      cursor: pointer;
      font-weight: 400;
      background: transparent;
      color: var(--ui-color-text, #0f172a);
      border-radius: var(--ui-radius-md, 0.5rem);
      font-family: inherit;
      transition: all 150ms;
    }

    :host([size='sm']) .btn { width: 28px; height: 28px; font-size: 12px; }
    :host([size='md']) .btn { width: 36px; height: 36px; font-size: 14px; }
    :host([size='lg']) .btn { width: 44px; height: 44px; font-size: 16px; }

    .btn:hover:not(.btn--disabled):not(.btn--active) {
      background: var(--ui-color-surface-variant, #f8fafc);
    }

    .btn--active {
      background: var(--ui-color-primary, #4f46e5);
      color: #fff;
      border-color: var(--ui-color-primary, #4f46e5);
      font-weight: 600;
    }

    .btn--disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      font-size: 14px;
      border: none;
      cursor: default;
      color: var(--ui-color-text, #0f172a);
      background: transparent;
    }
  `;

  @property({ type: Number }) count = 1;
  @property({ type: Number }) page = 1;
  @property({ type: Number }) siblingCount = 1;
  @property({ type: Number }) boundaryCount = 1;
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';

  private get _range(): (number | '...')[] {
    const total = this.count;
    const current = this.page;
    const sibling = this.siblingCount;
    const boundary = this.boundaryCount;

    const totalNumbers = boundary * 2 + sibling * 2 + 3; // boundaries + siblings + current + 2 ellipses
    if (totalNumbers >= total) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(current - sibling, boundary + 1);
    const rightSiblingIndex = Math.min(current + sibling, total - boundary);

    const showLeftDots = leftSiblingIndex > boundary + 2;
    const showRightDots = rightSiblingIndex < total - boundary - 1;

    const result: (number | '...')[] = [];

    // Left boundary
    for (let i = 1; i <= boundary; i++) result.push(i);

    if (showLeftDots) {
      result.push('...');
    } else {
      for (let i = boundary + 1; i < leftSiblingIndex; i++) result.push(i);
    }

    // Siblings + current
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) result.push(i);

    if (showRightDots) {
      result.push('...');
    } else {
      for (let i = rightSiblingIndex + 1; i <= total - boundary; i++) result.push(i);
    }

    // Right boundary
    for (let i = total - boundary + 1; i <= total; i++) result.push(i);

    return result;
  }

  private _goTo(p: number) {
    if (p < 1 || p > this.count || p === this.page) return;
    this.page = p;
    this.dispatchEvent(
      new CustomEvent('ui-page', {
        detail: { page: this.page },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button
        type="button"
        class="btn ${this.page <= 1 ? 'btn--disabled' : ''}"
        ?disabled=${this.page <= 1}
        @click=${() => this._goTo(this.page - 1)}
        aria-label="Previous page"
      >‹</button>

      ${this._range.map((item) =>
        item === '...'
          ? html`<span class="ellipsis">…</span>`
          : html`<button
              type="button"
              class="btn ${item === this.page ? 'btn--active' : ''}"
              @click=${() => this._goTo(item as number)}
              aria-current=${item === this.page ? 'page' : nothing}
            >${item}</button>`,
      )}

      <button
        type="button"
        class="btn ${this.page >= this.count ? 'btn--disabled' : ''}"
        ?disabled=${this.page >= this.count}
        @click=${() => this._goTo(this.page + 1)}
        aria-label="Next page"
      >›</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-pagination': UiPagination;
  }
}
