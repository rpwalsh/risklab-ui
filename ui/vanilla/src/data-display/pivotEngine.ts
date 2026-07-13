export type AggregateOperation = 'sum' | 'average' | 'min' | 'max' | 'count' | 'countDistinct' | 'first' | 'last';
interface AggregateRule { field?: string; operation: AggregateOperation; as: string; }
const getValue = (row: Record<string, unknown>, field: string): unknown => field.split('.').reduce<unknown>((value, part) => value && typeof value === 'object' ? (value as Record<string, unknown>)[part] : undefined, row);
function aggregate(rows: readonly Record<string, unknown>[], rules: readonly AggregateRule[]): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const rule of rules) {
    const values = rule.field === undefined ? rows : rows.map((row) => getValue(row, rule.field!));
    const numeric = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    if (rule.operation === 'sum') output[rule.as] = numeric.reduce((sum, value) => sum + value, 0);
    else if (rule.operation === 'average') output[rule.as] = numeric.length ? numeric.reduce((sum, value) => sum + value, 0) / numeric.length : null;
    else if (rule.operation === 'min') output[rule.as] = numeric.length ? Math.min(...numeric) : null;
    else if (rule.operation === 'max') output[rule.as] = numeric.length ? Math.max(...numeric) : null;
    else if (rule.operation === 'count') output[rule.as] = rows.length;
    else if (rule.operation === 'countDistinct') output[rule.as] = new Set(values).size;
    else if (rule.operation === 'first') output[rule.as] = values[0] ?? null;
    else output[rule.as] = values.at(-1) ?? null;
  }
  return output;
}
export function pivotData(source: readonly Record<string, unknown>[], config: { rows: string[]; column: string; values: AggregateRule[] }) {
  const columns = [...new Set(source.map((row) => getValue(row, config.column)))].sort((left, right) => String(left).localeCompare(String(right), undefined, { numeric: true }));
  const buckets = new Map<string, { dimensions: Record<string, unknown>; rows: Record<string, unknown>[] }>();
  for (const row of source) {
    const dimensions = Object.fromEntries(config.rows.map((field) => [field, getValue(row, field)]));
    const key = JSON.stringify(Object.values(dimensions));
    const bucket = buckets.get(key) ?? { dimensions, rows: [] };
    bucket.rows.push(row);
    buckets.set(key, bucket);
  }
  const rows = [...buckets.entries()].map(([id, bucket]) => ({ id, dimensions: bucket.dimensions, cells: Object.fromEntries(columns.map((column) => [String(column), aggregate(bucket.rows.filter((row) => Object.is(getValue(row, config.column), column)), config.values)])), totals: aggregate(bucket.rows, config.values) }));
  return { columns, rows, totals: aggregate(source, config.values) };
}
