import { aggregateRows } from './engine';
import type { AggregateRule, DataAccessor, DataField } from './types';

export interface PivotConfig<T> {
  rows: DataField<T>[];
  column: DataField<T>;
  values: AggregateRule<T>[];
}

export interface PivotRow {
  id: string;
  dimensions: Record<string, unknown>;
  cells: Record<string, Record<string, unknown>>;
  totals: Record<string, unknown>;
}

export interface PivotResult {
  columns: unknown[];
  rows: PivotRow[];
  totals: Record<string, unknown>;
}

const pathAccessor: DataAccessor<Record<string, unknown>> = {
  get(row, field) {
    return String(field).split('.').reduce<unknown>((current, key) =>
      current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined, row);
  },
};

export function pivotData<T extends Record<string, unknown>>(
  source: readonly T[],
  config: PivotConfig<T>,
  accessor: DataAccessor<T> = pathAccessor as DataAccessor<T>,
): PivotResult {
  const columnValues = [...new Set(source.map((row) => accessor.get(row, config.column)))];
  columnValues.sort((left, right) => String(left).localeCompare(String(right), undefined, { numeric: true }));
  const rowBuckets = new Map<string, { dimensions: Record<string, unknown>; rows: T[] }>();
  for (const row of source) {
    const dimensions = Object.fromEntries(config.rows.map((field) => [String(field), accessor.get(row, field)]));
    const key = JSON.stringify(Object.values(dimensions));
    const bucket = rowBuckets.get(key) ?? { dimensions, rows: [] };
    bucket.rows.push(row);
    rowBuckets.set(key, bucket);
  }
  const rows = [...rowBuckets.entries()].map(([id, bucket]) => {
    const cells = Object.fromEntries(columnValues.map((column) => {
      const matching = bucket.rows.filter((row) => Object.is(accessor.get(row, config.column), column));
      return [String(column), aggregateRows(matching, config.values, accessor)];
    }));
    return { id, dimensions: bucket.dimensions, cells, totals: aggregateRows(bucket.rows, config.values, accessor) };
  });
  return { columns: columnValues, rows, totals: aggregateRows(source, config.values, accessor) };
}
