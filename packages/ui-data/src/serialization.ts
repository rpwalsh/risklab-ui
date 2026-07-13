import type { DataQuery } from './types';

const VERSION = 'risklab.data-query/v1' as const;

export interface SerializedDataQuery<T> {
  version: typeof VERSION;
  query: DataQuery<T>;
}

export function serializeDataQuery<T>(query: DataQuery<T>): string {
  return JSON.stringify({ version: VERSION, query });
}

export function parseDataQuery<T>(json: string): DataQuery<T> {
  const parsed = JSON.parse(json) as Partial<SerializedDataQuery<T>>;
  if (parsed.version !== VERSION || !parsed.query || typeof parsed.query !== 'object' || Array.isArray(parsed.query)) {
    throw new TypeError('Invalid data query document');
  }
  const query = parsed.query;
  if (query.pagination && (!Number.isInteger(query.pagination.page) || !Number.isInteger(query.pagination.pageSize) || query.pagination.page < 0 || query.pagination.pageSize < 1)) {
    throw new TypeError('Invalid pagination contract');
  }
  return query;
}
