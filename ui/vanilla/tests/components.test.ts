import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UI_COMPONENT_MANIFEST } from '../src/index';

function mount<T extends HTMLElement>(markup: string): T {
  document.body.innerHTML = markup;
  return document.body.firstElementChild as T;
}

beforeEach(() => { document.body.innerHTML = ''; });

describe('RiskLab UI custom elements', () => {
  it('registers the expanded component surface', () => {
    expect(UI_COMPONENT_MANIFEST.length).toBeGreaterThanOrEqual(100);
    for (const { tag } of UI_COMPONENT_MANIFEST) {
      expect(customElements.get(tag), `${tag} should be registered`).toBeTypeOf('function');
    }
  });

  it('connects every documented custom element with a stable empty-state contract', () => {
    for (const { tag } of UI_COMPONENT_MANIFEST) {
      const element = document.createElement(tag);
      document.body.appendChild(element);
      expect(element.isConnected, `${tag} should connect`).toBe(true);
      expect(element.shadowRoot, `${tag} should provide an encapsulated UI surface`).not.toBeNull();
      element.remove();
    }
  });

  it('clamps and emits number input changes', () => {
    const control = mount<HTMLElement>('<ui-number-input value="9" min="0" max="10" step="2"></ui-number-input>');
    const listener = vi.fn();
    control.addEventListener('ui-change', listener);
    (control.shadowRoot!.querySelector('.inc') as HTMLButtonElement).click();
    expect(control.getAttribute('value')).toBe('10');
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 10 } }));
  });

  it('filters autocomplete options from a typed query', () => {
    const control = mount<HTMLElement & { options: unknown[] }>('<ui-autocomplete label="Entity"></ui-autocomplete>');
    control.options = [{ value: 'alpha', label: 'Alpha' }, { value: 'bravo', label: 'Bravo' }];
    const input = control.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.focus();
    input.value = 'br';
    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    const options = control.shadowRoot!.querySelectorAll('[role=option]');
    expect(options).toHaveLength(1);
    expect(options[0]?.textContent).toContain('Bravo');
  });

  it('sorts semantic table rows and emits the sort contract', () => {
    const table = mount<HTMLElement & { columns: unknown[]; rows: unknown[] }>('<ui-table></ui-table>');
    table.columns = [{ key: 'value', label: 'Value', sortable: true }];
    table.rows = [{ value: 9 }, { value: 2 }, { value: 5 }];
    const listener = vi.fn();
    table.addEventListener('ui-sort', listener);
    (table.shadowRoot!.querySelector('th button') as HTMLButtonElement).click();
    expect(Array.from(table.shadowRoot!.querySelectorAll('tbody td')).map((cell) => cell.textContent)).toEqual(['2', '5', '9']);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: { key: 'value', direction: 'asc' } }));
  });

  it('executes a command and closes the palette', () => {
    const palette = mount<HTMLElement & { commands: unknown[] }>('<ui-command-palette open></ui-command-palette>');
    palette.commands = [{ id: 'inspect', label: 'Inspect' }];
    const listener = vi.fn();
    palette.addEventListener('ui-command', listener);
    (palette.shadowRoot!.querySelector('[data-id]') as HTMLElement).click();
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: { id: 'inspect' } }));
    expect(palette.hasAttribute('open')).toBe(false);
  });

  it('windows a large virtual list', () => {
    const list = mount<HTMLElement & { items: unknown[] }>('<ui-virtual-list height="200" item-height="40"></ui-virtual-list>');
    list.items = Array.from({ length: 2000 }, (_, index) => `Record ${index + 1}`);
    expect(list.shadowRoot!.querySelectorAll('[role=listitem]').length).toBeLessThan(20);
    expect(list.shadowRoot!.textContent).toContain('Record 1');
  });

  it('virtualizes, searches, and exports the advanced grid', () => {
    const grid = mount<HTMLElement & { columns: unknown[]; rows: unknown[]; exportCSV(): string }>('<ui-data-grid-advanced toolbar exportable virtualized height="240" row-height="40"></ui-data-grid-advanced>');
    grid.columns = [{ field: 'track', headerName: 'Track', sortable: true }, { field: 'status', headerName: 'Status', editable: true }];
    grid.rows = Array.from({ length: 500 }, (_, index) => ({ id: index, track: `TRK-${index}`, status: index === 419 ? 'Priority' : 'Observed' }));
    expect(grid.shadowRoot!.querySelectorAll('tbody tr[data-id]').length).toBeLessThan(20);
    const search = grid.shadowRoot!.querySelector('.search') as HTMLInputElement;
    search.value = 'priority';
    search.dispatchEvent(new InputEvent('input', { bubbles: true }));
    expect(grid.shadowRoot!.querySelectorAll('tbody tr[data-id]')).toHaveLength(1);
    expect(grid.shadowRoot!.textContent).toContain('TRK-419');
    expect(grid.exportCSV()).toContain('Priority');
  });

  it('saves and restores advanced grid view state', () => {
    const grid = mount<HTMLElement & { columns: unknown[]; rows: unknown[]; sortModel: unknown[]; filters: unknown[]; getViewState(): unknown; applyViewState(state: unknown): void }>('<ui-data-grid-advanced></ui-data-grid-advanced>');
    grid.columns = [{ field: 'confidence', headerName: 'Confidence', width: 140, pinned: 'left' }];
    grid.rows = [{ confidence: 92 }];
    grid.sortModel = [{ field: 'confidence', direction: 'desc' }];
    grid.filters = [{ field: 'confidence', operator: 'gte', value: 80 }];
    const state = grid.getViewState() as { columns: unknown[]; sort: unknown[]; filters: unknown[]; search: string };
    expect(state).toMatchObject({ sort: [{ field: 'confidence', direction: 'desc' }], filters: [{ field: 'confidence', operator: 'gte', value: 80 }] });
    grid.applyViewState({ ...state, search: '92' });
    expect(grid.getViewState()).toMatchObject({ search: '92' });
  });

  it('builds a pivot grid from the supplied dimensions and aggregate contract', () => {
    const pivot = mount<HTMLElement & { config: unknown; rows: unknown[] }>('<ui-pivot-grid></ui-pivot-grid>');
    pivot.config = { rows: ['region'], column: 'window', values: [{ field: 'count', operation: 'sum', label: 'Count' }] };
    pivot.rows = [
      { region: 'North', window: 'Day', count: 4 },
      { region: 'North', window: 'Night', count: 6 },
      { region: 'South', window: 'Day', count: 3 },
    ];
    expect(pivot.shadowRoot!.textContent).toContain('North');
    expect(pivot.shadowRoot!.textContent).toContain('Night · Count');
    expect(pivot.shadowRoot!.textContent).toContain('Grand total');
    expect(pivot.shadowRoot!.textContent).toContain('13');
  });

  it('expands and selects hierarchical tree-grid rows', () => {
    const tree = mount<HTMLElement & { columns: unknown[]; rows: unknown[]; expandAll(): void }>('<ui-tree-grid></ui-tree-grid>');
    tree.columns = [{ field: 'name', headerName: 'Entity' }, { field: 'status', headerName: 'Status' }];
    tree.rows = [{ id: 'parent', name: 'Sector', status: 'Active', children: [{ id: 'child', name: 'Track 7', status: 'Observed' }] }];
    const expansion = vi.fn();
    const selection = vi.fn();
    tree.addEventListener('ui-expansion', expansion);
    tree.addEventListener('ui-selection', selection);
    (tree.shadowRoot!.querySelector('[data-toggle]') as HTMLButtonElement).click();
    expect(tree.shadowRoot!.textContent).toContain('Track 7');
    expect(expansion).toHaveBeenCalledWith(expect.objectContaining({ detail: { rowId: 'parent', expanded: true } }));
    (tree.shadowRoot!.querySelector('[data-row="child"]') as HTMLTableRowElement).click();
    expect(selection).toHaveBeenCalledWith(expect.objectContaining({ detail: { rowId: 'child' } }));
  });

  it('toggles collapse state without replacing content', () => {
    const collapse = mount<HTMLElement>('<ui-collapse><span>Evidence detail</span></ui-collapse>');
    collapse.setAttribute('open', '');
    expect(collapse.hasAttribute('open')).toBe(true);
    expect(collapse.textContent).toContain('Evidence detail');
  });
});
