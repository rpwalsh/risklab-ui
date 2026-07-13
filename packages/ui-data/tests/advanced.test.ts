import { describe, expect, it } from 'vitest';
import { DataEditHistory, pivotData, VariableSizeIndex } from '../src/index';

describe('advanced data primitives', () => {
  it('indexes variable-size windows with logarithmic offset lookup', () => {
    const index = new VariableSizeIndex(5, (row) => row % 2 === 0 ? 20 : 30);
    expect(index.totalSize).toBe(120);
    expect(index.indexAt(49)).toBe(1);
    expect(index.indexAt(50)).toBe(2);
    index.setSize(1, 40);
    expect(index.offsetAt(2)).toBe(60);
    expect(index.window(55, 40, 0)).toEqual({ start: 1, end: 4, offsetTop: 20, totalSize: 130 });
  });

  it('applies immutable edit transactions with undo and redo', () => {
    const source = [{ id: 'a', status: 'hold', score: 1 }, { id: 'b', status: 'active', score: 2 }];
    const history = new DataEditHistory(source, (row) => row.id);
    history.batch([
      { rowId: 'a', patch: { status: 'active', score: 3 } },
      { rowId: 'b', patch: { score: 4 } },
    ], 'Approve rows');
    expect(history.snapshot()).toEqual([{ id: 'a', status: 'active', score: 3 }, { id: 'b', status: 'active', score: 4 }]);
    expect(source[0]).toEqual({ id: 'a', status: 'hold', score: 1 });
    history.undo();
    expect(history.snapshot()).toEqual(source);
    history.redo();
    expect(history.snapshot()[1]!.score).toBe(4);
  });

  it('builds multi-measure pivot matrices and totals', () => {
    const result = pivotData([
      { region: 'North', quarter: 'Q1', cost: 10 },
      { region: 'North', quarter: 'Q2', cost: 20 },
      { region: 'South', quarter: 'Q1', cost: 5 },
    ], {
      rows: ['region'],
      column: 'quarter',
      values: [{ field: 'cost', operation: 'sum', as: 'cost' }, { operation: 'count', as: 'count' }],
    });
    expect(result.columns).toEqual(['Q1', 'Q2']);
    expect(result.rows[0]).toMatchObject({
      dimensions: { region: 'North' },
      cells: { Q1: { cost: 10, count: 1 }, Q2: { cost: 20, count: 1 } },
      totals: { cost: 30, count: 2 },
    });
    expect(result.totals).toEqual({ cost: 35, count: 3 });
  });
});
