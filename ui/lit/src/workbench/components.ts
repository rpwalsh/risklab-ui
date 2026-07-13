import { LitElement, html, nothing, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, property, state as litState } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  type WorkbenchStore,
  type WorkbenchState,
  createWorkbenchStore,
  type WorkbenchPanelState,
  type WorkbenchSelection,
} from './state';
import {
  createWorkbenchThemeVars,
  resolveWorkbenchTheme,
  type WorkbenchThemeTokens,
  type WorkbenchTone,
} from './theme';
import {
  type FilterDefinition,
  type TimeRangeOption,
  defaultTimeRangeOptions,
  filterValueIncludes,
  renderSelectionMarkup,
  resolveElementWorkbenchStore,
  slotHasContent,
  timeWindowsEqual,
  toggleFilterValue,
} from './helpers';
import { WORKBENCH_CSS } from './styles';

class WorkbenchLitElement extends LitElement {
  static styles = unsafeCSS(WORKBENCH_CSS);
}

@customElement('ui-workbench-shell')
export class UiWorkbenchShell extends WorkbenchLitElement {
  @property() tone: WorkbenchTone = 'dark';
  @property({ attribute: false }) theme?: Partial<WorkbenchThemeTokens>;
  @property({ attribute: false }) initialState?: Partial<WorkbenchState>;
  @property({ attribute: false }) store?: WorkbenchStore;
  @litState() private hasNav = false;
  @litState() private hasTopbar = false;
  @litState() private hasInspector = false;
  @litState() private hasStatus = false;

  private handleSlotChange = () => {
    const navSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="nav"]');
    const topbarSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="topbar"]');
    const inspectorSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="inspector"]');
    const statusSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="status"]');
    this.hasNav = slotHasContent(navSlot);
    this.hasTopbar = slotHasContent(topbarSlot);
    this.hasInspector = slotHasContent(inspectorSlot);
    this.hasStatus = slotHasContent(statusSlot);
  };

  get workbenchStore(): WorkbenchStore {
    if (!this.store) {
      this.store = createWorkbenchStore(this.initialState);
    }
    return this.store;
  }

  render() {
    return html`
      <div
        data-rl-workbench=""
        class=${classMap({
          'rlwb-shell': true,
          'rlwb-shell--has-nav': this.hasNav,
          'rlwb-shell--has-inspector': this.hasInspector,
        })}
        style=${styleMap(createWorkbenchThemeVars(resolveWorkbenchTheme(this.tone, this.theme)))}
      >
        <aside class=${this.hasNav ? 'rlwb-shell__nav' : 'rlwb-shell__nav rlwb-hidden'}>
          <slot name="nav" @slotchange=${this.handleSlotChange}></slot>
        </aside>
        <div class="rlwb-shell__frame">
          <header class=${this.hasTopbar ? 'rlwb-shell__topbar' : 'rlwb-shell__topbar rlwb-hidden'}>
            <slot name="topbar" @slotchange=${this.handleSlotChange}></slot>
          </header>
          <div class="rlwb-shell__body">
            <main class="rlwb-shell__workspace">
              <slot></slot>
            </main>
            <aside class=${this.hasInspector ? 'rlwb-shell__inspector' : 'rlwb-shell__inspector rlwb-hidden'}>
              <slot name="inspector" @slotchange=${this.handleSlotChange}></slot>
            </aside>
          </div>
          <footer class=${this.hasStatus ? 'rlwb-shell__status' : 'rlwb-shell__status rlwb-hidden'}>
            <slot name="status" @slotchange=${this.handleSlotChange}></slot>
          </footer>
        </div>
      </div>
    `;
  }
}

@customElement('ui-workbench-panel-layout')
export class UiWorkbenchPanelLayout extends WorkbenchLitElement {
  @property() columns?: string;
  @property() rows?: string;
  @property({ attribute: 'min-column-width', type: Number }) minColumnWidth?: number;
  @property({ type: Boolean }) dense = false;

  render() {
    const templateColumns = this.minColumnWidth
      ? `repeat(auto-fit, minmax(${this.minColumnWidth}px, 1fr))`
      : this.columns ?? 'repeat(auto-fit, minmax(320px, 1fr))';

    return html`
      <div
        class=${classMap({
          'rlwb-panel-layout': true,
          'rlwb-panel-layout--dense': this.dense,
        })}
        style=${styleMap({
          'grid-template-columns': templateColumns,
          'grid-template-rows': this.rows ?? '',
        })}
      >
        <slot></slot>
      </div>
    `;
  }
}

