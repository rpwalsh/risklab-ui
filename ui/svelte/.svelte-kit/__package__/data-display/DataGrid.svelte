<script lang="ts">
  import type { DataGridColumn } from '../core/types.js';

  let {
    columns = [] as DataGridColumn[],
    rows = [] as Record<string, unknown>[],
    pageSize = 10,
    sortable = true,
    striped = false,
    bordered = false,
    onsort,
    onpage,
  }: {
    columns?: DataGridColumn[];
    rows?: Record<string, unknown>[];
    pageSize?: number;
    sortable?: boolean;
    striped?: boolean;
    bordered?: boolean;
    onsort?: (field: string, dir: 'asc' | 'desc') => void;
    onpage?: (page: number) => void;
  } = $props();

  let sortField = $state('');
  let sortDir = $state<'asc' | 'desc'>('asc');
  let currentPage = $state(0);

  $effect(() => {
    rows;
    if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);
  });

  let sortedRows = $derived.by(() => {
    if (!sortField) return rows;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir;
      if (bVal == null) return -dir;
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  });

  let totalPages = $derived(Math.max(1, Math.ceil(sortedRows.length / pageSize)));
  let pagedRows = $derived(sortedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize));

  function handleSort(field: string) {
    if (!sortable) return;
    const col = columns.find(c => c.field === field);
    if (col && col.sortable === false) return;
    if (sortField === field) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDir = 'asc';
    }
    onsort?.(sortField, sortDir);
  }

  function goToPage(page: number) {
    if (page < 0 || page >= totalPages) return;
    currentPage = page;
    onpage?.(currentPage);
  }
</script>

<div class="ui-datagrid">
  <div class="ui-table-wrapper">
    <table class="ui-table" class:ui-table--striped={striped} data-size="md">
      <thead>
        <tr>
          {#each columns as col}
            <th
              class:ui-table-th--sortable={sortable && col.sortable !== false}
              class:ui-table-th--right={col.align === 'right'}
              class:ui-table-th--center={col.align === 'center'}
              style={col.width ? `width: ${col.width}px` : ''}
              onclick={sortable && col.sortable !== false ? () => handleSort(col.field) : undefined}
            >
              {col.headerName}
              {#if sortable && col.sortable !== false}
                <span
                  class="ui-table-sort-indicator"
                  class:ui-table-sort-indicator--inactive={sortField !== col.field}
                >
                  {sortField === col.field ? (sortDir === 'asc' ? '▲' : '▼') : '▲'}
                </span>
              {/if}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if pagedRows.length === 0}
          <tr>
            <td class="ui-table-td--empty" colspan={columns.length}>No data</td>
          </tr>
        {:else}
          {#each pagedRows as row, i}
            <tr class="ui-table-row">
              {#each columns as col}
                <td
                  class:ui-table-td--right={col.align === 'right'}
                  class:ui-table-td--center={col.align === 'center'}
                >
                  {row[col.field] ?? ''}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  {#if totalPages > 1}
    <div class="ui-datagrid-pagination">
      <span>Page {currentPage + 1} of {totalPages}</span>
      <button
        class="ui-datagrid-pagination-btn"
        type="button"
        disabled={currentPage === 0}
        onclick={() => goToPage(currentPage - 1)}
      >
        ← Prev
      </button>
      <button
        class="ui-datagrid-pagination-btn"
        type="button"
        disabled={currentPage >= totalPages - 1}
        onclick={() => goToPage(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  {/if}
</div>

<style>
  .ui-datagrid {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--ui-table-border, #e5e7eb);
    border-radius: var(--ui-datagrid-radius, 0.5rem);
    overflow: hidden;
    font-family: var(--ui-font-family, inherit);
    background-color: var(--ui-datagrid-bg, #fff);
    box-sizing: border-box;
  }
  .ui-table-wrapper { position: relative; overflow: auto; }
  .ui-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; border-spacing: 0; }
  .ui-table th {
    padding: 0.5rem 0.75rem;
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid var(--ui-table-border, #e5e7eb);
    user-select: none;
    white-space: nowrap;
  }
  .ui-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--ui-table-border, #e5e7eb); }
  .ui-table-th--sortable { cursor: pointer; }
  .ui-table-th--right, .ui-table-td--right { text-align: right; }
  .ui-table-th--center, .ui-table-td--center { text-align: center; }
  .ui-table-td--empty { text-align: center; padding: 2rem; color: #9ca3af; }
  .ui-table-sort-indicator { display: inline-flex; margin-left: 0.25em; font-size: 0.75em; }
  .ui-table-sort-indicator--inactive { opacity: 0.3; }
  .ui-table--striped tbody tr:nth-child(even) { background-color: rgba(0,0,0,0.02); }

  .ui-datagrid-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    color: #6b7280;
    border-top: 1px solid var(--ui-table-border, #e5e7eb);
  }
  .ui-datagrid-pagination-btn {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--ui-table-border, #e5e7eb);
    border-radius: 0.25rem;
    background: transparent;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
  }
  .ui-datagrid-pagination-btn:disabled { cursor: default; opacity: 0.4; }
</style>
