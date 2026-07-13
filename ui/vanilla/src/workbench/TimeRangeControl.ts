import { UIElement } from '../core/UIElement';
import { register } from '../core/register';
import type { WorkbenchStore } from './state';
import {
  type TimeRangeOption,
  defaultTimeRangeOptions,
  escapeHtml,
  resolveElementWorkbenchStore,
  timeWindowsEqual,
} from './helpers';
import { WORKBENCH_CSS } from './styles';

export class UIWorkbenchTimeRangeControl extends UIElement {
  private _store?: WorkbenchStore;
  private _options: TimeRangeOption[] = defaultTimeRangeOptions;
  private unsubscribe?: () => void;

  get store(): WorkbenchStore | undefined {
    return this._store;
  }

  set store(value: WorkbenchStore | undefined) {
    this._store = value;
    this.syncSubscription();
    this.render();
  }

  get options(): TimeRangeOption[] {
    return this._options;
  }

  set options(value: TimeRangeOption[]) {
    this._options = value.length > 0 ? value : defaultTimeRangeOptions;
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
    const currentTimeWindow = this.resolveStore()?.getState().timeWindow;
    const buttons = this._options
      .map((option, index) => `
        <button
          type="button"
          class="rlwb-filter-chip"
          data-option-index="${index}"
          aria-pressed="${timeWindowsEqual(currentTimeWindow, option.value)}"
        >
          ${escapeHtml(option.label)}
        </button>
      `)
      .join('');

    return `<div class="rlwb-time-range">${buttons}</div>`;
  }

  protected onRendered(): void {
    this.$$<HTMLButtonElement>('.rlwb-filter-chip').forEach((button) => {
      button.addEventListener('click', () => {
        const optionIndex = Number(button.dataset.optionIndex ?? '-1');
        const option = this._options[optionIndex];
        if (!option) {
          return;
        }

        this.resolveStore()?.actions.setTimeWindow(option.value);
        this.emit('ui-time-window-change', { value: option.value });
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

register('ui-workbench-time-range-control', UIWorkbenchTimeRangeControl);
