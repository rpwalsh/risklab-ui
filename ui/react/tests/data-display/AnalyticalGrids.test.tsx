import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PivotGrid } from '../../src/data-display/PivotGrid';
import { TreeGrid, type TreeGridRow } from '../../src/data-display/TreeGrid';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('analytical grid contracts', () => {
  let host: HTMLDivElement;
  let root: Root;
  beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
  afterEach(() => { act(() => root.unmount()); host.remove(); });

  it('renders pivot aggregates and totals from the data contract', () => {
    act(() => root.render(<PivotGrid
      rows={[{ region: 'North', window: 'Day', count: 4 }, { region: 'North', window: 'Night', count: 6 }, { region: 'South', window: 'Day', count: 3 }]}
      config={{ rows: ['region'], column: 'window', values: [{ field: 'count', operation: 'sum', label: 'Count' }] }}
    />));
    expect(host.textContent).toContain('Night · Count');
    expect(host.textContent).toContain('Grand total');
    expect(host.textContent).toContain('13');
  });

  it('expands a branch and emits stable row selection', () => {
    const onSelect = vi.fn();
    const rows: TreeGridRow[] = [{ id: 'sector', name: 'Sector', status: 'Active', children: [{ id: 'track', name: 'Track 7', status: 'Observed' }] }];
    act(() => root.render(<TreeGrid rows={rows} columns={[{ field: 'name', headerName: 'Entity' }, { field: 'status', headerName: 'Status' }]} onSelect={onSelect} />));
    const expand = host.querySelector('button[aria-label="Expand Sector"]') as HTMLButtonElement;
    act(() => expand.click());
    expect(host.textContent).toContain('Track 7');
    const child = host.querySelector('tr[aria-level="2"]') as HTMLTableRowElement;
    act(() => child.click());
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'track' }));
  });
});
