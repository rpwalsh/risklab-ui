import { UIElement } from '../core/UIElement';
import { register } from '../core/register';
import type { WorkbenchStore } from './state';
import {
  type RenderSelectionContent,
  renderSelectionMarkup,
  resolveElementWorkbenchStore,
  slotHasContent,
} from './helpers';
import { WORKBENCH_CSS } from './styles';

export class UIWorkbenchEntityInspector extends UIElement {
  static observedAttributes = ['title', 'empty-state'];

  private _store?: WorkbenchStore;
  private _renderContent?: RenderSelectionContent;
  private unsubscribe?: () => void;
  private hasActions = false;

  get store(): WorkbenchStore | undefined {
    return this._store;
  }

  set store(value: WorkbenchStore | undefined) {
    this._store = value;
    this.syncSubscription();
    this.render();
  }

  get renderContent(): RenderSelectionContent {
    return this._renderContent;
  }

  set renderContent(value: RenderSelectionContent) {
    this._renderContent = value;
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
    const title = this.getAttribute('title') ?? 'Inspector';
    const emptyState = this.getAttribute('empty-state') ?? 'Select a record, point, or entity to inspect it here.';
    const selection = this.resolveStore()?.getState().selection ?? null;
    const markup = this._renderContent
      ? ''
      : selection
        ? renderSelectionMarkup(selection)
        : `<div class="rlwb-empty-state">${emptyState}</div>`;

    return `
      <section class="rlwb-inspector">
        <header class="rlwb-inspector__header">
          <div class="rlwb-panel__titles">
            <div class="rlwb-panel__title">${title}</div>
          </div>
          <div class="rlwb-panel__actions${this.hasActions ? '' : ' rlwb-hidden'}">
            <slot name="actions"></slot>
          </div>
        </header>
        <div class="rlwb-inspector__body" data-role="body">${markup}</div>
      </section>
    `;
  }

  protected onRendered(): void {
    const actionsSlot = this.$<HTMLSlotElement>('slot[name="actions"]');
    const handleSlotChange = () => {
      const nextHasActions = slotHasContent(actionsSlot);
      if (nextHasActions !== this.hasActions) {
        this.hasActions = nextHasActions;
        this.render();
      }
    };

    actionsSlot?.addEventListener('slotchange', handleSlotChange);
    handleSlotChange();

    if (!this._renderContent) {
      return;
    }

    const body = this.$<HTMLDivElement>('[data-role="body"]');
    if (!body) {
      return;
    }

    body.innerHTML = '';
    const selection = this.resolveStore()?.getState().selection ?? null;
    const rendered = this._renderContent(selection);

    if (typeof rendered === 'string') {
      body.innerHTML = rendered;
      return;
    }

    if (rendered instanceof Node) {
      body.append(rendered);
      return;
    }

    if (!selection) {
      body.innerHTML = `<div class="rlwb-empty-state">${this.getAttribute('empty-state') ?? 'Select a record, point, or entity to inspect it here.'}</div>`;
    }
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

register('ui-workbench-entity-inspector', UIWorkbenchEntityInspector);
