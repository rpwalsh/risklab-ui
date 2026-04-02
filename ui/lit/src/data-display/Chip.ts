import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * `<ui-chip>` — Compact element for tags, filters, selections.
 *
 * @slot - Chip label content.
 * @fires ui-delete - When close/delete button is clicked (detail: {}).
 *
 * @example
 * ```html
 * <ui-chip color="primary" deletable>TypeScript</ui-chip>
 * ```
 */
@customElement('ui-chip')
export class UiChip extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.375em;
      font-family: var(--ui-font-family, inherit);
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
      border: 1px solid transparent;
      box-sizing: border-box;
      transition: background-color 150ms, color 150ms, border-color 150ms, opacity 150ms;
      outline: none;
      user-select: none;
      max-width: 100%;
    }

    /* Sizes */
    .chip--xs { height: 1.25rem; font-size: 0.625rem; padding: 0 0.375rem; border-radius: 0.625rem; }
    .chip--sm { height: 1.5rem;  font-size: 0.75rem;  padding: 0 0.5rem;   border-radius: 0.75rem; }
    .chip--md { height: 2rem;    font-size: 0.8125rem; padding: 0 0.75rem;  border-radius: 1rem; }
    .chip--lg { height: 2.5rem;  font-size: 0.875rem; padding: 0 1rem;     border-radius: 1.25rem; }
    .chip--xl { height: 3rem;    font-size: 1rem;     padding: 0 1.25rem;  border-radius: 1.5rem; }

    /* Filled variant */
    .chip--filled.c-primary   { background: var(--ui-color-primary, #4f46e5);   color: #fff; }
    .chip--filled.c-secondary { background: var(--ui-color-secondary, #7c3aed); color: #fff; }
    .chip--filled.c-success   { background: var(--ui-color-success, #16a34a);   color: #fff; }
    .chip--filled.c-warning   { background: var(--ui-color-warning, #d97706);   color: #fff; }
    .chip--filled.c-error     { background: var(--ui-color-error, #dc2626);     color: #fff; }
    .chip--filled.c-info      { background: var(--ui-color-info, #2563eb);      color: #fff; }
    .chip--filled.c-neutral   { background: var(--ui-color-neutral, #64748b);   color: #fff; }

    /* Outlined variant */
    .chip--outlined.c-primary   { background: transparent; color: var(--ui-color-primary, #4f46e5);   border-color: var(--ui-color-primary, #4f46e5); }
    .chip--outlined.c-secondary { background: transparent; color: var(--ui-color-secondary, #7c3aed); border-color: var(--ui-color-secondary, #7c3aed); }
    .chip--outlined.c-success   { background: transparent; color: var(--ui-color-success, #16a34a);   border-color: var(--ui-color-success, #16a34a); }
    .chip--outlined.c-warning   { background: transparent; color: var(--ui-color-warning, #d97706);   border-color: var(--ui-color-warning, #d97706); }
    .chip--outlined.c-error     { background: transparent; color: var(--ui-color-error, #dc2626);     border-color: var(--ui-color-error, #dc2626); }
    .chip--outlined.c-info      { background: transparent; color: var(--ui-color-info, #2563eb);      border-color: var(--ui-color-info, #2563eb); }
    .chip--outlined.c-neutral   { background: transparent; color: var(--ui-color-neutral, #64748b);   border-color: var(--ui-color-neutral, #64748b); }

    .chip--disabled { opacity: 0.5; pointer-events: none; }

    .delete-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0 -0.25em 0 0;
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      opacity: 0.7;
      font-size: 1em;
      line-height: 1;
      border-radius: 50%;
      outline: none;
      transition: opacity 150ms;
    }
    .delete-btn:hover { opacity: 1; }
  `;

  @property({ type: String, reflect: true }) variant: 'filled' | 'outlined' = 'filled';
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String, reflect: true }) color: ColorVariant = 'primary';
  @property({ type: Boolean }) deletable = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _onDelete(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('ui-delete', { bubbles: true, composed: true }),
    );
  }

  render() {
    const classes = {
      chip: true,
      [`chip--${this.variant}`]: true,
      [`chip--${this.size}`]: true,
      [`c-${this.color}`]: true,
      'chip--disabled': this.disabled,
    };

    return html`
      <span class=${classMap(classes)} part="chip">
        <slot></slot>
        ${this.deletable
          ? html`<button
              type="button"
              class="delete-btn"
              aria-label="Remove"
              @click=${this._onDelete}
              part="delete"
            >
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>`
          : nothing}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-chip': UiChip;
  }
}
