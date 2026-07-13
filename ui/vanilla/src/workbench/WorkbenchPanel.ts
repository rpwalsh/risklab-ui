import { UIElement } from '../core/UIElement';
import { register } from '../core/register';
import type { WorkbenchPanelState, WorkbenchStore } from './state';
import { resolveElementWorkbenchStore, slotHasContent } from './helpers';
import { WORKBENCH_CSS } from './styles';

export class UIWorkbenchPanel extends UIElement {
  static observedAttributes = [
    'panel-id',
    'title',
    'subtitle',
    'collapsible',
    'default-collapsed',
    'padding',
    'tone',
  ];

  private _store?: WorkbenchStore;
  private unsubscribe?: () => void;
  private localPanelState: WorkbenchPanelState = {};
  private hasFooter = false;

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
    const title = this.getAttribute('title') ?? '';
    const subtitle = this.getAttribute('subtitle') ?? '';
    const padding = this.getAttribute('padding') ?? 'md';
    const tone = this.getAttribute('tone') ?? 'default';
    const currentState = this.getPanelState();
    const collapsible = this.hasAttribute('collapsible');
    const collapsed = Boolean(currentState.collapsed);
    const classes = [
      'rlwb-panel',
      collapsed && 'rlwb-panel--collapsed',
      `rlwb-panel--padding-${padding}`,
      tone !== 'default' && `rlwb-panel--tone-${tone}`,
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <section class="${classes}">
        <header class="rlwb-panel__header">
          <div class="rlwb-panel__titles">
            <div class="rlwb-panel__title">${title}</div>
            ${subtitle ? `<div class="rlwb-panel__subtitle">${subtitle}</div>` : ''}
          </div>
          <div class="rlwb-panel__actions">
            <slot name="actions"></slot>
            ${collapsible ? '<button class="rlwb-icon-button" type="button" data-action="toggle" aria-label="Toggle panel">⌄</button>' : ''}
          </div>
        </header>
        <div class="rlwb-panel__body${collapsed ? ' rlwb-hidden' : ''}">
          <slot></slot>
        </div>
        <footer class="rlwb-panel__footer${this.hasFooter ? '' : ' rlwb-hidden'}">
          <slot name="footer"></slot>
        </footer>
      </section>
    `;
  }

  protected onRendered(): void {
    const button = this.$<HTMLButtonElement>('[data-action="toggle"]');
    button?.addEventListener('click', () => {
      const panelId = this.getAttribute('panel-id');
      const currentState = this.getPanelState();
      const patch = { collapsed: !currentState.collapsed };
      const store = this.resolveStore();

      if (panelId && store) {
        store.actions.patchPanelState(panelId, patch);
      } else {
        this.localPanelState = { ...currentState, ...patch };
        this.render();
      }
    });

    const footerSlot = this.$<HTMLSlotElement>('slot[name="footer"]');
    const handleSlotChange = () => {
      const nextHasFooter = slotHasContent(footerSlot);
      if (nextHasFooter !== this.hasFooter) {
        this.hasFooter = nextHasFooter;
        this.render();
      }
    };

    footerSlot?.addEventListener('slotchange', handleSlotChange);
    handleSlotChange();
  }

  private resolveStore(): WorkbenchStore | null {
    return resolveElementWorkbenchStore(this, this._store);
  }

  private getPanelState(): WorkbenchPanelState {
    const panelId = this.getAttribute('panel-id');
    const store = this.resolveStore();
    const externalState = panelId && store ? store.getState().panels[panelId] : undefined;

    return {
      collapsed: this.hasAttribute('default-collapsed'),
      ...this.localPanelState,
      ...externalState,
    };
  }

  private syncSubscription(): void {
    this.unsubscribe?.();
    const store = this.resolveStore();
    const panelId = this.getAttribute('panel-id');
    if (!store || !panelId || !this.isConnected) {
      return;
    }

    this.unsubscribe = store.subscribe(() => {
      this.render();
    });
  }
}

register('ui-workbench-panel', UIWorkbenchPanel);
