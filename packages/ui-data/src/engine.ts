import type {
  AggregateRule,
  DataAccessor,
  DataField,
  DataGroup,
  DataQuery,
  DataQueryResult,
  FacetValue,
  FilterRule,
  GroupRule,
  SortRule,
} from './types';

const defaultAccessor: DataAccessor<Record<string, unknown>> = {
  get(row, field) {
    return String(field).split('.').reduce<unknown>((value, part) => {
      if (!value || typeof value !== 'object') return undefined;
      return (value as Record<string, unknown>)[part];
    }, row);
  },
};

function isEmpty(value: unknown): boolean {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0);
}

function normalize(value: unknown, caseSensitive = false): unknown {
  return typeof value === 'string' && !caseSensitive ? value.toLocaleLowerCase() : value;
}

function compare(left: unknown, right: unknown): number {
  if (left instanceof Date) left = left.getTime();
  if (right instanceof Date) right = right.getTime();
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

export function matchesFilter<T>(row: T, rule: FilterRule<T>, accessor: DataAccessor<T>): boolean {
  const raw = accessor.get(row, rule.field);
  const left = normalize(raw, rule.caseSensitive);
  const right = normalize(rule.value, rule.caseSensitive);
  const values = Array.isArray(right) ? right : [];
  switch (rule.operator) {
    case 'equals': return left === right;
    case 'notEquals': return left !== right;
    case 'contains': return String(left ?? '').includes(String(right ?? ''));
    case 'notContains': return !String(left ?? '').includes(String(right ?? ''));
    case 'startsWith': return String(left ?? '').startsWith(String(right ?? ''));
    case 'endsWith': return String(left ?? '').endsWith(String(right ?? ''));
    case 'greaterThan': return compare(left, right) > 0;
    case 'greaterThanOrEqual': return compare(left, right) >= 0;
    case 'lessThan': return compare(left, right) < 0;
    case 'lessThanOrEqual': return compare(left, right) <= 0;
    case 'between': return values.length >= 2 && compare(left, values[0]) >= 0 && compare(left, values[1]) <= 0;
    case 'in': return values.some((value) => normalize(value, rule.caseSensitive) === left);
    case 'notIn': return !values.some((value) => normalize(value, rule.caseSensitive) === left);
    case 'isEmpty': return isEmpty(raw);
    case 'isNotEmpty': return !isEmpty(raw);
  }
}

export function filterRows<T>(rows: readonly T[], rules: readonly FilterRule<T>[], logic: 'and' | 'or', accessor: DataAccessor<T>): T[] {
  if (rules.length === 0) return [...rows];
  return rows.filter((row) => logic === 'and'
    ? rules.every((rule) => matchesFilter(row, rule, accessor))
    : rules.some((rule) => matchesFilter(row, rule, accessor)));
}

export function sortRows<T>(rows: readonly T[], rules: readonly SortRule<T>[], accessor: DataAccessor<T>): T[] {
  if (rules.length === 0) return [...rows];
  return rows.map((row, index) => ({ row, index })).sort((a, b) => {
    for (const rule of rules) {
      const left = accessor.get(a.row, rule.field);
      const right = accessor.get(b.row, rule.field);
      if (left == null || right == null) {
        if (left == null && right == null) continue;
        const nullResult = left == null ? -1 : 1;
        return (rule.nulls ?? 'last') === 'first' ? nullResult : -nullResult;
      }
      const result = compare(left, right);
      if (result !== 0) return rule.direction === 'desc' ? -result : result;
    }
    return a.index - b.index;
  }).map(({ row }) => row);
}

export function aggregateRows<T>(rows: readonly T[], rules: readonly AggregateRule<T>[], accessor: DataAccessor<T>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const rule of rules) {
    const values = rule.field === undefined ? rows : rows.map((row) => accessor.get(row, rule.field!));
    const numeric = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    switch (rule.operation) {
      case 'sum': result[rule.as] = numeric.reduce((sum, value) => sum + value, 0); break;
      case 'average': result[rule.as] = numeric.length ? numeric.reduce((sum, value) => sum + value, 0) / numeric.length : null; break;
      case 'min': result[rule.as] = numeric.length ? Math.min(...numeric) : null; break;
      case 'max': result[rule.as] = numeric.length ? Math.max(...numeric) : null; break;
      case 'count': result[rule.as] = rows.length; break;
      case 'countDistinct': result[rule.as] = new Set(values).size; break;
      case 'first': result[rule.as] = values[0] ?? null; break;
      case 'last': result[rule.as] = values.at(-1) ?? null; break;
    }
  }
  return result;
}

function groupRows<T>(
  rows: readonly T[],
  rules: readonly GroupRule<T>[],
  aggregates: readonly AggregateRule<T>[],
  accessor: DataAccessor<T>,
  depth = 0,
  path = 'root',
): DataGroup<T>[] {
  const rule = rules[depth];
  if (!rule) return [];
  const buckets = new Map<unknown, T[]>();
  for (const row of rows) {
    const value = accessor.get(row, rule.field);
    const bucket = buckets.get(value) ?? [];
    bucket.push(row);
    buckets.set(value, bucket);
  }
  const ordered = [...buckets.entries()].sort(([left], [right]) => {
    const result = compare(left, right);
    return rule.direction === 'desc' ? -result : result;
  });
  return ordered.map(([value, bucket], index) => {
    const id = `${path}/${String(rule.field)}:${String(value)}:${index}`;
    return {
      id,
      field: rule.field,
      value,
      depth,
      count: bucket.length,
      aggregates: aggregateRows(bucket, aggregates, accessor),
      rows: [...bucket],
      children: groupRows(bucket, rules, aggregates, accessor, depth + 1, id),
    };
  });
}

export function queryData<T extends Record<string, unknown>>(
  source: readonly T[],
  query: DataQuery<T> = {},
  accessor: DataAccessor<T> = defaultAccessor as DataAccessor<T>,
): DataQueryResult<T> {
  const filtered = filterRows(source, query.filters ?? [], query.filterLogic ?? 'and', accessor);
  const sorted = sortRows(filtered, query.sort ?? [], accessor);
  const pageSize = Math.max(1, Math.floor(query.pagination?.pageSize ?? Math.max(1, sorted.length)));
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.max(0, Math.min(Math.floor(query.pagination?.page ?? 0), pageCount - 1));
  const rows = query.pagination ? sorted.slice(page * pageSize, (page + 1) * pageSize) : sorted;
  return {
    rows,
    totalRows: sorted.length,
    page,
    pageSize,
    pageCount,
    groups: groupRows(sorted, query.groups ?? [], query.aggregates ?? [], accessor),
    aggregates: aggregateRows(sorted, query.aggregates ?? [], accessor),
  };
}

export function facetData<T extends Record<string, unknown>>(
  source: readonly T[],
  field: DataField<T>,
  accessor: DataAccessor<T> = defaultAccessor as DataAccessor<T>,
): FacetValue[] {
  const counts = new Map<unknown, number>();
  for (const row of source) {
    const value = accessor.get(row, field);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || compare(a.value, b.value));
}
