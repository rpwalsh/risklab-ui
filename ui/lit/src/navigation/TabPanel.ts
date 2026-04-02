import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-tab-panel>` — Content panel that shows/hides based on active tab.
 *
 * @slot - Panel body content.
 *
 * @example
 * ```html
 * <ui-tab-panel value="tab1">Panel 1 content</ui-tab-panel>
 * ```
 */
@customElement('ui-tab-panel')
export class UiTabPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    :host(:not([active])) {
      display: none;
    }
    .panel {
      padding: var(--ui-space-4, 1rem);
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: Boolean, reflect: true }) active = false;

  render() {
    return html`
      <div class="panel" role="tabpanel" part="panel">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tab-panel': UiTabPanel;
  }
}
