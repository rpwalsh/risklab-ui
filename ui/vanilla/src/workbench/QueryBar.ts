import { UIElement } from '../core/UIElement';
import { register } from '../core/register';
import type { WorkbenchStore } from './state';
import { resolveElementWorkbenchStore } from './helpers';
import { WORKBENCH_CSS } from './styles';

export class UIWorkbenchQueryBar extends UIElement {
  static observedAttributes = ['label', 'placeholder'];

  private _store?: WorkbenchStore;
  private unsubscribe?: () => void;

  get store(): WorkbenchStore | undefined {
    return this._store;
  }

  set store(value: WorkbenchStore | undefined) {
    this._store = value;
    this.syncSubscription();
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
    const label = this.getAttribute('label') ?? 'Query';
    const placeholder = this.getAttribute('placeholder') ?? 'Search, scope, or command';
    const query = this.resolveStore()?.getState().query ?? '';

    return `
      <label class="rlwb-query-bar">
        <span class="rlwb-query-label">${label}</span>
        <input class="rlwb-query-input" type="search" value="${query}" placeholder="${placeholder}" />
      </label>
    `;
  }

  protected onRendered(): void {
    const input = this.$<HTMLInputElement>('.rlwb-query-input');
    input?.addEventListener('input', (event) => {
      const value = (event.currentTarget as HTMLInputElement).value;
      this.resolveStore()?.actions.setQuery(value);
      this.emit('ui-query-change', { value });
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

register('ui-workbench-query-bar', UIWorkbenchQueryBar);
