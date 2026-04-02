import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  effect,
} from '@angular/core';
import type { DataGridColumn } from '../core/types';

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * DataGrid — Standalone Angular component with sortable columns and pagination.
 *
 * @example
 * ```html
 * <ui-data-grid
 *   [columns]="cols"
 *   [rows]="data"
 *   [pageSize]="10"
 *   [sortable]="true"
 *   [striped]="true"
 *   (sort)="onSort($event)"
 *   (pageChange)="onPage($event)"
 * />
 * ```
 */
@Component({
  selector: 'ui-data-grid',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-datagrid">
      <div class="ui-table-wrapper">
        <table class="ui-table" [class.ui-table--striped]="striped()" data-size="md">
          <thead>
            <tr>
              @for (col of columns(); track col.field) {
                <th
                  [class.ui-table-th--sortable]="col.sortable !== false && sortable()"
                  [class.ui-table-th--right]="col.align === 'right'"
                  [class.ui-table-th--center]="col.align === 'center'"
                  (click)="onSort(col)"
                >
                  {{ col.headerName }}
                  @if (col.sortable !== false && sortable()) {
                    <span [class]="sortIndicatorClass(col.field)">
                      @if (sortState()?.field === col.field) {
                        {{ sortState()?.direction === 'asc' ? '▲' : '▼' }}
                      } @else {
                        ▲
                      }
                    </span>
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of pagedRows(); track $index) {
              <tr class="ui-table-row">
                @for (col of columns(); track col.field) {
                  <td
                    [class.ui-table-td--right]="col.align === 'right'"
                    [class.ui-table-td--center]="col.align === 'center'"
                  >
                    {{ row[col.field] }}
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td class="ui-table-td--empty" [attr.colspan]="columns().length">No data</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      @if (totalPages() > 1) {
        <div class="ui-datagrid-pagination">
          <span>Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
          <button
            type="button"
            class="ui-datagrid-pagination-btn"
            [disabled]="currentPage() === 0"
            (click)="goToPage(currentPage() - 1)"
          >Prev</button>
          <button
            type="button"
            class="ui-datagrid-pagination-btn"
            [disabled]="currentPage() >= totalPages() - 1"
            (click)="goToPage(currentPage() + 1)"
          >Next</button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-datagrid {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--ui-color-border, #e2e8f0);
      border-radius: var(--ui-radius-md, 0.5rem);
      overflow: hidden;
      font-family: var(--ui-font-family, inherit);
      background: var(--ui-color-surface, #fff);
    }
    .ui-table-wrapper { position: relative; overflow: auto; }
    .ui-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; border-spacing: 0; }
    .ui-table th {
      padding: 0.5rem 0.75rem;
      font-weight: 600;
      text-align: left;
      border-bottom: 2px solid var(--ui-color-border, #e2e8f0);
      user-select: none;
      white-space: nowrap;
    }
    .ui-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--ui-color-border, #e2e8f0); }
    .ui-table-th--sortable { cursor: pointer; }
    .ui-table-th--right, .ui-table-td--right { text-align: right; }
    .ui-table-th--center, .ui-table-td--center { text-align: center; }
    .ui-table-td--empty { text-align: center; padding: 2rem; color: var(--ui-color-text-secondary); }
    .ui-table--striped tbody tr:nth-child(even) { background-color: rgba(0,0,0,0.02); }
    .ui-table-sort-indicator--inactive { opacity: 0.3; }
    .ui-datagrid-pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      color: var(--ui-color-text-secondary);
      border-top: 1px solid var(--ui-color-border, #e2e8f0);
    }
    .ui-datagrid-pagination-btn {
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--ui-color-border, #e2e8f0);
      border-radius: 0.25rem;
      background: transparent;
      color: inherit;
      font-size: inherit;
      cursor: pointer;
    }
    .ui-datagrid-pagination-btn:disabled { cursor: default; opacity: 0.4; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGrid {
  readonly columns = input<DataGridColumn[]>([]);
  readonly rows = input<Record<string, unknown>[]>([]);
  readonly pageSize = input(10);
  readonly sortable = input(true);
  readonly striped = input(false);
  readonly bordered = input(false);

  readonly sort = output<SortState>();
  readonly pageChange = output<number>();

  protected readonly sortState = signal<SortState | null>(null);
  protected readonly currentPage = signal(0);

  constructor() {
    effect(() => {
      // Track rows input; when it changes, reset to first page
      this.rows();
      this.currentPage.set(0);
    });
  }

  protected readonly sortedRows = computed(() => {
    const rowsCopy = [...this.rows()];
    const s = this.sortState();
    if (!s) return rowsCopy;
    return rowsCopy.sort((a, b) => {
      const aVal = a[s.field];
      const bVal = b[s.field];
      const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true });
      return s.direction === 'asc' ? cmp : -cmp;
    });
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedRows().length / this.pageSize()))
  );

  protected readonly pagedRows = computed(() => {
    const start = this.currentPage() * this.pageSize();
    return this.sortedRows().slice(start, start + this.pageSize());
  });

  protected onSort(col: DataGridColumn): void {
    if (col.sortable === false || !this.sortable()) return;
    const current = this.sortState();
    let direction: 'asc' | 'desc' = 'asc';
    if (current?.field === col.field) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    }
    const state: SortState = { field: col.field, direction };
    this.sortState.set(state);
    this.sort.emit(state);
  }

  protected sortIndicatorClass(field: string): string {
    const s = this.sortState();
    return s?.field === field ? 'ui-table-sort-indicator' : 'ui-table-sort-indicator ui-table-sort-indicator--inactive';
  }

  protected goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }
}
