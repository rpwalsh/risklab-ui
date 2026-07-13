import { UIElement } from '../core/UIElement';
import { register } from '../core/register';
import type { WorkbenchStore } from './state';
import {
  type FilterDefinition,
  escapeHtml,
  filterValueIncludes,
  resolveElementWorkbenchStore,
  toggleFilterValue,
} from './helpers';
import { WORKBENCH_CSS } from './styles';

export class UIWorkbenchFilterBar extends UIElement {
  private _store?: WorkbenchStore;
  private _filters: FilterDefinition[] = [];
  private unsubscribe?: () => void;

  get store(): WorkbenchStore | undefined {
    return this._store;
  }

  set store(value: WorkbenchStore | undefined) {
    this._store = value;
    this.syncSubscription();
    this.render();
  }

  get filters(): FilterDefinition[] {
    return this._filters;
  }

  set filters(value: FilterDefinition[]) {
    this._filters = value;
    this.render();
  }

  protected onConnected(): void {
    this.syncSubscription();
  }

  protected onDisconnected(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }

  protected styles(): string {
    return WORKBENCH_CSS;
  }

  protected template(): string {
    const state = this.resolveStore()?.getState();
    const groups = this._filters
      .map((filter) => {
        const currentValue = filter.scope === 'panel'
          ? state?.panels[filter.panelId ?? '']?.filters?.[filter.key]
          : state?.filters[filter.key];
        const options = filter.options
          .map((option, index) => `
            <button
              type="button"
              class="rlwb-filter-chip"
              data-filter-key="${escapeHtml(filter.key)}"
              data-filter-index="${index}"
              aria-pressed="${filterValueIncludes(currentValue, option.value)}"
            >
              ${escapeHtml(option.label)}
            </button>
          `)
          .join('');

        return `
          <div class="rlwb-filter-group">
            <span class="rlwb-filter-group__label">${escapeHtml(filter.label)}</span>
            <div class="rlwb-filter-group__options">${options}</div>
          </div>
        `;
      })
      .join('');

    return `<div class="rlwb-filter-bar">${groups}</div>`;
  }

  protected onRendered(): void {
    this.$$<HTMLButtonElement>('.rlwb-filter-chip').forEach((button) => {
      button.addEventListener('click', () => {
        const filterKey = button.dataset.filterKey ?? '';
        const filterIndex = Number(button.dataset.filterIndex ?? '-1');
        const filter = this._filters.find((entry) => entry.key === filterKey);
        const option = filter?.options[filterIndex];
        const store = this.resolveStore();

        if (!filter || !option || !store) {
          return;
        }

        const currentValue = filter.scope === 'panel'
          ? store.getState().panels[filter.panelId ?? '']?.filters?.[filter.key]
          : store.getState().filters[filter.key];
        const nextValue = toggleFilterValue(currentValue, option.value, Boolean(filter.multi));

        if (filter.scope === 'panel' && filter.panelId) {
          store.actions.setPanelFilter(filter.panelId, filter.key, nextValue);
        } else {
          store.actions.setFilter(filter.key, nextValue);
        }

        this.emit('ui-filter-change', {
          key: filter.key,
          panelId: filter.panelId,
          scope: filter.scope ?? 'global',
          value: nextValue,
        });
      });
    });
  }

  private resolveStore(): WorkbenchStore | null {
    return resolveElementWorkbenchStore(this, this._store);
  }

  private syncSubscription(): void {
    this.unsubscribe?.();
    const store = this.resolveStore();
    if (!store || !this.isConnected) {
      return;
    }

    this.unsubscribe = store.subscribe(() => {
      this.render();
    });
  }
}

register('ui-workbench-filter-bar', UIWorkbenchFilterBar);
