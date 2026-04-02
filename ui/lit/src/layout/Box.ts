import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-box>` — Generic styled container with padding, margin, display, background.
 *
 * @slot - Any content.
 *
 * @example
 * ```html
 * <ui-box p="16px" m="8px" display="flex" bg="#f3f4f6">
 *   <p>Boxed content</p>
 * </ui-box>
 * ```
 */
@customElement('ui-box')
export class UiBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
    }
  `;

  @property({ type: String }) p = '';
  @property({ type: String }) m = '';
  @property({ type: String }) display = '';
  @property({ type: String }) bg = '';

  render() {
    const style = [
      this.p ? `padding:${this.p}` : '',
      this.m ? `margin:${this.m}` : '',
      this.display ? `display:${this.display}` : '',
      this.bg ? `background:${this.bg}` : '',
    ]
      .filter(Boolean)
      .join(';');

    return html`
      <div style=${style} part="box">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-box': UiBox;
  }
}
