import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { UiTab } from './Tab.js';
import type { UiTabPanel } from './TabPanel.js';

/**
 * `<ui-tabs>` — Tab container that manages active tab state.
 *
 * @slot - Should contain `<ui-tab>` and `<ui-tab-panel>` elements.
 * @fires ui-tab-change - When active tab changes (detail: { value }).
 *
 * @example
 * ```html
 * <ui-tabs value="tab1">
 *   <ui-tab value="tab1">Tab 1</ui-tab>
 *   <ui-tab value="tab2">Tab 2</ui-tab>
 *   <ui-tab-panel value="tab1">Content 1</ui-tab-panel>
 *   <ui-tab-panel value="tab2">Content 2</ui-tab-panel>
 * </ui-tabs>
 * ```
 */
@customElement('ui-tabs')
export class UiTabs extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      font-family: var(--ui-font-family, inherit);
    }

    .tab-list {
      display: flex;
      gap: var(--ui-space-1, 4px);
      border-bottom: 2px solid var(--ui-color-border, #e2e8f0);
    }
  `;

  @property({ type: String }) value = '';

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('ui-tab-click', this._onTabClick as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('ui-tab-click', this._onTabClick as EventListener);
  }

  private _onTabClick = (e: CustomEvent<{ value: string }>) => {
    e.stopPropagation();
    const newVal = e.detail.value;
    if (newVal !== this.value) {
      this.value = newVal;
      this._syncChildren();
      this.dispatchEvent(
        new CustomEvent('ui-tab-change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  updated(changed: Map<string, unknown>): void {
    if (changed.has('value')) {
      this._syncChildren();
    }
  }

  firstUpdated(): void {
    this._syncChildren();
  }

  private _syncChildren() {
    const tabs = this.querySelectorAll<UiTab & HTMLElement>('ui-tab');
    const panels = this.querySelectorAll<UiTabPanel & HTMLElement>('ui-tab-panel');
    tabs.forEach((tab) => {
      tab.selected = tab.value === this.value;
    });
    panels.forEach((panel) => {
      panel.active = panel.value === this.value;
    });
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tabs': UiTabs;
  }
}
