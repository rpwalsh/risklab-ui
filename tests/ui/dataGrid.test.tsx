import React, { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { DataGrid } from '../../ui/react/src/data-display/DataGrid';

interface Row {
  id: string;
  name: string;
}

describe('DataGrid', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('forwards row clicks and preserves selected rows by row id', async () => {
    const rows: Row[] = [
      { id: 'cve-1', name: 'Alpha' },
      { id: 'cve-2', name: 'Beta' },
    ];
    const handleRowClick = vi.fn();

    await act(async () => {
      root.render(
        <DataGrid<Row>
          columns={[{ key: 'name', header: 'Name' }]}
          rows={rows}
          getRowId={(row) => row.id}
          selectedRowIds={['cve-2']}
          onRowClick={handleRowClick}
        />,
      );
    });

    const betaCell = Array.from(container.querySelectorAll('td')).find(
      (cell) => cell.textContent === 'Beta',
    );
    expect(betaCell?.closest('tr')?.getAttribute('aria-selected')).toBe('true');

    const alphaCell = Array.from(container.querySelectorAll('td')).find(
      (cell) => cell.textContent === 'Alpha',
    );
    act(() => {
      alphaCell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handleRowClick).toHaveBeenCalledWith(rows[0], 0);
  });
});
