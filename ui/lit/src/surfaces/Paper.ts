import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-paper>` — Elevated or outlined surface container.
 *
 * @slot - Content.
 *
 * @example
 * ```html
 * <ui-paper variant="elevated" elevation="2">
 *   <p>Elevated content</p>
 * </ui-paper>
 * ```
 */
@customElement('ui-paper')
export class UiPaper extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--ui-color-surface, #fff);
      border-radius: var(--ui-radius-md, 0.5rem);
      font-family: var(--ui-font-family, inherit);
      box-sizing: border-box;
    }

    :host([variant='outlined']) {
      border: 1px solid var(--ui-color-border, #e2e8f0);
      box-shadow: none;
    }

    :host([elevation='0']) { box-shadow: none; }
    :host([elevation='1']) { box-shadow: var(--ui-shadow-xs, 0 1px 2px rgba(0,0,0,0.05)); }
    :host([elevation='2']) { box-shadow: var(--ui-shadow-sm, 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)); }
    :host([elevation='3']) { box-shadow: var(--ui-shadow-md, 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)); }
    :host([elevation='4']) { box-shadow: var(--ui-shadow-lg, 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)); }
    :host([elevation='5']) { box-shadow: var(--ui-shadow-xl, 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)); }
  `;

  @property({ type: String, reflect: true }) variant: 'elevated' | 'outlined' = 'elevated';
  @property({ type: Number, reflect: true }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 1;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-paper': UiPaper;
  }
}
