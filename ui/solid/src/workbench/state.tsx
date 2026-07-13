import {
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
  type Component,
  type JSX,
} from 'solid-js';
import {
  createInitialWorkbenchState,
  createSavedWorkbenchView,
  createWorkbenchStore,
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
  createWorkbenchStore,
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

export interface WorkbenchContextValue {
  state: Accessor<WorkbenchState>;
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
  children?: JSX.Element;
  initialState?: Partial<WorkbenchState>;
}

export const WorkbenchContext = createContext<WorkbenchContextValue>();

export const WorkbenchProvider: Component<WorkbenchProviderProps> = (props) => {
  const store = createWorkbenchStore(props.initialState);
  const [state, setState] = createSignal(store.getState());
  const unsubscribe = store.subscribe((nextState) => {
    setState(() => nextState);
  });

  onCleanup(() => {
    unsubscribe();
  });

  const value: WorkbenchContextValue = {
    state,
    actions: store.actions,
  };

  return (
    <WorkbenchContext.Provider value={value}>
      {props.children}
    </WorkbenchContext.Provider>
  );
};

export function useWorkbench(): WorkbenchContextValue {
  const value = useContext(WorkbenchContext);
  if (!value) {
    throw new Error('[RiskLab UI] useWorkbench must be used inside <WorkbenchProvider>.');
  }
  return value;
}

export function useWorkbenchOptional(): WorkbenchContextValue | null {
  return useContext(WorkbenchContext) ?? null;
}

export function useWorkbenchPanelState(panelId: string) {
  const workbench = useWorkbench();
  return createMemo(() => workbench.state().panels[panelId] ?? {});
}
