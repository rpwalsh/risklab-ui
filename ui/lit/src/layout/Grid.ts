import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-grid>` — CSS Grid layout container.
 *
 * @slot - Grid children.
 *
 * @example
 * ```html
 * <ui-grid columns="3" gap="16px">
 *   <div>Cell 1</div>
 *   <div>Cell 2</div>
 *   <div>Cell 3</div>
 * </ui-grid>
 * ```
 */
@customElement('ui-grid')
export class UiGrid extends LitElement {
  static styles = css`
    :host {
      display: grid;
      box-sizing: border-box;
    }
  `;

  @property({ type: String }) columns = '1';
  @property({ type: String }) gap = '0';
  @property({ type: String }) rows = '';

  updated(): void {
    // If columns is a plain number, convert to repeat(N, 1fr)
    const cols = /^\d+$/.test(this.columns)
      ? `repeat(${this.columns}, 1fr)`
      : this.columns;
    this.style.gridTemplateColumns = cols;
    this.style.gap = this.gap;
    if (this.rows) {
      const r = /^\d+$/.test(this.rows)
        ? `repeat(${this.rows}, 1fr)`
        : this.rows;
      this.style.gridTemplateRows = r;
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-grid': UiGrid;
  }
}
