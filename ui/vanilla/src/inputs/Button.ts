import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-button>` — A versatile button component.
 *
 * @attr {string} variant - filled | outlined | ghost | link (default: filled)
 * @attr {string} size - xs | sm | md | lg | xl (default: md)
 * @attr {string} color - primary | secondary | neutral | success | warning | error | info (default: primary)
 * @attr {boolean} disabled - Disables the button
 * @attr {boolean} loading - Shows a spinner and disables interaction
 * @attr {boolean} full-width - Stretches to container width
 *
 * @fires click - Standard click event (suppressed when disabled/loading)
 *
 * @example
 * ```html
 * <ui-button variant="filled" color="primary">Click me</ui-button>
 * <ui-button variant="outlined" size="sm" disabled>Disabled</ui-button>
 * <ui-button loading>Saving…</ui-button>
 * ```
 */
export class UIButton extends UIElement {
  static observedAttributes = [
    'variant', 'size', 'color', 'disabled', 'loading', 'full-width',
  ];

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; }
      :host([full-width]) { display: flex; width: 100%; }

      button {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--ui-space-2, 0.5rem);
        cursor: pointer;
        font-family: inherit;
        font-weight: var(--ui-weight-medium, 500);
        border-radius: var(--ui-radius-md, 0.5rem);
        transition: background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s, opacity 0.15s;
        white-space: nowrap;
        user-select: none;
        -webkit-user-select: none;
        line-height: 1;
        width: 100%;
        text-align: center;
      }

      /* Sizes */
      button.size-xs { padding: 0.25rem 0.5rem;   font-size: var(--ui-text-xs, 0.75rem); }
      button.size-sm { padding: 0.375rem 0.75rem;  font-size: var(--ui-text-sm, 0.875rem); }
      button.size-md { padding: 0.5rem 1rem;       font-size: var(--ui-text-sm, 0.875rem); }
      button.size-lg { padding: 0.625rem 1.25rem;  font-size: var(--ui-text-base, 1rem); }
      button.size-xl { padding: 0.75rem 1.5rem;    font-size: var(--ui-text-lg, 1.125rem); }

      /* Variant: filled */
      button.variant-filled {
        background: var(--_btn-bg, var(--ui-color-primary, #4f46e5));
        color: #fff;
      }
      button.variant-filled:hover:not(:disabled) {
        filter: brightness(0.9);
      }

      /* Variant: outlined */
      button.variant-outlined {
        background: transparent;
        color: var(--_btn-bg, var(--ui-color-primary, #4f46e5));
        box-shadow: inset 0 0 0 1px currentColor;
      }
      button.variant-outlined:hover:not(:disabled) {
        background: color-mix(in srgb, var(--_btn-bg, var(--ui-color-primary, #4f46e5)) 8%, transparent);
      }

      /* Variant: ghost */
      button.variant-ghost {
        background: transparent;
        color: var(--_btn-bg, var(--ui-color-primary, #4f46e5));
      }
      button.variant-ghost:hover:not(:disabled) {
        background: color-mix(in srgb, var(--_btn-bg, var(--ui-color-primary, #4f46e5)) 10%, transparent);
      }

      /* Variant: link */
      button.variant-link {
        background: transparent;
        color: var(--_btn-bg, var(--ui-color-primary, #4f46e5));
        padding-inline: 0;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      /* Color mappings */
      :host([color="primary"])   button { --_btn-bg: var(--ui-color-primary, #4f46e5); }
      :host([color="secondary"]) button { --_btn-bg: var(--ui-color-secondary, #7c3aed); }
      :host([color="neutral"])   button { --_btn-bg: var(--ui-color-neutral, #64748b); }
      :host([color="success"])   button { --_btn-bg: var(--ui-color-success, #16a34a); }
      :host([color="warning"])   button { --_btn-bg: var(--ui-color-warning, #d97706); }
      :host([color="error"])     button { --_btn-bg: var(--ui-color-error, #dc2626); }
      :host([color="info"])      button { --_btn-bg: var(--ui-color-info, #2563eb); }

      /* Disabled */
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Loading spinner */
      .spinner {
        display: inline-block;
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* Focus ring */
      button:focus-visible {
        outline: 2px solid var(--ui-color-primary, #4f46e5);
        outline-offset: 2px;
      }
    `;
  }

  protected template(): string {
    const variant = this.getAttr('variant', 'filled');
    const size = this.getAttr('size', 'md');
    const disabled = this.getBoolAttr('disabled') || this.getBoolAttr('loading');
    const loading = this.getBoolAttr('loading');

    return `
      <button
        class="variant-${variant} size-${size}"
        ${disabled ? 'disabled' : ''}
        role="button"
        part="button"
      >
        ${loading ? '<span class="spinner" aria-hidden="true"></span>' : ''}
        <slot></slot>
      </button>
    `;
  }

  protected onRendered(): void {
    this.$('button')?.addEventListener('click', (e) => {
      if (this.getBoolAttr('disabled') || this.getBoolAttr('loading')) {
        e.stopPropagation();
        e.preventDefault();
      }
    });
  }
}

register('ui-button', UIButton);
