import {
  computed,
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  type ComputedRef,
  type InjectionKey,
  type PropType,
  type Ref,
} from 'vue';
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
  state: Ref<WorkbenchState>;
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
  initialState?: Partial<WorkbenchState>;
}

export const WorkbenchKey: InjectionKey<WorkbenchContextValue> = Symbol('rl-workbench');

export const WorkbenchProvider = defineComponent({
  name: 'WorkbenchProvider',
  props: {
    initialState: {
      type: Object as PropType<Partial<WorkbenchState>>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const store = createWorkbenchStore(props.initialState);
    const state = ref(store.getState()) as Ref<WorkbenchState>;
    const unsubscribe = store.subscribe((nextState) => {
      state.value = nextState;
    });

    onBeforeUnmount(() => {
      unsubscribe();
    });

    const value: WorkbenchContextValue = {
      state,
      actions: store.actions,
    };

    provide(WorkbenchKey, value);

    return () => slots.default?.();
  },
});

export function useWorkbench(): WorkbenchContextValue {
  const value = inject(WorkbenchKey, null);
  if (!value) {
    throw new Error('[RiskLab UI] useWorkbench must be used inside <WorkbenchProvider>.');
  }
  return value;
}

export function useWorkbenchOptional(): WorkbenchContextValue | null {
  return inject(WorkbenchKey, null);
}

export function useWorkbenchPanelState(
  panelId: string,
): ComputedRef<WorkbenchPanelState> {
  const workbench = useWorkbench();
  return computed(() => workbench.state.value.panels[panelId] ?? {});
}
