/**
 * @risklab/ui-solid — DataGrid
 * SolidJS full-featured data grid with sorting, pagination, striped rows.
 */

import {
  mergeProps,
  splitProps,
  createSignal,
  createMemo,
  Show,
  For,
  type Component,
} from 'solid-js';
import type { DataGridProps, DataGridColumn } from '../core/types';

export const DataGrid: Component<DataGridProps> = (rawProps) => {
  const props = mergeProps(
    {
      columns: [] as DataGridColumn[],
      rows: [] as Record<string, unknown>[],
      pageSize: 10,
      sortable: true,
      striped: false,
      bordered: false,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'columns',
    'rows',
    'pageSize',
    'sortable',
    'striped',
    'bordered',
    'onSort',
    'onPage',
    'class',
    'style',
  ]);

  const [sortField, setSortField] = createSignal<string | null>(null);
  const [sortDir, setSortDir] = createSignal<'asc' | 'desc'>('asc');
  const [page, setPage] = createSignal(0);

  const sortedRows = createMemo(() => {
    const rows = [...local.rows];
    const field = sortField();
    if (!field) return rows;
    const dir = sortDir();
    return rows.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return dir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const strA = String(aVal);
      const strB = String(bVal);
      return dir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  });

  const pagedRows = createMemo(() => {
    const start = page() * local.pageSize;
    return sortedRows().slice(start, start + local.pageSize);
  });

  const totalPages = createMemo(() =>
    Math.max(1, Math.ceil(local.rows.length / local.pageSize)),
  );

  const handleSort = (col: DataGridColumn) => {
    if (!local.sortable || col.sortable === false) return;
    const field = col.field;
    if (sortField() === field) {
      const newDir = sortDir() === 'asc' ? 'desc' : 'asc';
      setSortDir(newDir);
      local.onSort?.(field, newDir);
    } else {
      setSortField(field);
      setSortDir('asc');
      local.onSort?.(field, 'asc');
    }
  };

  const handlePage = (p: number) => {
    setPage(p);
    local.onPage?.(p);
  };

  return (
    <div
      class={local.class}
      style={{
        display: 'flex',
        'flex-direction': 'column',
        border: local.bordered ? '1px solid var(--ui-color-border, #e5e7eb)' : 'none',
        'border-radius': 'var(--ui-radius-md, 0.5rem)',
        overflow: 'hidden',
        'font-family': 'var(--ui-font-family, inherit)',
        'background-color': 'var(--ui-color-surface, #fff)',
        'box-sizing': 'border-box',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      <div style={{ overflow: 'auto' }}>
        <table
          style={{
            width: '100%',
            'border-collapse': 'collapse',
            'font-size': '0.875rem',
            'border-spacing': '0',
          }}
        >
          <thead>
            <tr>
              <For each={local.columns}>
                {(col) => (
                  <th
                    onClick={() => handleSort(col)}
                    aria-sort={
                      sortField() === col.field
                        ? sortDir() === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : local.sortable && col.sortable !== false
                          ? 'none'
                          : undefined
                    }
                    style={{
                      padding: '0.5rem 0.75rem',
                      'font-weight': '600',
                      'text-align': col.align ?? 'left',
                      'border-bottom': '2px solid var(--ui-color-border, #e5e7eb)',
                      'user-select': 'none',
                      'white-space': 'nowrap',
                      cursor:
                        local.sortable && col.sortable !== false
                          ? 'pointer'
                          : 'default',
                      width: col.width ? `${col.width}px` : 'auto',
                    }}
                  >
                    {col.headerName}
                    <Show when={sortField() === col.field}>
                      <span
                        style={{
                          display: 'inline-flex',
                          'margin-left': '0.25em',
                          'font-size': '0.75em',
                        }}
                      >
                        {sortDir() === 'asc' ? '▲' : '▼'}
                      </span>
                    </Show>
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={pagedRows()}>
              {(row, i) => (
                <tr
                  style={{
                    'background-color':
                      local.striped && i() % 2 === 1
                        ? 'rgba(0,0,0,0.02)'
                        : 'transparent',
                  }}
                >
                  <For each={local.columns}>
                    {(col) => (
                      <td
                        style={{
                          padding: '0.5rem 0.75rem',
                          'border-bottom': '1px solid var(--ui-color-border, #e5e7eb)',
                          'text-align': col.align ?? 'left',
                        }}
                      >
                        {row[col.field] != null ? String(row[col.field]) : ''}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

      <Show when={totalPages() > 1}>
        <div
          style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'flex-end',
            gap: '0.75rem',
            padding: '0.5rem 0.75rem',
            'font-size': '0.8125rem',
            color: 'var(--ui-color-text-secondary, #6b7280)',
            'border-top': '1px solid var(--ui-color-border, #e5e7eb)',
          }}
        >
          <span>
            Page {page() + 1} of {totalPages()}
          </span>
          <button
            type="button"
            disabled={page() === 0}
            onClick={() => handlePage(page() - 1)}
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid var(--ui-color-border, #e5e7eb)',
              'border-radius': '0.25rem',
              background: 'transparent',
              color: 'inherit',
              'font-size': 'inherit',
              cursor: page() === 0 ? 'default' : 'pointer',
              opacity: page() === 0 ? '0.4' : '1',
            }}
          >
            Prev
          </button>
          <button
            type="button"
            disabled={page() >= totalPages() - 1}
            onClick={() => handlePage(page() + 1)}
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid var(--ui-color-border, #e5e7eb)',
              'border-radius': '0.25rem',
              background: 'transparent',
              color: 'inherit',
              'font-size': 'inherit',
              cursor: page() >= totalPages() - 1 ? 'default' : 'pointer',
              opacity: page() >= totalPages() - 1 ? '0.4' : '1',
            }}
          >
            Next
          </button>
        </div>
      </Show>
    </div>
  );
};
