import { describe, expect, it } from 'vitest';
import { facetData, parseDataQuery, queryData, serializeDataQuery } from '../src/index';

interface Row extends Record<string, unknown> {
  id: string;
  region: string;
  status: string;
  priority: number;
  cost: number | null;
  asset: { type: string };
}

const rows: Row[] = [
  { id: 'a', region: 'North', status: 'active', priority: 2, cost: 10, asset: { type: 'air' } },
  { id: 'b', region: 'South', status: 'active', priority: 3, cost: 20, asset: { type: 'surface' } },
  { id: 'c', region: 'North', status: 'hold', priority: 1, cost: null, asset: { type: 'air' } },
  { id: 'd', region: 'South', status: 'active', priority: 3, cost: 15, asset: { type: 'air' } },
];

describe('framework-neutral data engine', () => {
  it('filters nested fields without mutating the source', () => {
    const source = [...rows];
    const result = queryData(rows, { filters: [{ field: 'asset.type', operator: 'equals', value: 'air' }] });
    expect(result.rows.map((row) => row.id)).toEqual(['a', 'c', 'd']);
    expect(rows).toEqual(source);
  });

  it('supports and/or filters and range operators', () => {
    expect(queryData(rows, { filters: [
      { field: 'status', operator: 'equals', value: 'active' },
      { field: 'priority', operator: 'between', value: [2, 2] },
    ] }).rows.map((row) => row.id)).toEqual(['a']);
    expect(queryData(rows, { filterLogic: 'or', filters: [
      { field: 'status', operator: 'equals', value: 'hold' },
      { field: 'cost', operator: 'greaterThan', value: 18 },
    ] }).rows.map((row) => row.id)).toEqual(['b', 'c']);
  });

  it('performs stable multi-sort with explicit null placement', () => {
    const result = queryData(rows, { sort: [
      { field: 'priority', direction: 'desc' },
      { field: 'id', direction: 'desc' },
    ] });
    expect(result.rows.map((row) => row.id)).toEqual(['d', 'b', 'a', 'c']);
  });

  it('builds recursive groups and aggregate summaries', () => {
    const result = queryData(rows, {
      groups: [{ field: 'region' }, { field: 'status' }],
      aggregates: [
        { operation: 'count', as: 'count' },
        { field: 'cost', operation: 'sum', as: 'totalCost' },
        { field: 'asset.type', operation: 'countDistinct', as: 'assetTypes' },
      ],
    });
    expect(result.aggregates).toEqual({ count: 4, totalCost: 45, assetTypes: 2 });
    expect(result.groups).toHaveLength(2);
    expect(result.groups[0]).toMatchObject({ value: 'North', count: 2, aggregates: { totalCost: 10 } });
    expect(result.groups[0]!.children).toHaveLength(2);
  });

  it('paginates after filtering and sorting', () => {
    const result = queryData(rows, {
      sort: [{ field: 'id', direction: 'desc' }],
      pagination: { page: 1, pageSize: 2 },
    });
    expect(result.rows.map((row) => row.id)).toEqual(['b', 'a']);
    expect(result).toMatchObject({ totalRows: 4, page: 1, pageCount: 2 });
  });

  it('computes deterministic facets', () => {
    expect(facetData(rows, 'asset.type')).toEqual([
      { value: 'air', count: 3 },
      { value: 'surface', count: 1 },
    ]);
  });

  it('round-trips a versioned server query contract', () => {
    const query = { filters: [{ field: 'status', operator: 'equals' as const, value: 'active' }], pagination: { page: 0, pageSize: 50 } };
    expect(parseDataQuery<Row>(serializeDataQuery(query))).toEqual(query);
    expect(() => parseDataQuery('{"version":"other","query":{}}')).toThrow(/Invalid data query/);
  });
});
