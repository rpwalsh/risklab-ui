import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
} from '@angular/core';

/**
 * Pagination — Standalone Angular component.
 *
 * @example
 * ```html
 * <ui-pagination [count]="10" [(page)]="currentPage" />
 * ```
 */
@Component({
  selector: 'ui-pagination',
  standalone: true,
  imports: [],
  template: `
    <nav class="ui-pagination" [class]="'ui-pagination--' + size()" aria-label="Pagination">
      <button
        type="button"
        class="ui-pagination__btn"
        [disabled]="page() <= 1"
        (click)="goTo(page() - 1)"
        aria-label="Previous page"
      >&lsaquo;</button>

      @for (item of pages(); track item) {
        @if (item === -1) {
          <span class="ui-pagination__ellipsis">&hellip;</span>
        } @else {
          <button
            type="button"
            class="ui-pagination__btn"
            [class.ui-pagination__btn--active]="item === page()"
            [attr.aria-current]="item === page() ? 'page' : null"
            (click)="goTo(item)"
          >{{ item }}</button>
        }
      }

      <button
        type="button"
        class="ui-pagination__btn"
        [disabled]="page() >= count()"
        (click)="goTo(page() + 1)"
        aria-label="Next page"
      >&rsaquo;</button>
    </nav>
  `,
  styles: [`
    :host { display: block; }
    .ui-pagination {
      display: flex;
      align-items: center;
      gap: var(--ui-space-1, 4px);
    }
    .ui-pagination__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--ui-color-border, #e2e8f0);
      background: var(--ui-color-surface, #fff);
      color: var(--ui-color-text, #0f172a);
      border-radius: var(--ui-radius-md, 8px);
      cursor: pointer;
      font-weight: 500;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .ui-pagination__btn:hover:not(:disabled) {
      background: var(--ui-color-primary-50, #eff6ff);
      border-color: var(--ui-color-primary, #3b82f6);
    }
    .ui-pagination__btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .ui-pagination__btn--active {
      background: var(--ui-color-primary, #3b82f6);
      color: #fff;
      border-color: var(--ui-color-primary, #3b82f6);
    }
    .ui-pagination__btn--active:hover:not(:disabled) {
      background: var(--ui-color-primary-600, #2563eb);
    }
    .ui-pagination__ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--ui-color-text-secondary, #64748b);
      user-select: none;
    }

    /* Sizes */
    .ui-pagination--sm .ui-pagination__btn { min-width: 28px; height: 28px; font-size: 0.75rem; }
    .ui-pagination--sm .ui-pagination__ellipsis { min-width: 28px; height: 28px; font-size: 0.75rem; }
    .ui-pagination--md .ui-pagination__btn { min-width: 36px; height: 36px; font-size: 0.875rem; }
    .ui-pagination--md .ui-pagination__ellipsis { min-width: 36px; height: 36px; font-size: 0.875rem; }
    .ui-pagination--lg .ui-pagination__btn { min-width: 44px; height: 44px; font-size: 1rem; }
    .ui-pagination--lg .ui-pagination__ellipsis { min-width: 44px; height: 44px; font-size: 1rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly page = model(1);
  readonly count = input(1);
  readonly siblingCount = input(1);
  readonly boundaryCount = input(1);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly pages = computed(() => {
    const total = this.count();
    const current = this.page();
    const sibling = this.siblingCount();
    const boundary = this.boundaryCount();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const left = new Set<number>();
    const right = new Set<number>();
    const center = new Set<number>();

    for (let i = 1; i <= Math.min(boundary, total); i++) left.add(i);
    for (let i = Math.max(1, total - boundary + 1); i <= total; i++) right.add(i);

    const lo = Math.max(1, current - sibling);
    const hi = Math.min(total, current + sibling);
    for (let i = lo; i <= hi; i++) center.add(i);

    const merged = Array.from(new Set([...left, ...center, ...right])).sort(
      (a, b) => a - b,
    );

    const result: number[] = [];
    let prev = 0;
    for (const p of merged) {
      if (p - prev === 2) {
        result.push(prev + 1);
      } else if (p - prev > 2) {
        result.push(-1); // ellipsis
      }
      result.push(p);
      prev = p;
    }
    return result;
  });

  goTo(p: number): void {
    const clamped = Math.max(1, Math.min(p, this.count()));
    this.page.set(clamped);
  }
}
