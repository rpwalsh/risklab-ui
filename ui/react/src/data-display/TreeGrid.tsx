import React, { useCallback, useMemo, useState, type HTMLAttributes } from 'react';
import type { BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

export interface TreeGridRow extends Record<string, unknown> { id: string; children?: TreeGridRow[]; }
export interface TreeGridColumn<T extends TreeGridRow> { field: Extract<keyof T, string> | string; headerName: string; width?: number; align?: 'left' | 'center' | 'right'; render?: (value: unknown, row: T) => React.ReactNode; }
export interface TreeGridProps<T extends TreeGridRow> extends BaseProps, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onSelect'> {
  columns: TreeGridColumn<T>[]; rows: readonly T[]; defaultExpanded?: Iterable<string>; expanded?: Iterable<string>;
  onExpandedChange?: (expanded: ReadonlySet<string>) => void; selectedId?: string; onSelect?: (row: T) => void;
}

export function TreeGrid<T extends TreeGridRow>({ columns, rows, defaultExpanded = [], expanded, onExpandedChange, selectedId, onSelect, className, style, xstyle, testId, ...rest }: TreeGridProps<T>) {
  const [internalExpanded, setInternalExpanded] = useState(() => new Set(defaultExpanded));
  const open = useMemo(() => expanded ? new Set(expanded) : internalExpanded, [expanded, internalExpanded]);
  const toggle = useCallback((id: string) => { const next = new Set(open); if (next.has(id)) next.delete(id); else next.add(id); if (expanded === undefined) setInternalExpanded(next); onExpandedChange?.(next); }, [open, expanded, onExpandedChange]);
  const visible = useMemo(() => { const output: Array<{ row: T; depth: number }> = []; const visit = (items: readonly T[], depth: number) => items.forEach((row) => { output.push({ row, depth }); if (row.children?.length && open.has(row.id)) visit(row.children as T[], depth + 1); }); visit(rows, 0); return output; }, [rows, open]);
  const resolvedStyle = { ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : {}), ...style };
  return <div className={cx('ui-tree-grid', className)} style={resolvedStyle} data-testid={testId} {...rest}>
    <table role="treegrid"><thead><tr>{columns.map((column) => <th key={column.field} style={{ width: column.width }}>{column.headerName}</th>)}</tr></thead><tbody>
      {visible.map(({ row, depth }) => <tr key={row.id} aria-level={depth + 1} aria-expanded={row.children?.length ? open.has(row.id) : undefined} aria-selected={selectedId === row.id} onClick={() => onSelect?.(row)}>
        {columns.map((column, index) => <td key={column.field} style={{ textAlign: column.align }}><div className={index === 0 ? 'ui-tree-grid__tree-cell' : undefined} style={index === 0 ? { paddingInlineStart: depth * 18 } : undefined}>
          {index === 0 && (row.children?.length ? <button type="button" aria-label={`${open.has(row.id) ? 'Collapse' : 'Expand'} ${String(row[column.field] ?? row.id)}`} aria-expanded={open.has(row.id)} onClick={(event) => { event.stopPropagation(); toggle(row.id); }}>{open.has(row.id) ? '−' : '+'}</button> : <span className="ui-tree-grid__leaf">•</span>)}
          <span>{column.render ? column.render(row[column.field], row) : String(row[column.field] ?? '')}</span>
        </div></td>)}
      </tr>)}
    </tbody></table>
  </div>;
}
