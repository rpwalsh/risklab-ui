import { getContext, setContext } from 'svelte';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import {
  createInitialWorkbenchState,
  createSavedWorkbenchView,
  parseSavedWorkbenchView,
  reduceWorkbenchState,
  serializeSavedWorkbenchView,
  type SavedWorkbenchView,
  type TimeWindow,
  type WorkbenchAction,
  type WorkbenchCompareState,
  type WorkbenchFilterValue,
  type WorkbenchPanelState,
  type WorkbenchSelection,
  type WorkbenchState,
} from './model';

export {
  createInitialWorkbenchState,
  createSavedWorkbenchView,
  parseSavedWorkbenchView,
  reduceWorkbenchState,
  serializeSavedWorkbenchView,
};

export type {
  SavedWorkbenchView,
  TimeWindow,
  WorkbenchAction,
  WorkbenchCompareState,
  WorkbenchFilterValue,
  WorkbenchPanelState,
  WorkbenchSelection,
  WorkbenchState,
} from './model';

const WORKBENCH_CONTEXT_KEY = 'ui-workbench';

export interface WorkbenchContextValue {
  state: Writable<WorkbenchState>;
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

export function createWorkbenchContextValue(
  initialState?: Partial<WorkbenchState>,
): WorkbenchContextValue {
  const state = writable(createInitialWorkbenchState(initialState));

  const dispatch = (action: WorkbenchAction) => {
    state.update((currentState) => reduceWorkbenchState(currentState, action));
  };

  const context: WorkbenchContextValue = {
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

  return context;
}

export function setWorkbenchContext(context: WorkbenchContextValue): WorkbenchContextValue {
  setContext(WORKBENCH_CONTEXT_KEY, context);
  return context;
}

export function createWorkbenchContext(
  initialState?: Partial<WorkbenchState>,
): WorkbenchContextValue {
  return setWorkbenchContext(createWorkbenchContextValue(initialState));
}

export function getWorkbenchContext(): WorkbenchContextValue {
  const context = getContext<WorkbenchContextValue | undefined>(WORKBENCH_CONTEXT_KEY);
  if (!context) {
    throw new Error('[RiskLab UI] getWorkbenchContext must be used inside <WorkbenchProvider>.');
  }
  return context;
}

export function getWorkbenchContextOptional(): WorkbenchContextValue | null {
  return getContext<WorkbenchContextValue | undefined>(WORKBENCH_CONTEXT_KEY) ?? null;
}

export function useWorkbenchPanelState(
  panelId: string,
): Readable<WorkbenchPanelState> {
  const context = getWorkbenchContext();
  return derived(context.state, ($state) => $state.panels[panelId] ?? {});
}
