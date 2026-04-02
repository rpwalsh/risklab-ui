import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-divider>` — Visual separator, horizontal or vertical.
 *
 * @example
 * ```html
 * <ui-divider></ui-divider>
 * <ui-divider orientation="vertical" thickness="2px" color="#e2e8f0"></ui-divider>
 * ```
 */
@customElement('ui-divider')
export class UiDivider extends LitElement {
  static styles = css`
    :host {
      display: block;
      flex-shrink: 0;
    }

    .divider {
      border: none;
      margin: 0;
    }

    .divider--horizontal {
      width: 100%;
      border-top-style: solid;
    }

    .divider--vertical {
      height: 100%;
      min-height: 1em;
      align-self: stretch;
      border-left-style: solid;
      display: inline-block;
    }
  `;

  @property({ type: String }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: String }) color = 'var(--ui-color-border, #e2e8f0)';
  @property({ type: String }) thickness = '1px';

  render() {
    const isVert = this.orientation === 'vertical';
    const style = isVert
      ? `border-left-width:${this.thickness};border-left-color:${this.color}`
      : `border-top-width:${this.thickness};border-top-color:${this.color}`;

    return html`
      <hr
        class="divider divider--${this.orientation}"
        style=${style}
        role="separator"
        aria-orientation=${this.orientation}
        part="divider"
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-divider': UiDivider;
  }
}
