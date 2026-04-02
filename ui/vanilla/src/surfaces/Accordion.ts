import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-accordion>` — Expandable accordion sections.
 *
 * @attr {boolean} multiple - Allow multiple sections open at once
 *
 * @fires ui-change - { value: string, open: boolean }
 *
 * @example
 * ```html
 * <ui-accordion>
 *   <ui-accordion-item value="s1" label="Section 1">Content 1</ui-accordion-item>
 *   <ui-accordion-item value="s2" label="Section 2">Content 2</ui-accordion-item>
 * </ui-accordion>
 * ```
 */
export class UIAccordion extends UIElement {
  static observedAttributes = ['multiple'];

  protected styles(): string {
    return /* css */ `
      :host { display: block; }
      .accordion {
        border: 1px solid var(--ui-color-border, #e2e8f0);
        border-radius: var(--ui-radius-md, 0.5rem);
        overflow: hidden;
      }
    `;
  }

  protected template(): string {
    return '<div class="accordion" part="accordion"><slot></slot></div>';
  }

  protected onConnected(): void {
    this.addEventListener('accordion-toggle', ((e: CustomEvent) => {
      const multiple = this.getBoolAttr('multiple');
      if (!multiple) {
        // Close other items
        this.querySelectorAll('ui-accordion-item').forEach((item) => {
          if (item !== e.detail.element) {
            item.removeAttribute('open');
          }
        });
      }
      this.emit('ui-change', { value: e.detail.value, open: e.detail.open });
    }) as EventListener);
  }
}

/**
 * `<ui-accordion-item>` — Individual accordion section.
 *
 * @attr {string} value - Unique identifier
 * @attr {string} label - Trigger label
 * @attr {boolean} open - Whether the section is expanded
 * @attr {boolean} disabled
 */
export class UIAccordionItem extends UIElement {
  static observedAttributes = ['value', 'label', 'open', 'disabled'];

  get open(): boolean { return this.getBoolAttr('open'); }
  set open(v: boolean) {
    if (v) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  protected styles(): string {
    return /* css */ `
      :host { display: block; }
      :host(:not(:last-child)) .item { border-bottom: 1px solid var(--ui-color-border, #e2e8f0); }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--ui-space-3, 0.75rem) var(--ui-space-4, 1rem);
        cursor: pointer;
        user-select: none;
        font-weight: var(--ui-weight-medium, 500);
        font-size: var(--ui-text-sm, 0.875rem);
        color: var(--ui-color-text, #0f172a);
        background: transparent;
        transition: background 0.15s;
      }
      .header:hover { background: var(--ui-color-surface-variant, #f8fafc); }
      :host([disabled]) .header { opacity: 0.5; cursor: not-allowed; }

      .chevron {
        transition: transform 0.2s;
        font-size: 0.75em;
        color: var(--ui-color-text-secondary, #64748b);
      }
      :host([open]) .chevron { transform: rotate(180deg); }

      .body {
        display: none;
        padding: 0 var(--ui-space-4, 1rem) var(--ui-space-4, 1rem);
        font-size: var(--ui-text-sm, 0.875rem);
        color: var(--ui-color-text, #0f172a);
        line-height: var(--ui-leading-normal, 1.5);
      }
      :host([open]) .body { display: block; }
    `;
  }

  protected template(): string {
    const label = this.getAttr('label', '');

    return `
      <div class="item" part="item">
        <div class="header" role="button" aria-expanded="${this.open}" part="header">
          <span>${label}</span>
          <span class="chevron" aria-hidden="true">▼</span>
        </div>
        <div class="body" role="region" part="body">
          <slot></slot>
        </div>
      </div>
    `;
  }

  protected onRendered(): void {
    this.$('.header')?.addEventListener('click', () => {
      if (this.getBoolAttr('disabled')) return;
      this.open = !this.open;
      this.render();
      this.dispatchEvent(
        new CustomEvent('accordion-toggle', {
          bubbles: true,
          composed: true,
          detail: { value: this.getAttr('value'), open: this.open, element: this },
        }),
      );
    });
  }
}

register('ui-accordion', UIAccordion);
register('ui-accordion-item', UIAccordionItem);
