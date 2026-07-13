import React, { createContext, useContext, useRef, useSyncExternalStore } from 'react';
import {
  createInitialWorkbenchState,
  createSavedWorkbenchView,
  createWorkbenchStore,
  parseSavedWorkbenchView,
  reduceWorkbenchState,
  serializeSavedWorkbenchView,
  type SavedWorkbenchView,
  type TimeWindow,
  type WorkbenchActions,
  type WorkbenchCompareState,
  type WorkbenchFilterValue,
  type WorkbenchPanelState,
  type WorkbenchSelection,
  type WorkbenchState,
  type WorkbenchStore,
} from './model';

export {
  createInitialWorkbenchState,
  createSavedWorkbenchView,
  createWorkbenchStore,
  parseSavedWorkbenchView,
  reduceWorkbenchState,
  serializeSavedWorkbenchView,
};

export type {
  SavedWorkbenchView,
  TimeWindow,
  WorkbenchAction,
  WorkbenchActions,
  WorkbenchCompareState,
  WorkbenchFilterValue,
  WorkbenchPanelState,
  WorkbenchSelection,
  WorkbenchState,
  WorkbenchStore,
} from './model';

interface WorkbenchContextValue {
  state: WorkbenchState;
  actions: WorkbenchActions;
}

export interface WorkbenchProviderProps {
  children: React.ReactNode;
  initialState?: Partial<WorkbenchState>;
}

const WorkbenchStoreContext = createContext<WorkbenchStore | null>(null);
const fallbackStore = createWorkbenchStore();

export function WorkbenchProvider({ children, initialState }: WorkbenchProviderProps): React.ReactElement {
  const storeRef = useRef<WorkbenchStore | null>(null);
  storeRef.current ??= createWorkbenchStore(initialState);
  return (
    <WorkbenchStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkbenchStoreContext.Provider>
  );
}

function subscribeTo(store: WorkbenchStore, notify: () => void): () => void {
  return store.subscribe(() => notify());
}

export function useWorkbenchSelector<T>(selector: (state: WorkbenchState) => T): T {
  const store = useContext(WorkbenchStoreContext);
  if (!store) throw new Error('[RiskLab UI] useWorkbenchSelector must be used inside <WorkbenchProvider>.');
  return useSyncExternalStore(
    (notify) => subscribeTo(store, notify),
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}

export function useWorkbenchSelectorOptional<T>(selector: (state: WorkbenchState) => T): T | undefined {
  const contextStore = useContext(WorkbenchStoreContext);
  const store = contextStore ?? fallbackStore;
  const selected = useSyncExternalStore(
    (notify) => contextStore ? subscribeTo(store, notify) : () => undefined,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
  return contextStore ? selected : undefined;
}

export function useWorkbenchActions(): WorkbenchActions {
  const store = useContext(WorkbenchStoreContext);
  if (!store) throw new Error('[RiskLab UI] useWorkbenchActions must be used inside <WorkbenchProvider>.');
  return store.actions;
}

export function useWorkbenchActionsOptional(): WorkbenchActions | undefined {
  return useContext(WorkbenchStoreContext)?.actions;
}

export function useWorkbench(): WorkbenchContextValue {
  return { state: useWorkbenchSelector((state) => state), actions: useWorkbenchActions() };
}

export function useWorkbenchOptional(): WorkbenchContextValue | null {
  const actions = useWorkbenchActionsOptional();
  const state = useWorkbenchSelectorOptional((current) => current);
  return actions && state ? { state, actions } : null;
}

export function useWorkbenchPanelState(
  panelId: string,
): [WorkbenchPanelState | undefined, (patch: Partial<WorkbenchPanelState>) => void] {
  const panel = useWorkbenchSelector((state) => state.panels[panelId]);
  const actions = useWorkbenchActions();
  return [panel, (patch) => actions.patchPanelState(panelId, patch)];
}

// Re-export these types to keep the established entrypoint complete.
export type WorkbenchStateContracts = {
  timeWindow: TimeWindow;
  compare: WorkbenchCompareState;
  filter: WorkbenchFilterValue;
  selection: WorkbenchSelection;
  savedView: SavedWorkbenchView;
};
