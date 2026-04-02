import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-accordion-item>` — Individual accordion section with header toggle and collapsible content.
 *
 * @slot header - The clickable header content.
 * @slot        - The collapsible body content.
 *
 * @fires ui-accordion-toggle - Bubbles to parent `<ui-accordion>` (detail: { value, expanded }).
 *
 * @example
 * ```html
 * <ui-accordion-item value="section1">
 *   <span slot="header">Section Title</span>
 *   <p>Section content goes here.</p>
 * </ui-accordion-item>
 * ```
 */
@customElement('ui-accordion-item')
export class UiAccordionItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      border-bottom: 1px solid var(--ui-color-border, #e2e8f0);
    }
    :host(:last-child) {
      border-bottom: none;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 14px 18px;
      background: var(--ui-color-surface, #fff);
      border: none;
      cursor: pointer;
      color: var(--ui-color-text, #0f172a);
      font-weight: 500;
      font-size: var(--ui-text-sm, 0.875rem);
      font-family: inherit;
      text-align: left;
    }
    .header:focus-visible {
      outline: 2px solid var(--ui-color-primary, #4f46e5);
      outline-offset: -2px;
    }
    .header--disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .chevron {
      flex-shrink: 0;
      transition: transform 200ms;
      color: var(--ui-color-text-secondary, #64748b);
    }
    .chevron--expanded {
      transform: rotate(180deg);
    }

    .content {
      padding: 0 18px 14px;
      font-size: var(--ui-text-sm, 0.875rem);
      color: var(--ui-color-text-secondary, #64748b);
      background: var(--ui-color-surface, #fff);
    }
    .content[hidden] {
      display: none;
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) expanded = false;

  private _toggle() {
    if (this.disabled) return;
    this.expanded = !this.expanded;
    this.dispatchEvent(
      new CustomEvent('ui-accordion-toggle', {
        detail: { value: this.value, expanded: this.expanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button
        type="button"
        class="header ${this.disabled ? 'header--disabled' : ''}"
        aria-expanded=${this.expanded}
        ?disabled=${this.disabled}
        @click=${this._toggle}
        part="header"
      >
        <slot name="header"></slot>
        <svg class="chevron ${this.expanded ? 'chevron--expanded' : ''}"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div class="content" ?hidden=${!this.expanded} part="content">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-accordion-item': UiAccordionItem;
  }
}
