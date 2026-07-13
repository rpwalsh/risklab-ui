import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataGrid } from '../../src/data-display/DataGrid';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

interface Row extends Record<string, unknown> {
  id: string;
  name: string;
  score: number;
}

const columns = [
  { key: 'name', header: 'Name', sortable: true, filterable: true },
  { key: 'score', header: 'Score', sortable: true },
];
const rows: Row[] = [
  { id: 'alpha', name: 'Alpha', score: 2 },
  { id: 'bravo', name: 'Bravo', score: 1 },
];

describe('DataGrid contracts', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it('does not slice server-provided page rows a second time', () => {
    act(() => root.render(
      <DataGrid<Row>
        columns={columns}
        rows={rows}
        page={3}
        pageSize={2}
        totalRows={100}
        paginationMode="server"
      />,
    ));
    expect(host.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(host.textContent).toContain('7-8 of 100');
  });

  it('emits sorting to server mode without reordering local rows', () => {
    const onSort = vi.fn();
    act(() => root.render(
      <DataGrid<Row>
        columns={columns}
        rows={rows}
        sortingMode="server"
        onSortModelChange={onSort}
      />,
    ));
    const scoreHeader = [...host.querySelectorAll('th')].find((node) => node.textContent?.includes('Score'))!;
    act(() => scoreHeader.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(onSort).toHaveBeenCalledWith([{ field: 'score', sort: 'asc' }]);
    expect(host.querySelector('tbody tr td:first-child')?.textContent).toBe('Alpha');
  });

  it('tracks selection by stable row id', () => {
    const onSelection = vi.fn();
    act(() => root.render(
      <DataGrid<Row>
        columns={columns}
        rows={rows}
        checkboxSelection
        onSelectedRowIdsChange={onSelection}
      />,
    ));
    const checkbox = host.querySelector('tbody input[type="checkbox"]') as HTMLInputElement;
    act(() => checkbox.click());
    const selection = onSelection.mock.calls[0]?.[0] as ReadonlySet<string>;
    expect([...selection]).toEqual(['alpha']);
  });
});
