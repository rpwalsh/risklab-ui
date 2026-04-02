import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-pagination>` — Page navigation.
 *
 * @attr {number} count - Total number of pages
 * @attr {number} page - Current page (1-based)
 * @attr {number} sibling-count - Pages to show around current (default: 1)
 * @attr {string} size - sm | md | lg
 *
 * @fires ui-change - { page: number }
 */
export class UIPagination extends UIElement {
  static observedAttributes = ['count', 'page', 'sibling-count', 'size'];

  get page(): number { return this.getNumAttr('page', 1); }
  set page(v: number) { this.setAttribute('page', String(v)); }

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; }

      nav {
        display: flex;
        align-items: center;
        gap: var(--ui-space-1, 0.25rem);
      }

      button {
        all: unset;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 2rem;
        height: 2rem;
        border-radius: var(--ui-radius-md, 0.5rem);
        font-family: inherit;
        font-size: var(--ui-text-sm, 0.875rem);
        color: var(--ui-color-text, #0f172a);
        transition: background 0.15s;
        padding: 0 0.25rem;
      }
      button:hover { background: var(--ui-color-surface-variant, #f8fafc); }
      button.active {
        background: var(--ui-color-primary, #4f46e5);
        color: #fff;
      }
      button:disabled { opacity: 0.4; cursor: default; }
      button:focus-visible { outline: 2px solid var(--ui-color-primary); outline-offset: 2px; }

      .ellipsis {
        min-width: 2rem;
        text-align: center;
        color: var(--ui-color-text-secondary, #64748b);
        user-select: none;
      }
    `;
  }

  protected template(): string {
    const count = this.getNumAttr('count', 1);
    const page = this.getNumAttr('page', 1);
    const siblings = this.getNumAttr('sibling-count', 1);

    const range = this._buildRange(count, page, siblings);

    const buttons = range
      .map((item) => {
        if (item === '...') {
          return '<span class="ellipsis">…</span>';
        }
        const num = Number(item);
        return `<button data-page="${num}" class="${num === page ? 'active' : ''}" aria-current="${num === page ? 'page' : 'false'}">${num}</button>`;
      })
      .join('');

    return `
      <nav aria-label="Pagination" part="nav">
        <button data-page="prev" ${page <= 1 ? 'disabled' : ''} aria-label="Previous">‹</button>
        ${buttons}
        <button data-page="next" ${page >= count ? 'disabled' : ''} aria-label="Next">›</button>
      </nav>
    `;
  }

  protected onRendered(): void {
    this.$$('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.page!;
        let newPage = this.page;
        if (action === 'prev') newPage = Math.max(1, newPage - 1);
        else if (action === 'next') newPage = Math.min(this.getNumAttr('count', 1), newPage + 1);
        else newPage = Number(action);

        this.page = newPage;
        this.render();
        this.emit('ui-change', { page: newPage });
      });
    });
  }

  private _buildRange(count: number, page: number, siblings: number): (number | string)[] {
    const totalSlots = siblings * 2 + 5; // siblings on each side + first + last + current + 2 ellipsis
    if (count <= totalSlots) {
      return Array.from({ length: count }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(page - siblings, 1);
    const rightSibling = Math.min(page + siblings, count);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < count - 1;

    const result: (number | string)[] = [1];

    if (showLeftDots) {
      result.push('...');
    } else {
      for (let i = 2; i < leftSibling; i++) result.push(i);
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== count) result.push(i);
    }

    if (showRightDots) {
      result.push('...');
    } else {
      for (let i = rightSibling + 1; i < count; i++) result.push(i);
    }

    result.push(count);
    return result;
  }
}

register('ui-pagination', UIPagination);
