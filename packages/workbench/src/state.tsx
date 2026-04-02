import React, { createContext, useContext, useReducer } from 'react';

type FilterPrimitive = string | number | boolean | null;

export type WorkbenchFilterValue = FilterPrimitive | FilterPrimitive[];

export interface TimeWindow {
  preset?: string;
  from?: string;
  to?: string;
  timezone?: string;
  label?: string;
}

export interface WorkbenchSelection {
  panelId?: string;
  entityId?: string;
  seriesId?: string;
  pointId?: string;
  label?: string;
  meta?: Record<string, unknown>;
}

export interface WorkbenchCompareState {
  enabled: boolean;
  baselineLabel?: string;
}

export interface WorkbenchPanelState {
  collapsed?: boolean;
  hidden?: boolean;
  title?: string;
  filters?: Record<string, WorkbenchFilterValue>;
}

export interface SavedWorkbenchView {
  version: 1;
  name?: string;
  query?: string;
  filters: Record<string, WorkbenchFilterValue>;
  timeWindow?: TimeWindow | null;
  selection?: WorkbenchSelection | null;
  compare?: WorkbenchCompareState;
  panels: Record<string, WorkbenchPanelState>;
}

export interface WorkbenchState extends SavedWorkbenchView {
  version: 1;
  compare: WorkbenchCompareState;
}

type WorkbenchAction =
  | { type: 'setQuery'; query: string }
  | { type: 'setFilter'; key: string; value: WorkbenchFilterValue | undefined }
  | { type: 'setPanelFilter'; panelId: string; key: string; value: WorkbenchFilterValue | undefined }
  | { type: 'setTimeWindow'; timeWindow: TimeWindow | null }
  | { type: 'setSelection'; selection: WorkbenchSelection | null }
  | { type: 'setCompare'; compare: Partial<WorkbenchCompareState> }
  | { type: 'patchPanelState'; panelId: string; patch: Partial<WorkbenchPanelState> }
  | { type: 'restoreSavedView'; view: SavedWorkbenchView }
  | { type: 'reset'; state?: Partial<WorkbenchState> };

interface WorkbenchContextValue {
  state: WorkbenchState;
  actions: {
    setQuery(query: string): void;
    setFilter(key: string, value: WorkbenchFilterValue | undefined): void;
    setPanelFilter(panelId: string, key: string, value: WorkbenchFilterValue | undefined): void;
    setTimeWindow(timeWindow: TimeWindow | null): void;
    setSelection(selection: WorkbenchSelection | null): void;
    setCompare(compare: Partial<WorkbenchCompareState>): void;
    patchPanelState(panelId: string, patch: Partial<WorkbenchPanelState>): void;
    restoreSavedView(view: SavedWorkbenchView): void;
    reset(state?: Partial<WorkbenchState>): void;
  };
}

export interface WorkbenchProviderProps {
  children: React.ReactNode;
  initialState?: Partial<WorkbenchState>;
}

const defaultWorkbenchState: WorkbenchState = {
  version: 1,
  query: '',
  filters: {},
  timeWindow: null,
  selection: null,
  compare: { enabled: false },
  panels: {},
};

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export function createInitialWorkbenchState(
  initialState?: Partial<WorkbenchState>,
): WorkbenchState {
  return {
    ...defaultWorkbenchState,
    ...initialState,
    filters: { ...defaultWorkbenchState.filters, ...(initialState?.filters ?? {}) },
    compare: { ...defaultWorkbenchState.compare, ...(initialState?.compare ?? {}) },
    panels: mergePanels(defaultWorkbenchState.panels, initialState?.panels),
  };
}

export function createSavedWorkbenchView(
  state: WorkbenchState,
  options?: { name?: string },
): SavedWorkbenchView {
  return {
    version: 1,
    name: options?.name,
    query: state.query || undefined,
    filters: { ...state.filters },
    timeWindow: state.timeWindow ? { ...state.timeWindow } : null,
    selection: state.selection
      ? {
          ...state.selection,
          meta: state.selection.meta ? { ...state.selection.meta } : undefined,
        }
      : null,
    compare: { ...(state.compare ?? { enabled: false }) },
    panels: mergePanels({}, state.panels),
  };
}

export function serializeSavedWorkbenchView(
  state: WorkbenchState,
  options?: { name?: string },
): string {
  return JSON.stringify(createSavedWorkbenchView(state, options));
}

export function parseSavedWorkbenchView(serialized: string): SavedWorkbenchView | null {
  try {
    const parsed = JSON.parse(serialized) as Partial<SavedWorkbenchView> | null;
    if (!parsed || parsed.version !== 1) {
      return null;
    }

    const state = createInitialWorkbenchState(parsed);
    return createSavedWorkbenchView(state, { name: parsed.name });
  } catch {
    return null;
  }
}

