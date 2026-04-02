import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-card>` — Card container with named slots for header, default, footer.
 *
 * @slot header  - Card header area.
 * @slot         - Card body / main content.
 * @slot footer  - Card footer area (actions, links).
 *
 * @example
 * ```html
 * <ui-card variant="elevated" interactive>
 *   <span slot="header">Title</span>
 *   <p>Body content here</p>
 *   <div slot="footer"><ui-button>OK</ui-button></div>
 * </ui-card>
 * ```
 */
@customElement('ui-card')
export class UiCard extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      border-radius: var(--ui-card-radius, 0.75rem);
      overflow: hidden;
      font-family: var(--ui-font-family, inherit);
      color: var(--ui-card-color, inherit);
      text-decoration: none;
      transition: box-shadow 200ms, transform 100ms;
      box-sizing: border-box;
    }

    :host([variant='elevated']) {
      background-color: var(--ui-card-bg, #fff);
      box-shadow: var(--ui-shadow-sm, 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06));
    }
    :host([variant='outlined']) {
      background-color: var(--ui-card-bg, #fff);
      border: 1px solid var(--ui-color-border, #e2e8f0);
      box-shadow: none;
    }
    :host([variant='filled']) {
      background-color: var(--ui-card-filled-bg, #f9fafb);
      box-shadow: none;
    }

    :host([interactive]) {
      cursor: pointer;
    }
    :host([interactive]:hover) {
      box-shadow: var(--ui-shadow-md, 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06));
      transform: translateY(-1px);
    }

    .header {
      padding: var(--ui-card-header-padding, 1rem 1rem 0);
    }
    .body {
      padding: var(--ui-card-content-padding, 1rem);
      flex: 1;
    }
    .footer {
      padding: var(--ui-card-actions-padding, 0.5rem 1rem 1rem);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `;

  @property({ type: String, reflect: true }) variant: 'elevated' | 'outlined' | 'filled' = 'elevated';
  @property({ type: Boolean, reflect: true }) interactive = false;

  render() {
    return html`
      <div class="header" part="header"><slot name="header"></slot></div>
      <div class="body" part="body"><slot></slot></div>
      <div class="footer" part="footer"><slot name="footer"></slot></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-card': UiCard;
  }
}