@customElement('ui-workbench-panel')
export class UiWorkbenchPanel extends WorkbenchLitElement {
  @property({ attribute: 'panel-id' }) panelId?: string;
  @property() title = '';
  @property() subtitle?: string;
  @property({ type: Boolean }) collapsible = false;
  @property({ attribute: 'default-collapsed', type: Boolean }) defaultCollapsed = false;
  @property() padding: 'none' | 'sm' | 'md' = 'md';
  @property() tone: 'default' | 'positive' | 'warning' | 'danger' = 'default';
  @property({ attribute: false }) store?: WorkbenchStore;
  @litState() private hasFooter = false;
  private localPanelState: WorkbenchPanelState = {};
  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncSubscription();
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  updated(): void {
    this.syncSubscription();
  }

  private resolveStore(): WorkbenchStore | null {
    return resolveElementWorkbenchStore(this, this.store);
  }

  private getPanelState(): WorkbenchPanelState {
    const externalState = this.panelId && this.resolveStore()
      ? this.resolveStore()!.getState().panels[this.panelId]
      : undefined;

    return {
      collapsed: this.defaultCollapsed,
      ...this.localPanelState,
      ...externalState,
    };
  }

  private syncSubscription() {
    this.unsubscribe?.();
    const store = this.resolveStore();
    if (!store || !this.panelId) {
      return;
    }
    this.unsubscribe = store.subscribe(() => this.requestUpdate());
  }

  private handleFooterChange = () => {
    const footerSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="footer"]');
    this.hasFooter = slotHasContent(footerSlot);
  };

  private toggleCollapsed = () => {
    const nextCollapsed = !this.getPanelState().collapsed;
    const store = this.resolveStore();
    if (this.panelId && store) {
      store.actions.patchPanelState(this.panelId, { collapsed: nextCollapsed });
      return;
    }

    this.localPanelState = { ...this.localPanelState, collapsed: nextCollapsed };
    this.requestUpdate();
  };

  render() {
    const collapsed = Boolean(this.getPanelState().collapsed);

    return html`
      <section
        class=${classMap({
          'rlwb-panel': true,
          'rlwb-panel--collapsed': collapsed,
          [`rlwb-panel--padding-${this.padding}`]: true,
          [`rlwb-panel--tone-${this.tone}`]: this.tone !== 'default',
        })}
      >
        <header class="rlwb-panel__header">
          <div class="rlwb-panel__titles">
            <div class="rlwb-panel__title">${this.title}</div>
            ${this.subtitle ? html`<div class="rlwb-panel__subtitle">${this.subtitle}</div>` : nothing}
          </div>
          <div class="rlwb-panel__actions">
            <slot name="actions"></slot>
            ${this.collapsible
              ? html`<button type="button" class="rlwb-icon-button" @click=${this.toggleCollapsed}>⌄</button>`
              : nothing}
          </div>
        </header>
        ${collapsed ? nothing : html`<div class="rlwb-panel__body"><slot></slot></div>`}
        <footer class=${this.hasFooter ? 'rlwb-panel__footer' : 'rlwb-panel__footer rlwb-hidden'}>
          <slot name="footer" @slotchange=${this.handleFooterChange}></slot>
        </footer>
      </section>
    `;
  }
}

@customElement('ui-workbench-query-bar')
export class UiWorkbenchQueryBar extends WorkbenchLitElement {
  @property() label = 'Query';
  @property() placeholder = 'Search, scope, or command';
  @property({ attribute: false }) store?: WorkbenchStore;
  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncSubscription();
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  private resolveStore(): WorkbenchStore | null {
    return resolveElementWorkbenchStore(this, this.store);
  }

  private syncSubscription() {
    this.unsubscribe?.();
    const store = this.resolveStore();
    if (!store) {
      return;
    }
    this.unsubscribe = store.subscribe(() => this.requestUpdate());
  }

  render() {
    const query = this.resolveStore()?.getState().query ?? '';
    return html`
      <label class="rlwb-query-bar">
        <span class="rlwb-query-label">${this.label}</span>
        <input
          class="rlwb-query-input"
          type="search"
          .value=${query}
          placeholder=${this.placeholder}
          @input=${(event: Event) => this.resolveStore()?.actions.setQuery((event.currentTarget as HTMLInputElement).value)}
        />
      </label>
    `;
  }
}