export function WorkbenchProvider({
  children,
  initialState,
}: WorkbenchProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(
    workbenchReducer,
    initialState,
    createInitialWorkbenchState,
  );

  const value: WorkbenchContextValue = {
    state,
    actions: {
      setQuery(query) {
        dispatch({ type: 'setQuery', query });
      },
      setFilter(key, value) {
        dispatch({ type: 'setFilter', key, value });
      },
      setPanelFilter(panelId, key, value) {
        dispatch({ type: 'setPanelFilter', panelId, key, value });
      },
      setTimeWindow(timeWindow) {
        dispatch({ type: 'setTimeWindow', timeWindow });
      },
      setSelection(selection) {
        dispatch({ type: 'setSelection', selection });
      },
      setCompare(compare) {
        dispatch({ type: 'setCompare', compare });
      },
      patchPanelState(panelId, patch) {
        dispatch({ type: 'patchPanelState', panelId, patch });
      },
      restoreSavedView(view) {
        dispatch({ type: 'restoreSavedView', view });
      },
      reset(nextState) {
        dispatch({ type: 'reset', state: nextState });
      },
    },
  };

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  );
}

export function useWorkbench(): WorkbenchContextValue {
  const value = useContext(WorkbenchContext);
  if (!value) {
    throw new Error('[RiskLab Workbench] useWorkbench must be used inside <WorkbenchProvider>.');
  }
  return value;
}

export function useWorkbenchOptional(): WorkbenchContextValue | null {
  return useContext(WorkbenchContext);
}

export function useWorkbenchPanelState(
  panelId: string,
): [WorkbenchPanelState | undefined, (patch: Partial<WorkbenchPanelState>) => void] {
  const { state, actions } = useWorkbench();
  return [
    state.panels[panelId],
    (patch) => actions.patchPanelState(panelId, patch),
  ];
}

function workbenchReducer(
  state: WorkbenchState,
  action: WorkbenchAction,
): WorkbenchState {
  switch (action.type) {
    case 'setQuery':
      return { ...state, query: action.query };
    case 'setFilter':
      return {
        ...state,
        filters: assignFilter(state.filters, action.key, action.value),
      };
    case 'setPanelFilter': {
      const current = state.panels[action.panelId] ?? {};
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.panelId]: {
            ...current,
            filters: assignFilter(current.filters ?? {}, action.key, action.value),
          },
        },
      };
    }
    case 'setTimeWindow':
      return { ...state, timeWindow: action.timeWindow ? { ...action.timeWindow } : null };
    case 'setSelection':
      return {
        ...state,
        selection: action.selection
          ? {
              ...action.selection,
              meta: action.selection.meta ? { ...action.selection.meta } : undefined,
            }
          : null,
      };
    case 'setCompare':
      return {
        ...state,
        compare: {
          ...state.compare,
          ...action.compare,
        },
      };
    case 'patchPanelState': {
      const current = state.panels[action.panelId] ?? {};
      const nextPanel: WorkbenchPanelState = {
        ...current,
        ...action.patch,
        filters: action.patch.filters
          ? { ...(current.filters ?? {}), ...action.patch.filters }
          : current.filters,
      };

      return {
        ...state,
        panels: {
          ...state.panels,
          [action.panelId]: nextPanel,
        },
      };
    }
    case 'restoreSavedView':
      return createInitialWorkbenchState(action.view);
    case 'reset':
      return createInitialWorkbenchState(action.state);
    default:
      return state;
  }
}

function assignFilter(
  filters: Record<string, WorkbenchFilterValue>,
  key: string,
  value: WorkbenchFilterValue | undefined,
): Record<string, WorkbenchFilterValue> {
  const next = { ...filters };
  if (value === undefined) {
    delete next[key];
    return next;
  }
  next[key] = value;
  return next;
}

function mergePanels(
  base: Record<string, WorkbenchPanelState>,
  incoming?: Record<string, WorkbenchPanelState>,
): Record<string, WorkbenchPanelState> {
  const next: Record<string, WorkbenchPanelState> = {};

  for (const [panelId, panel] of Object.entries(base)) {
    next[panelId] = {
      ...panel,
      filters: panel.filters ? { ...panel.filters } : undefined,
    };
  }

  for (const [panelId, panel] of Object.entries(incoming ?? {})) {
    next[panelId] = {
      ...(next[panelId] ?? {}),
      ...panel,
      filters: {
        ...(next[panelId]?.filters ?? {}),
        ...(panel.filters ?? {}),
      },
    };
  }

  return next;
}
