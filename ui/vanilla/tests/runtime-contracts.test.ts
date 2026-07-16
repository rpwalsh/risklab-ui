import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/data-display/DataGrid';
import { UIToast } from '../src/feedback/Toast';
import {
  createInitialWorkbenchState,
  createSavedWorkbenchView,
  createWorkbenchStore,
  parseSavedWorkbenchView,
  reduceWorkbenchState,
  serializeSavedWorkbenchView,
} from '../src/workbench/state';
import {
  escapeHtml,
  filterValueIncludes,
  filterValuesEqual,
  getOrCreateWorkbenchStore,
  renderSelectionMarkup,
  resolveElementWorkbenchStore,
  serializeThemeStyle,
  slotHasContent,
  timeWindowsEqual,
  toggleFilterValue,
} from '../src/workbench/helpers';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('vanilla runtime contracts', () => {
  it('renders, sorts, selects, and pages the standard data grid', () => {
    const grid = document.createElement('ui-data-grid') as HTMLElement & {
      columns: unknown[];
      rows: Array<Record<string, unknown>>;
      rowIdField: string;
      selectedRowId: string | null;
    };
    grid.setAttribute('sortable', '');
    grid.setAttribute('page-size', '2');
    grid.columns = [
      { field: 'name', headerName: 'Name', sortable: true, width: 140 },
      { field: 'score', headerName: 'Score', align: 'right' },
    ];
    grid.rows = [
      { key: 'a', name: 'Bravo', score: 2 },
      { key: 'b', name: 'Alpha', score: 1 },
      { key: 'c', name: 'Charlie', score: 3 },
    ];
    document.body.appendChild(grid);
    const sort = vi.fn();
    const page = vi.fn();
    const rowClick = vi.fn();
    grid.addEventListener('ui-sort', sort);
    grid.addEventListener('ui-page', page);
    grid.addEventListener('ui-row-click', rowClick);

    (grid.shadowRoot!.querySelector('th.sortable') as HTMLTableCellElement).click();
    expect(sort).toHaveBeenCalledWith(expect.objectContaining({ detail: { field: 'name', direction: 'asc' } }));
    (grid.shadowRoot!.querySelector('th.sortable') as HTMLTableCellElement).click();
    expect(sort).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { field: 'name', direction: 'desc' } }));
    (grid.shadowRoot!.querySelector('tbody tr[data-row-index]') as HTMLTableRowElement).click();
    expect(rowClick).toHaveBeenCalled();
    (grid.shadowRoot!.querySelector('[data-action="next"]') as HTMLButtonElement).click();
    expect(page).toHaveBeenCalledWith(expect.objectContaining({ detail: { page: 1 } }));
    (grid.shadowRoot!.querySelector('[data-action="prev"]') as HTMLButtonElement).click();
    expect(page).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { page: 0 } }));

    grid.rowIdField = 'name';
    grid.selectedRowId = 'Bravo';
    expect(grid.shadowRoot!.querySelector('.row-selected')).not.toBeNull();
    grid.rows = [];
    expect(grid.shadowRoot!.textContent).toContain('No data');
  });

  it('runs the complete workbench state lifecycle without mutating inputs', () => {
    const initial = createInitialWorkbenchState({ filters: { region: 'north' }, compare: { enabled: true }, panels: { map: { filters: { layer: 'tracks' } } } });
    const original = structuredClone(initial);
    const actions = [
      { type: 'setQuery', query: 'track:17' },
      { type: 'setFilter', key: 'status', value: 'active' },
      { type: 'setFilter', key: 'region', value: undefined },
      { type: 'setPanelFilter', panelId: 'map', key: 'layer', value: undefined },
      { type: 'setPanelFilter', panelId: 'table', key: 'priority', value: 2 },
      { type: 'setTimeWindow', timeWindow: { preset: '7d', timezone: 'UTC' } },
      { type: 'setSelection', selection: { entityId: 'track-17', meta: { confidence: 0.91 } } },
      { type: 'setCompare', compare: { baselineLabel: 'Previous window' } },
      { type: 'patchPanelState', panelId: 'map', patch: { collapsed: true, filters: { layer: 'signals' } } },
    ] as const;
    const next = actions.reduce((state, action) => reduceWorkbenchState(state, action), initial);
    expect(initial).toEqual(original);
    expect(next).toMatchObject({ query: 'track:17', filters: { status: 'active' }, compare: { enabled: true, baselineLabel: 'Previous window' } });
    expect(next.panels.map).toMatchObject({ collapsed: true, filters: { layer: 'signals' } });

    const serialized = serializeSavedWorkbenchView(next, { name: 'Briefing' });
    const parsed = parseSavedWorkbenchView(serialized)!;
    expect(parsed.name).toBe('Briefing');
    expect(parseSavedWorkbenchView('{bad json')).toBeNull();
    expect(parseSavedWorkbenchView('{"version":2}')).toBeNull();
    expect(createSavedWorkbenchView(next).selection).not.toBe(next.selection);
    expect(reduceWorkbenchState(next, { type: 'restoreSavedView', view: parsed })).toMatchObject({ query: 'track:17' });
    expect(reduceWorkbenchState(next, { type: 'reset', state: { query: 'reset' } })).toMatchObject({ query: 'reset' });
    expect(reduceWorkbenchState(next, { type: 'unknown' } as never)).toBe(next);
  });

  it('notifies store subscribers and exposes every typed action', () => {
    const store = createWorkbenchStore({ query: 'initial' });
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.actions.setQuery('updated');
    store.actions.setFilter('region', 'west');
    store.actions.setPanelFilter('map', 'layer', 'terrain');
    store.actions.setTimeWindow({ preset: '24h' });
    store.actions.setSelection({ entityId: '17' });
    store.actions.setCompare({ enabled: true });
    store.actions.patchPanelState('map', { title: 'Area view' });
    const saved = createSavedWorkbenchView(store.getState());
    store.actions.restoreSavedView(saved);
    store.actions.reset({ query: 'ready' });
    expect(listener).toHaveBeenCalledTimes(9);
    expect(store.getState().query).toBe('ready');
    unsubscribe();
    store.dispatch({ type: 'setQuery', query: 'silent' });
    expect(listener).toHaveBeenCalledTimes(9);
  });

  it('handles workbench display helpers and store discovery', () => {
    expect(escapeHtml('<track id="7">')).toBe('&lt;track id=&quot;7&quot;&gt;');
    expect(escapeHtml(null)).toBe('');
    expect(filterValuesEqual(['a', 2], ['a', 2])).toBe(true);
    expect(filterValuesEqual(['a'], ['a', 'b'])).toBe(false);
    expect(filterValueIncludes(['a', 'b'], 'b')).toBe(true);
    expect(toggleFilterValue(undefined, 'a', false)).toBe('a');
    expect(toggleFilterValue('a', 'a', false)).toBeUndefined();
    expect(toggleFilterValue(undefined, 'a', true)).toEqual(['a']);
    expect(toggleFilterValue(['a'], 'a', true)).toBeUndefined();
    expect(toggleFilterValue(['a'], ['b'], true)).toEqual(['a', 'b']);
    expect(timeWindowsEqual(null, undefined)).toBe(true);
    expect(timeWindowsEqual({ preset: '7d' }, null)).toBe(false);
    expect(timeWindowsEqual({ preset: '7d', timezone: 'UTC' }, { preset: '7d', timezone: 'UTC' })).toBe(true);
    expect(renderSelectionMarkup({ entityId: '17', label: '<priority>', meta: { confidence: 0.9, path: { id: 1 } } })).toContain('&lt;priority&gt;');
    expect(renderSelectionMarkup(null)).toBe('');
    expect(serializeThemeStyle('dark')).toContain('--rlwb-');

    const shell = document.createElement('ui-workbench-shell') as HTMLElement & { workbenchStore?: ReturnType<typeof createWorkbenchStore> };
    const child = document.createElement('div');
    shell.appendChild(child);
    document.body.appendChild(shell);
    const store = createWorkbenchStore();
    shell.workbenchStore = store;
    expect(resolveElementWorkbenchStore(child)).toBe(store);
    expect(resolveElementWorkbenchStore(child, store)).toBe(store);
    expect(getOrCreateWorkbenchStore(store)).toBe(store);
    expect(getOrCreateWorkbenchStore(null, { query: 'new' }).getState().query).toBe('new');

    const slot = document.createElement('slot');
    expect(slotHasContent(null)).toBe(false);
    expect(slotHasContent(slot)).toBe(false);
  });

  it('creates all toast severities and supports manual and timed dismissal', () => {
    vi.useFakeTimers();
    UIToast.success('Saved', 0);
    UIToast.error('Failed', 20);
    UIToast.info('Working', 0);
    UIToast.warning('Review', 0);
    const container = document.querySelector('ui-toast-container')!;
    expect(container.getAttribute('position')).toBe('top-right');
    expect(container.shadowRoot!.querySelectorAll('.toast')).toHaveLength(4);
    (container.shadowRoot!.querySelector('.close') as HTMLButtonElement).click();
    vi.advanceTimersByTime(220);
    expect(container.shadowRoot!.querySelectorAll('.toast').length).toBeLessThan(4);
    vi.advanceTimersByTime(500);
  });
});
