import { UIElement } from '../core/UIElement';
import { register } from '../core/register';
import type { DataGridColumn } from '../core/types';

/**
 * `<ui-data-grid>` — Full-featured data grid.
 *
 * @attr {boolean} striped - Alternating row colors
 * @attr {boolean} bordered - Cell borders
 * @attr {boolean} sortable - Enable column sorting
 * @attr {number} page-size - Rows per page (0 = no pagination)
 *
 * Columns and rows are set via JS properties:
 * ```js
 * const grid = document.querySelector('ui-data-grid');
 * grid.columns = [{ field: 'name', headerName: 'Name', width: 200 }];
 * grid.rows = [{ name: 'Alice' }, { name: 'Bob' }];
 * ```
 *
 * @fires ui-sort - { field: string, direction: 'asc' | 'desc' }
 * @fires ui-page - { page: number }
 * @fires ui-row-click - { rowId: string, row: Record<string, unknown> }
 */
export class UIDataGrid extends UIElement {
  static observedAttributes = ['striped', 'bordered', 'sortable', 'page-size'];

  private _columns: DataGridColumn[] = [];
  private _rows: Record<string, unknown>[] = [];
  private _sortField = '';
  private _sortDir: 'asc' | 'desc' = 'asc';
  private _page = 0;
  private _rowIdField = '';
  private _selectedRowId: string | null = null;

  get columns(): DataGridColumn[] { return this._columns; }
  set columns(v: DataGridColumn[]) { this._columns = v; this.render(); }

  get rows(): Record<string, unknown>[] { return this._rows; }
  set rows(v: Record<string, unknown>[]) { this._rows = v; this._page = 0; this.render(); }

  get rowIdField(): string { return this._rowIdField; }
  set rowIdField(v: string) { this._rowIdField = v; this.render(); }

  get selectedRowId(): string | null { return this._selectedRowId; }
  set selectedRowId(v: string | null) { this._selectedRowId = v; this.render(); }

  private resolveRowId(row: Record<string, unknown>, index: number): string {
    const explicit = this._rowIdField ? row[this._rowIdField] : undefined;
    const fallback = row['id'] ?? row['cveId'] ?? row['key'];
    return String(explicit ?? fallback ?? index);
  }

  protected styles(): string {
    return /* css */ `
      :host { display: block; overflow-x: auto; }

      table {
        width: 100%;
        border-collapse: collapse;
        font-family: inherit;
        font-size: var(--ui-text-sm, 0.875rem);
      }

      th, td {
        text-align: left;
        padding: var(--ui-space-2, 0.5rem) var(--ui-space-3, 0.75rem);
      }

      th {
        font-weight: var(--ui-weight-semibold, 600);
        color: var(--ui-color-text-secondary, #64748b);
        background: var(--ui-color-surface-variant, #f8fafc);
        border-bottom: 2px solid var(--ui-color-border, #e2e8f0);
        white-space: nowrap;
        user-select: none;
      }
      th.sortable { cursor: pointer; }
      th.sortable:hover { color: var(--ui-color-text, #0f172a); }

      .sort-icon { font-size: 0.75em; margin-left: 0.25rem; }

      td {
        color: var(--ui-color-text, #0f172a);
        border-bottom: 1px solid var(--ui-color-border, #e2e8f0);
      }

      :host([bordered]) td,
      :host([bordered]) th {
        border: 1px solid var(--ui-color-border, #e2e8f0);
      }

      :host([striped]) tbody tr:nth-child(even) {
        background: var(--ui-color-surface-variant, #f8fafc);
      }

      tbody tr {
        cursor: pointer;
        transition: background 0.15s ease, box-shadow 0.15s ease;
      }
      tbody tr:hover {
        background: color-mix(in srgb, var(--ui-color-primary, #4f46e5) 4%, var(--ui-color-surface, #fff));
      }
      tbody tr.row-selected {
        background: color-mix(in srgb, var(--ui-color-primary, #4f46e5) 12%, var(--ui-color-surface, #fff));
        box-shadow: inset 2px 0 0 var(--ui-color-primary, #4f46e5);
      }

      .pagination {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--ui-space-2, 0.5rem);
        padding: var(--ui-space-3, 0.75rem) 0;
        font-size: var(--ui-text-sm, 0.875rem);
        color: var(--ui-color-text-secondary, #64748b);
      }
      .pagination button {
        all: unset;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: var(--ui-radius-sm, 0.25rem);
        border: 1px solid var(--ui-color-border, #e2e8f0);
        transition: background 0.15s;
      }
      .pagination button:hover { background: var(--ui-color-surface-variant, #f8fafc); }
      .pagination button:disabled { opacity: 0.4; cursor: default; }

      .empty {
        text-align: center;
        padding: var(--ui-space-8, 2rem);
        color: var(--ui-color-text-secondary, #64748b);
      }
    `;
  }

