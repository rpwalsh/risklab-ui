import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { DataGridColumn } from '../core/types';

/**
 * `<ui-data-grid>` — Full-featured data table with sorting and pagination.
 *
 * @fires ui-sort - On column sort (detail: { field, direction }).
 * @fires ui-page - On page change (detail: { page }).
 *
 * @example
 * ```html
 * <ui-data-grid
 *   .columns=${[{ field: 'name', headerName: 'Name', sortable: true }]}
 *   .rows=${[{ name: 'Alice' }, { name: 'Bob' }]}
 *   pageSize="10"
 *   striped
 *   sortable
 * ></ui-data-grid>
 * ```
 */
@customElement('ui-data-grid')
export class UiDataGrid extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--ui-color-border, #e2e8f0);
      border-radius: var(--ui-radius-md, 0.5rem);
      overflow: hidden;
      font-family: var(--ui-font-family, inherit);
      font-size: 0.875rem;
      background-color: var(--ui-color-surface, #fff);
      box-sizing: border-box;
    }

    .table-wrapper {
      overflow: auto;
      flex: 1;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }

    th {
      padding: 0.5rem 0.75rem;
      font-weight: 600;
      text-align: left;
      border-bottom: 2px solid var(--ui-color-border, #e2e8f0);
      background-color: var(--ui-color-surface-variant, #f8fafc);
      user-select: none;
      white-space: nowrap;
    }
    th.sortable { cursor: pointer; }
    th.sortable:hover { background-color: var(--ui-color-border, #e2e8f0); }
    th.align-center { text-align: center; }
    th.align-right  { text-align: right; }

    td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--ui-color-border, #e2e8f0);
    }
    td.align-center { text-align: center; }
    td.align-right  { text-align: right; }

    tr.striped:nth-child(even) {
      background-color: rgba(0,0,0,0.02);
    }

    .sort-icon {
      display: inline-block;
      margin-left: 0.25em;
      font-size: 0.75em;
    }
    .sort-icon--inactive { opacity: 0.3; }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      color: var(--ui-color-text-secondary, #6b7280);
      border-top: 1px solid var(--ui-color-border, #e2e8f0);
    }

    .page-btn {
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--ui-color-border, #e2e8f0);
      border-radius: 0.25rem;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .page-btn:disabled { opacity: 0.4; cursor: default; }

    .empty {
      text-align: center;
      padding: 2rem;
      color: var(--ui-color-text-secondary, #94a3b8);
    }
  `;

  @property({ type: Array }) columns: DataGridColumn[] = [];
  @property({ type: Array }) rows: Record<string, unknown>[] = [];
  @property({ type: Number }) pageSize = 10;
  @property({ type: Boolean }) sortable = false;
  @property({ type: Boolean, reflect: true }) striped = false;
  @property({ type: Boolean }) bordered = false;

  @state() private _sortField = '';
  @state() private _sortDir: 'asc' | 'desc' = 'asc';
  @state() private _page = 1;

  private get _sortedRows(): Record<string, unknown>[] {
    if (!this._sortField) return [...this.rows];
    const dir = this._sortDir === 'asc' ? 1 : -1;
    return [...this.rows].sort((a, b) => {
      const av = a[this._sortField];
      const bv = b[this._sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }

  private get _pagedRows(): Record<string, unknown>[] {
    if (!this.pageSize) return this._sortedRows;
    const start = (this._page - 1) * this.pageSize;
    return this._sortedRows.slice(start, start + this.pageSize);
  }

  private get _totalPages(): number {
    if (!this.pageSize || this.rows.length === 0) return 1;
    return Math.ceil(this.rows.length / this.pageSize);
  }

  private _onSort(field: string) {
    if (this._sortField === field) {
      this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortField = field;
      this._sortDir = 'asc';
    }
    this._page = 1;
    this.dispatchEvent(
      new CustomEvent('ui-sort', {
        detail: { field: this._sortField, direction: this._sortDir },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _goToPage(p: number) {
    this._page = Math.max(1, Math.min(p, this._totalPages));
    this.dispatchEvent(
      new CustomEvent('ui-page', {
        detail: { page: this._page },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${this.columns.map((col) => {
                const canSort = this.sortable && col.sortable !== false;
                const isSorted = this._sortField === col.field;
                return html`
                  <th
                    class="${canSort ? 'sortable' : ''} ${col.align ? `align-${col.align}` : ''}"
                    style=${col.width ? `width:${col.width}px` : ''}
                    @click=${canSort ? () => this._onSort(col.field) : undefined}
                  >
                    ${col.headerName}
                    ${canSort
                      ? html`<span class="sort-icon ${isSorted ? '' : 'sort-icon--inactive'}"
                          >${isSorted ? (this._sortDir === 'asc' ? '▲' : '▼') : '▲'}</span>`
                      : nothing}
                  </th>
                `;
              })}
            </tr>
          </thead>
          <tbody>
            ${this._pagedRows.length === 0
              ? html`<tr><td class="empty" colspan=${this.columns.length}>No data</td></tr>`
              : this._pagedRows.map(
                  (row) => html`
                    <tr class="${this.striped ? 'striped' : ''}">
                      ${this.columns.map(
                        (col) => html`<td class="${col.align ? `align-${col.align}` : ''}">${row[col.field] ?? ''}</td>`,
                      )}
                    </tr>
                  `,
                )}
          </tbody>
        </table>
      </div>
      ${this._totalPages > 1
        ? html`
          <div class="pagination" part="pagination">
            <span>${(this._page - 1) * this.pageSize + 1}–${Math.min(this._page * this.pageSize, this.rows.length)} of ${this.rows.length}</span>
            <button class="page-btn" type="button" ?disabled=${this._page <= 1} @click=${() => this._goToPage(this._page - 1)}>‹ Prev</button>
            <button class="page-btn" type="button" ?disabled=${this._page >= this._totalPages} @click=${() => this._goToPage(this._page + 1)}>Next ›</button>
          </div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-data-grid': UiDataGrid;
  }
}
