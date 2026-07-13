import { Injectable, computed, signal } from '@angular/core';
import {
  createInitialWorkbenchState,
  reduceWorkbenchState,
  type SavedWorkbenchView,
  type TimeWindow,
  type WorkbenchCompareState,
  type WorkbenchFilterValue,
  type WorkbenchPanelState,
  type WorkbenchSelection,
  type WorkbenchState,
} from './model';

@Injectable()
export class WorkbenchService {
  readonly state = signal<WorkbenchState>(createInitialWorkbenchState());

  readonly actions = {
    setQuery: (query: string) => this.dispatch({ type: 'setQuery', query }),
    setFilter: (key: string, value: WorkbenchFilterValue | undefined) => this.dispatch({ type: 'setFilter', key, value }),
    setPanelFilter: (panelId: string, key: string, value: WorkbenchFilterValue | undefined) => this.dispatch({ type: 'setPanelFilter', panelId, key, value }),
    setTimeWindow: (timeWindow: TimeWindow | null) => this.dispatch({ type: 'setTimeWindow', timeWindow }),
    setSelection: (selection: WorkbenchSelection | null) => this.dispatch({ type: 'setSelection', selection }),
    setCompare: (compare: Partial<WorkbenchCompareState>) => this.dispatch({ type: 'setCompare', compare }),
    patchPanelState: (panelId: string, patch: Partial<WorkbenchPanelState>) => this.dispatch({ type: 'patchPanelState', panelId, patch }),
    restoreSavedView: (view: SavedWorkbenchView) => this.dispatch({ type: 'restoreSavedView', view }),
    reset: (state?: Partial<WorkbenchState>) => this.dispatch({ type: 'reset', state }),
  };

  readonly query = computed(() => this.state().query);
  readonly selection = computed(() => this.state().selection);

  initialize(initialState?: Partial<WorkbenchState>): void {
    this.state.set(createInitialWorkbenchState(initialState));
  }

  private dispatch(action: Parameters<typeof reduceWorkbenchState>[1]): void {
    this.state.update((state) => reduceWorkbenchState(state, action));
  }
}
