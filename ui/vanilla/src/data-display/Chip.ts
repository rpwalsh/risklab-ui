import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-chip>` — Small label element.
 *
 * @attr {string} variant - filled | outlined
 * @attr {string} size - xs | sm | md | lg
 * @attr {string} color - primary | secondary | neutral | success | warning | error | info
 * @attr {boolean} deletable - Shows a delete button
 * @attr {boolean} disabled
 *
 * @fires ui-delete - Fires when delete button is clicked
 */
export class UIChip extends UIElement {
  static observedAttributes = ['variant', 'size', 'color', 'deletable', 'disabled'];

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; }
      :host([disabled]) { opacity: 0.5; pointer-events: none; }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        border-radius: var(--ui-radius-full, 9999px);
        font-family: inherit;
        font-weight: var(--ui-weight-medium, 500);
        white-space: nowrap;
        transition: background 0.15s, color 0.15s;
      }

      .chip.size-xs { padding: 0.125rem 0.375rem; font-size: var(--ui-text-xs, 0.75rem); }
      .chip.size-sm { padding: 0.175rem 0.5rem;   font-size: var(--ui-text-xs, 0.75rem); }
      .chip.size-md { padding: 0.25rem 0.625rem;   font-size: var(--ui-text-sm, 0.875rem); }
      .chip.size-lg { padding: 0.375rem 0.75rem;   font-size: var(--ui-text-sm, 0.875rem); }

      .chip.variant-filled {
        background: var(--_chip-bg, var(--ui-color-primary-subtle, #eef2ff));
        color: var(--_chip-fg, var(--ui-color-primary, #4f46e5));
      }
      .chip.variant-outlined {
        background: transparent;
        color: var(--_chip-fg, var(--ui-color-primary, #4f46e5));
        box-shadow: inset 0 0 0 1px currentColor;
      }

      :host([color="primary"])   .chip { --_chip-bg: var(--ui-color-primary-subtle); --_chip-fg: var(--ui-color-primary); }
      :host([color="secondary"]) .chip { --_chip-bg: var(--ui-color-secondary-subtle); --_chip-fg: var(--ui-color-secondary); }
      :host([color="neutral"])   .chip { --_chip-bg: var(--ui-color-neutral-subtle); --_chip-fg: var(--ui-color-neutral); }
      :host([color="success"])   .chip { --_chip-bg: var(--ui-color-success-subtle); --_chip-fg: var(--ui-color-success); }
      :host([color="warning"])   .chip { --_chip-bg: var(--ui-color-warning-subtle); --_chip-fg: var(--ui-color-warning); }
      :host([color="error"])     .chip { --_chip-bg: var(--ui-color-error-subtle); --_chip-fg: var(--ui-color-error); }
      :host([color="info"])      .chip { --_chip-bg: var(--ui-color-info-subtle); --_chip-fg: var(--ui-color-info); }

      .delete-btn {
        all: unset;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        font-size: 0.85em;
        opacity: 0.7;
        transition: opacity 0.15s;
      }
      .delete-btn:hover { opacity: 1; }
    `;
  }

  protected template(): string {
    const variant = this.getAttr('variant', 'filled');
    const size = this.getAttr('size', 'md');
    const deletable = this.getBoolAttr('deletable');

    return `
      <span class="chip variant-${variant} size-${size}" part="chip">
        <slot></slot>
        ${deletable ? '<button class="delete-btn" aria-label="Remove" part="delete">✕</button>' : ''}
      </span>
    `;
  }

  protected onRendered(): void {
    this.$('.delete-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.emit('ui-delete');
    });
  }
}

register('ui-chip', UIChip);