@customElement('ui-workbench-filter-bar')
export class UiWorkbenchFilterBar extends WorkbenchLitElement {
  @property({ attribute: false }) filters: FilterDefinition[] = [];
  @property({ attribute: false }) store?: WorkbenchStore;
  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncSubscription();
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  private resolveStore(): WorkbenchStore | null {
    return resolveElementWorkbenchStore(this, this.store);
  }

  private syncSubscription() {
    this.unsubscribe?.();
    const store = this.resolveStore();
    if (!store) {
      return;
    }
    this.unsubscribe = store.subscribe(() => this.requestUpdate());
  }

  render() {
    const state = this.resolveStore()?.getState();

    return html`
      <div class="rlwb-filter-bar">
        ${this.filters.map((filter) => {
          const currentValue = filter.scope === 'panel'
            ? state?.panels[filter.panelId ?? '']?.filters?.[filter.key]
            : state?.filters[filter.key];

          return html`
            <div class="rlwb-filter-group">
              <span class="rlwb-filter-group__label">${filter.label}</span>
              <div class="rlwb-filter-group__options">
                ${filter.options.map((option) => html`
                  <button
                    type="button"
                    class="rlwb-filter-chip"
                    aria-pressed=${filterValueIncludes(currentValue, option.value) ? 'true' : 'false'}
                    @click=${() => {
                      const store = this.resolveStore();
                      if (!store) {
                        return;
                      }

                      const nextValue = toggleFilterValue(currentValue, option.value, Boolean(filter.multi));
                      if (filter.scope === 'panel' && filter.panelId) {
                        store.actions.setPanelFilter(filter.panelId, filter.key, nextValue);
                      } else {
                        store.actions.setFilter(filter.key, nextValue);
                      }
                    }}
                  >
                    ${option.label}
                  </button>
                `)}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}

@customElement('ui-workbench-time-range-control')
export class UiWorkbenchTimeRangeControl extends WorkbenchLitElement {
  @property({ attribute: false }) options: TimeRangeOption[] = defaultTimeRangeOptions;
  @property({ attribute: false }) store?: WorkbenchStore;
  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncSubscription();
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  private resolveStore(): WorkbenchStore | null {
    return resolveElementWorkbenchStore(this, this.store);
  }

  private syncSubscription() {
    this.unsubscribe?.();
    const store = this.resolveStore();
    if (!store) {
      return;
    }
    this.unsubscribe = store.subscribe(() => this.requestUpdate());
  }

  render() {
    const currentTimeWindow = this.resolveStore()?.getState().timeWindow;
    return html`
      <div class="rlwb-time-range">
        ${this.options.map((option) => html`
          <button
            type="button"
            class="rlwb-filter-chip"
            aria-pressed=${timeWindowsEqual(currentTimeWindow, option.value) ? 'true' : 'false'}
            @click=${() => this.resolveStore()?.actions.setTimeWindow(option.value)}
          >
            ${option.label}
          </button>
        `)}
      </div>
    `;
  }
}

@customElement('ui-entity-inspector')
export class UiEntityInspector extends WorkbenchLitElement {
  @property() title = 'Inspector';
  @property({ attribute: 'empty-state' }) emptyState = 'Select a record, point, or entity to inspect it here.';
  @property({ attribute: false }) renderContent?: (selection: WorkbenchSelection | null) => string | TemplateResult | null | undefined;
  @property({ attribute: false }) store?: WorkbenchStore;
  private unsubscribe?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncSubscription();
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  private resolveStore(): WorkbenchStore | null {
    return resolveElementWorkbenchStore(this, this.store);
  }

  private syncSubscription() {
    this.unsubscribe?.();
    const store = this.resolveStore();
    if (!store) {
      return;
    }
    this.unsubscribe = store.subscribe(() => this.requestUpdate());
  }

  render() {
    const selection = this.resolveStore()?.getState().selection ?? null;
    const rendered = this.renderContent?.(selection);

    return html`
      <section class="rlwb-inspector">
        <header class="rlwb-inspector__header">
          <div class="rlwb-panel__titles">
            <div class="rlwb-panel__title">${this.title}</div>
          </div>
        </header>
        <div class="rlwb-inspector__body">
          ${typeof rendered === 'string'
            ? html`<div>${unsafeHTML(rendered)}</div>`
            : rendered
              ?? (selection
                ? html`${unsafeHTML(renderSelectionMarkup(selection))}`
                : html`<div class="rlwb-empty-state">${this.emptyState}</div>`)}
        </div>
      </section>
    `;
  }
}
