import React, { useMemo, type HTMLAttributes } from 'react';
import { pivotData, type AggregateOperation } from './dataEngine';
import type { BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

export interface PivotValueDefinition { field?: string; operation: AggregateOperation; label: string; }
export interface PivotGridConfig { rows: string[]; column: string; values: PivotValueDefinition[]; }
export interface PivotGridProps<T extends Record<string, unknown>> extends BaseProps, Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  rows: readonly T[];
  config: PivotGridConfig;
  formatValue?: (value: unknown, definition: PivotValueDefinition) => React.ReactNode;
  emptyMessage?: React.ReactNode;
}

const defaultFormat = (value: unknown) => typeof value === 'number'
  ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)
  : String(value ?? '—');

export function PivotGrid<T extends Record<string, unknown>>({ rows, config, formatValue = defaultFormat, emptyMessage = 'No rows', className, style, xstyle, testId, ...rest }: PivotGridProps<T>) {
  const result = useMemo(() => pivotData(rows, {
    rows: config.rows,
    column: config.column,
    values: config.values.map((value, index) => ({ field: value.field, operation: value.operation, as: `value-${index}` })),
  }), [rows, config]);
  const resolvedStyle = { ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : {}), ...style };
  return <div className={cx('ui-pivot-grid', className)} style={resolvedStyle} data-testid={testId} {...rest}>
    <table aria-label="Pivot data"><thead><tr>
      <th className="ui-pivot-grid__dimension">{config.rows.join(' / ')}</th>
      {result.columns.flatMap((column) => config.values.map((value) => <th key={`${String(column)}-${value.label}`}>{String(column)} · {value.label}</th>))}
      {config.values.map((value) => <th key={`total-${value.label}`}>Total · {value.label}</th>)}
    </tr></thead><tbody>
      {result.rows.map((row) => <tr key={row.id}>
        <td className="ui-pivot-grid__dimension">{config.rows.map((field) => String(row.dimensions[field] ?? '—')).join(' / ')}</td>
        {result.columns.flatMap((column) => config.values.map((value, index) => <td key={`${String(column)}-${value.label}`}>{formatValue(row.cells[String(column)]?.[`value-${index}`], value)}</td>))}
        {config.values.map((value, index) => <td className="ui-pivot-grid__total" key={value.label}>{formatValue(row.totals[`value-${index}`], value)}</td>)}
      </tr>)}
      {result.rows.length === 0 && <tr><td colSpan={1 + result.columns.length * config.values.length + config.values.length}>{emptyMessage}</td></tr>}
      <tr className="ui-pivot-grid__grand"><td className="ui-pivot-grid__dimension">Grand total</td><td colSpan={Math.max(1, result.columns.length * config.values.length)} />{config.values.map((value, index) => <td key={value.label}>{formatValue(result.totals[`value-${index}`], value)}</td>)}</tr>
    </tbody></table>
  </div>;
}
