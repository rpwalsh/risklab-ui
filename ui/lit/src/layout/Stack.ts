import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-stack>` — Flex-based stack layout with direction, gap, alignment.
 *
 * @slot - Stacked children.
 *
 * @example
 * ```html
 * <ui-stack direction="row" gap="16px" align="center">
 *   <ui-button>A</ui-button>
 *   <ui-button>B</ui-button>
 * </ui-stack>
 * ```
 */
@customElement('ui-stack')
export class UiStack extends LitElement {
  static styles = css`
    :host {
      display: flex;
      box-sizing: border-box;
    }
  `;

  @property({ type: String }) direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' = 'column';
  @property({ type: String }) gap = '0';
  @property({ type: String }) align = 'stretch';
  @property({ type: String }) justify = 'flex-start';
  @property({ type: Boolean }) wrap = false;

  updated(): void {
    this.style.flexDirection = this.direction;
    this.style.gap = this.gap;
    this.style.alignItems = this.align;
    this.style.justifyContent = this.justify;
    this.style.flexWrap = this.wrap ? 'wrap' : 'nowrap';
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-stack': UiStack;
  }
}
