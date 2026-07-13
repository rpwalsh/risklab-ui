// @risklab/ui - data grid with explicit client/server operation modes.

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { BaseProps } from '../styling/types';
import { cx } from '../styling/cx';
import { Table, type Column, type TableSortDirection } from './Table';
import { queryData } from '@risklab/ui-data';

export interface SortModelEntry {
  field: string;
  sort: 'asc' | 'desc';
}

export interface FilterModelEntry {
  field: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
  value: string;
}

export interface DataGridColumn<T extends Record<string, unknown>> extends Column<T> {
  filterable?: boolean;
}

export interface DataGridProps<T extends Record<string, unknown>>
  extends BaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'className'> {
  columns: DataGridColumn<T>[];
  rows: T[];
  pageSize?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  totalRows?: number;
  paginationMode?: 'client' | 'server';
  sortingMode?: 'client' | 'server';
  filteringMode?: 'client' | 'server';
  sortModel?: SortModelEntry[];
  onSortModelChange?: (model: SortModelEntry[]) => void;
  filterModel?: FilterModelEntry[];
  onFilterModelChange?: (model: FilterModelEntry[]) => void;
  checkboxSelection?: boolean;
  rowHeight?: number;
  headerHeight?: number;
  loading?: boolean;
  getRowId?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  selectedRowIds?: Iterable<string | number>;
  onSelectedRowIdsChange?: (ids: ReadonlySet<string | number>) => void;
  emptyMessage?: ReactNode;
}

interface PaginationProps {
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, pageSize, totalRows, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * pageSize + 1;
  const end = Math.min((safePage + 1) * pageSize, totalRows);
  return (
    <nav className="ui-datagrid-pagination" aria-label="Pagination">
      <span>{totalRows === 0 ? '0 rows' : `${start}-${end} of ${totalRows}`}</span>
      <button
        type="button"
        className="ui-datagrid-pagination-btn"
        disabled={safePage <= 0}
        onClick={() => onPageChange(safePage - 1)}
        aria-label="Previous page"
      >
        Previous
      </button>
      <span aria-current="page">{safePage + 1} / {totalPages}</span>
      <button
        type="button"
        className="ui-datagrid-pagination-btn"
        disabled={safePage >= totalPages - 1}
        onClick={() => onPageChange(safePage + 1)}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}

function DataGridInner<T extends Record<string, unknown>>(
  {
    columns,
    rows,
    pageSize = 25,
    page: controlledPage,
    onPageChange,
    totalRows: externalTotalRows,
    paginationMode: paginationModeProp,
    sortingMode = 'client',
    filteringMode = 'client',
    sortModel: controlledSortModel,
    onSortModelChange,
    filterModel: controlledFilterModel,
    onFilterModelChange,
    checkboxSelection = false,
    rowHeight,
    headerHeight,
    loading = false,
    getRowId,
    onRowClick,
    selectedRowIds,
    onSelectedRowIdsChange,
    emptyMessage,
    className,
    style,
    xstyle,
    testId,
    ...rest
  }: DataGridProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [internalPage, setInternalPage] = useState(0);
  const [internalSortModel, setInternalSortModel] = useState<SortModelEntry[]>([]);
  const [internalFilterModel, setInternalFilterModel] = useState<FilterModelEntry[]>([]);
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string | number>>(new Set());
  const generatedIds = useRef(new WeakMap<object, string>());
  const nextGeneratedId = useRef(0);

  const page = controlledPage ?? internalPage;
  const paginationMode = paginationModeProp ?? (externalTotalRows === undefined ? 'client' : 'server');
  const sortModel = controlledSortModel ?? internalSortModel;
  const filterModel = controlledFilterModel ?? internalFilterModel;
  const selectedIds = useMemo(
    () => selectedRowIds ? new Set(selectedRowIds) : internalSelectedIds,
    [selectedRowIds, internalSelectedIds],
  );

  const changePage = useCallback((next: number) => {
    if (onPageChange) onPageChange(next);
    else setInternalPage(next);
  }, [onPageChange]);
  const changeSort = useCallback((model: SortModelEntry[]) => {
    if (onSortModelChange) onSortModelChange(model);
    else setInternalSortModel(model);
  }, [onSortModelChange]);
  const changeFilter = useCallback((model: FilterModelEntry[]) => {
    if (onFilterModelChange) onFilterModelChange(model);
    else setInternalFilterModel(model);
  }, [onFilterModelChange]);

  const sortKey = sortModel.map((item) => `${item.field}:${item.sort}`).join(',');
  const filterKey = filterModel.map((item) => `${item.field}:${item.operator}:${item.value}`).join(',');
  useEffect(() => {
    if (controlledPage === undefined) setInternalPage(0);
  }, [controlledPage, sortKey, filterKey]);

  const processed = useMemo(() => queryData(rows, {
    filters: filteringMode === 'client' ? filterModel : [],
    sort: sortingMode === 'client'
      ? sortModel.map(({ field, sort }) => ({ field, direction: sort }))
      : [],
  }).rows, [rows, filterModel, filteringMode, sortModel, sortingMode]);
  const sorted = processed;
  const totalRows = paginationMode === 'server' ? (externalTotalRows ?? rows.length) : sorted.length;
  const visibleRows = useMemo(
    () => paginationMode === 'client'
      ? sorted.slice(page * pageSize, (page + 1) * pageSize)
      : sorted,
    [sorted, page, pageSize, paginationMode],
  );

  const resolveRowId = useCallback((row: T, index: number): string | number => {
    if (getRowId) return getRowId(row, page * pageSize + index);
    if (typeof row.id === 'string' || typeof row.id === 'number') return row.id;
    const cached = generatedIds.current.get(row);
    if (cached) return cached;
    const generated = `risklab-row-${nextGeneratedId.current++}`;
    generatedIds.current.set(row, generated);
    return generated;
  }, [getRowId, page, pageSize]);
  const visibleIds = useMemo(() => visibleRows.map(resolveRowId), [visibleRows, resolveRowId]);
  const localSelected = useMemo(() => {
    const result = new Set<number>();
    visibleIds.forEach((id, index) => { if (selectedIds.has(id)) result.add(index); });
    return result;
  }, [visibleIds, selectedIds]);

  const handleRowSelect = useCallback((index: number, selected: boolean) => {
    const id = visibleIds[index];
    if (id === undefined) return;
    const next = new Set(selectedIds);
    if (selected) next.add(id);
    else next.delete(id);
    if (selectedRowIds === undefined) setInternalSelectedIds(next);
    onSelectedRowIdsChange?.(next);
  }, [visibleIds, selectedIds, selectedRowIds, onSelectedRowIdsChange]);

  const tableColumns = useMemo<Column<T>[]>(() => columns.map((column) => ({
    key: column.key,
    header: column.header,
    render: column.render,
    width: column.width,
    align: column.align,
    sortable: column.sortable ?? false,
  })), [columns]);
  const currentSort = sortModel[0];

  const resolvedStyle: CSSProperties | undefined = style || xstyle ? {
    ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : undefined),
    ...(Array.isArray(xstyle)
      ? xstyle.reduce<Record<string, string | number>>((result, item) => item ? { ...result, ...item } : result, {})
      : undefined),
    ...style,
  } : undefined;