  protected template(): string {
    const sortable = this.getBoolAttr('sortable');
    const pageSize = this.getNumAttr('page-size', 0);

    if (this._columns.length === 0) {
      return '<div class="empty" part="empty">No columns configured</div>';
    }

    // Sort rows while preserving row identity
    let sorted = this._rows.map((row, index) => ({
      row,
      index,
      rowId: this.resolveRowId(row, index),
    }));
    if (sortable && this._sortField) {
      sorted.sort((a, b) => {
        const av = String(a.row[this._sortField] ?? '');
        const bv = String(b.row[this._sortField] ?? '');
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return this._sortDir === 'asc' ? cmp : -cmp;
      });
    }

    // Paginate
    const totalPages = pageSize > 0 ? Math.ceil(sorted.length / pageSize) : 1;
    if (pageSize > 0) {
      sorted = sorted.slice(this._page * pageSize, (this._page + 1) * pageSize);
    }

    // Build headers
    const headers = this._columns
      .map((col) => {
        const isSorted = this._sortField === col.field;
        const arrow = isSorted ? (this._sortDir === 'asc' ? '▲' : '▼') : '';
        const style = col.width ? ` style="width: ${col.width}px"` : '';
        const align = col.align ? ` style="text-align: ${col.align}"` : '';
        const cls = sortable && col.sortable !== false ? 'sortable' : '';
        return `<th class="${cls}" data-field="${col.field}"${style}${align}>${col.headerName}${arrow ? `<span class="sort-icon">${arrow}</span>` : ''}</th>`;
      })
      .join('');

    // Build rows
    const rows = sorted.length === 0
      ? `<tr><td colspan="${this._columns.length}" class="empty">No data</td></tr>`
      : sorted
          .map(
            (item) =>
              `<tr data-row-index="${item.index}" class="${item.rowId === this._selectedRowId ? 'row-selected' : ''}">` +
              this._columns
                .map((col) => {
                  const val = item.row[col.field] ?? '';
                  const align = col.align ? ` style="text-align:${col.align}"` : '';
                  return `<td${align}>${val}</td>`;
                })
                .join('') +
              '</tr>',
          )
          .join('');

    const pagination =
      pageSize > 0 && totalPages > 1
        ? `<div class="pagination" part="pagination">
            <span>Page ${this._page + 1} of ${totalPages}</span>
            <button data-action="prev" ${this._page === 0 ? 'disabled' : ''}>← Prev</button>
            <button data-action="next" ${this._page >= totalPages - 1 ? 'disabled' : ''}>Next →</button>
          </div>`
        : '';

    return `
      <table part="table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${pagination}
    `;
  }

  protected onRendered(): void {
    // Sorting
    this.$$<HTMLTableCellElement>('th.sortable').forEach((th) => {
      th.addEventListener('click', () => {
        const field = th.dataset.field!;
        if (this._sortField === field) {
          this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this._sortField = field;
          this._sortDir = 'asc';
        }
        this.render();
        this.emit('ui-sort', { field: this._sortField, direction: this._sortDir });
      });
    });

    // Pagination
    this.$<HTMLButtonElement>('[data-action="prev"]')?.addEventListener('click', () => {
      if (this._page > 0) {
        this._page--;
        this.render();
        this.emit('ui-page', { page: this._page });
      }
    });
    this.$<HTMLButtonElement>('[data-action="next"]')?.addEventListener('click', () => {
      const pageSize = this.getNumAttr('page-size', 0);
      const totalPages = pageSize > 0 ? Math.ceil(this._rows.length / pageSize) : 1;
      if (this._page < totalPages - 1) {
        this._page++;
        this.render();
        this.emit('ui-page', { page: this._page });
      }
    });

    // Row selection
    this.$$<HTMLTableRowElement>('tbody tr[data-row-index]').forEach((rowEl) => {
      rowEl.addEventListener('click', () => {
        const index = Number(rowEl.dataset.rowIndex ?? '-1');
        if (index < 0) return;
        const row = this._rows[index];
        if (!row) return;
        const rowId = this.resolveRowId(row, index);
        this._selectedRowId = rowId;
        this.render();
        this.emit('ui-row-click', { rowId, row });
      });
    });
  }
}

register('ui-data-grid', UIDataGrid);
