import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { UiAccordionItem } from './AccordionItem.js';

/**
 * `<ui-accordion>` — Container that manages accordion item expansion.
 * Set `multiple` to allow multiple items open simultaneously.
 *
 * @slot - Should contain `<ui-accordion-item>` elements.
 *
 * @example
 * ```html
 * <ui-accordion>
 *   <ui-accordion-item value="faq1"><span slot="header">Q1</span>Answer 1</ui-accordion-item>
 *   <ui-accordion-item value="faq2"><span slot="header">Q2</span>Answer 2</ui-accordion-item>
 * </ui-accordion>
 * ```
 */
@customElement('ui-accordion')
export class UiAccordion extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--ui-color-border, #e2e8f0);
      border-radius: var(--ui-radius-lg, 0.75rem);
      font-family: var(--ui-font-family, inherit);
    }
  `;

  @property({ type: Boolean }) multiple = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('ui-accordion-toggle', this._onItemToggle as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('ui-accordion-toggle', this._onItemToggle as EventListener);
  }

  private _onItemToggle = (e: CustomEvent<{ value: string; expanded: boolean }>) => {
    e.stopPropagation();
    if (!this.multiple && e.detail.expanded) {
      // Close other items
      const items = this.querySelectorAll<UiAccordionItem & HTMLElement>('ui-accordion-item');
      items.forEach((item) => {
        if (item.value !== e.detail.value) {
          item.expanded = false;
        }
      });
    }
  };

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-accordion': UiAccordion;
  }
}