  return (
    <div
      ref={ref}
      className={cx('ui-datagrid', className)}
      {...(resolvedStyle ? { style: resolvedStyle } : undefined)}
      data-testid={testId}
      aria-busy={loading ? 'true' : undefined}
      aria-rowcount={totalRows}
      {...rest}
    >
      {columns.some((column) => column.filterable) && (
        <div className="ui-datagrid-filters" role="group" aria-label="Data filters">
          {columns.filter((column) => column.filterable).map((column) => {
            const field = String(column.key);
            const active = filterModel.find((filter) => filter.field === field);
            return (
              <label key={field} className="ui-datagrid-filter">
                <span>{column.header}</span>
                <input
                  type="search"
                  value={active?.value ?? ''}
                  aria-label={`Filter ${String(column.header)}`}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    const remaining = filterModel.filter((filter) => filter.field !== field);
                    changeFilter(value
                      ? [...remaining, { field, operator: active?.operator ?? 'contains', value }]
                      : remaining);
                  }}
                />
              </label>
            );
          })}
        </div>
      )}
      <Table<T>
        columns={tableColumns}
        data={visibleRows}
        sortColumn={currentSort?.field}
        sortDirection={currentSort?.sort}
        onSort={(field: string, direction: TableSortDirection) => changeSort([{ field, sort: direction }])}
        stickyHeader
        hover
        loading={loading}
        emptyMessage={emptyMessage}
        selectedRows={localSelected.size ? localSelected : undefined}
        onRowSelect={checkboxSelection ? handleRowSelect : undefined}
        onRowClick={onRowClick
          ? (row, index) => onRowClick(row, page * pageSize + index)
          : undefined}
        getRowKey={resolveRowId}
        style={{
          ...(rowHeight != null
            ? { '--ui-table-cell-padding': `${(rowHeight - 20) / 2}px 0.75rem` } as CSSProperties
            : undefined),
          ...(headerHeight != null
            ? { '--ui-table-th-height': `${headerHeight}px` } as CSSProperties
            : undefined),
        }}
      />
      <Pagination page={page} pageSize={pageSize} totalRows={totalRows} onPageChange={changePage} />
    </div>
  );
}

export const DataGrid = forwardRef(DataGridInner) as <T extends Record<string, unknown>>(
  props: DataGridProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;
