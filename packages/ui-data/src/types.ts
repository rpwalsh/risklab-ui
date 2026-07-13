export type DataField<T> = Extract<keyof T, string> | (string & {});
export type FilterOperator =
  | 'equals' | 'notEquals' | 'contains' | 'notContains'
  | 'startsWith' | 'endsWith' | 'greaterThan' | 'greaterThanOrEqual'
  | 'lessThan' | 'lessThanOrEqual' | 'between' | 'in' | 'notIn'
  | 'isEmpty' | 'isNotEmpty';

export interface FilterRule<T> {
  field: DataField<T>;
  operator: FilterOperator;
  value?: unknown;
  caseSensitive?: boolean;
}

export interface SortRule<T> {
  field: DataField<T>;
  direction: 'asc' | 'desc';
  nulls?: 'first' | 'last';
}

export interface GroupRule<T> {
  field: DataField<T>;
  direction?: 'asc' | 'desc';
}

export type AggregateOperation = 'sum' | 'average' | 'min' | 'max' | 'count' | 'countDistinct' | 'first' | 'last';

export interface AggregateRule<T> {
  field?: DataField<T>;
  operation: AggregateOperation;
  as: string;
}

export interface PaginationRule {
  page: number;
  pageSize: number;
}

export interface DataQuery<T> {
  filters?: FilterRule<T>[];
  filterLogic?: 'and' | 'or';
  sort?: SortRule<T>[];
  groups?: GroupRule<T>[];
  aggregates?: AggregateRule<T>[];
  pagination?: PaginationRule;
}

export interface DataGroup<T> {
  id: string;
  field: DataField<T>;
  value: unknown;
  depth: number;
  count: number;
  aggregates: Record<string, unknown>;
  rows: T[];
  children: DataGroup<T>[];
}

export interface DataQueryResult<T> {
  rows: T[];
  totalRows: number;
  page: number;
  pageSize: number;
  pageCount: number;
  groups: DataGroup<T>[];
  aggregates: Record<string, unknown>;
}

export interface FacetValue {
  value: unknown;
  count: number;
}

export interface DataAccessor<T> {
  get(row: T, field: DataField<T>): unknown;
}
