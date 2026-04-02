import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * `<ui-button>` — A fully-featured button with variants, sizes, colors,
 * loading state, and full-width option.
 *
 * @slot - Button label content.
 *
 * @fires click - Native click event (suppressed when disabled/loading).
 *
 * @example
 * ```html
 * <ui-button variant="filled" color="primary" size="md">Click me</ui-button>
 * <ui-button loading>Saving…</ui-button>
 * ```
 */
@customElement('ui-button')
export class UiButton extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    :host([fullWidth]) {
      display: flex;
      width: 100%;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      border: none;
      cursor: pointer;
      font-family: var(--ui-font-family, inherit);
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
      text-decoration: none;
      transition: background-color 150ms ease, color 150ms ease,
        border-color 150ms ease, box-shadow 150ms ease;
      outline: none;
      box-sizing: border-box;
      width: 100%;
    }

    .btn:focus-visible {
      outline: 2px solid var(--ui-color-primary, #4f46e5);
      outline-offset: 2px;
    }

    /* ── Sizes ───────────────────────── */
    .btn--xs { height: 1.5rem;  padding: 0 0.5rem;  font-size: 0.75rem;   border-radius: var(--ui-radius-sm, 0.25rem); }
    .btn--sm { height: 2rem;    padding: 0 0.75rem; font-size: 0.8125rem; border-radius: var(--ui-radius-sm, 0.25rem); }
    .btn--md { height: 2.5rem;  padding: 0 1rem;    font-size: 0.875rem;  border-radius: var(--ui-radius-md, 0.5rem); }
    .btn--lg { height: 3rem;    padding: 0 1.5rem;  font-size: 1rem;      border-radius: var(--ui-radius-md, 0.5rem); }
    .btn--xl { height: 3.5rem;  padding: 0 2rem;    font-size: 1.125rem;  border-radius: var(--ui-radius-lg, 0.75rem); }

    /* ── Filled ──────────────────────── */
    .btn--filled          { color: #fff; }
    .btn--filled.c-primary   { background: var(--ui-color-primary, #4f46e5); }
    .btn--filled.c-primary:hover { background: var(--ui-color-primary-hover, #4338ca); }
    .btn--filled.c-secondary { background: var(--ui-color-secondary, #7c3aed); }
    .btn--filled.c-secondary:hover { background: #6d28d9; }
    .btn--filled.c-success   { background: var(--ui-color-success, #16a34a); }
    .btn--filled.c-success:hover { background: #15803d; }
    .btn--filled.c-warning   { background: var(--ui-color-warning, #d97706); }
    .btn--filled.c-warning:hover { background: #b45309; }
    .btn--filled.c-error     { background: var(--ui-color-error, #dc2626); }
    .btn--filled.c-error:hover { background: #b91c1c; }
    .btn--filled.c-info      { background: var(--ui-color-info, #2563eb); }
    .btn--filled.c-info:hover { background: #1d4ed8; }
    .btn--filled.c-neutral   { background: var(--ui-color-neutral, #64748b); }
    .btn--filled.c-neutral:hover { background: #475569; }

    /* ── Outlined ────────────────────── */
    .btn--outlined          { background: transparent; border: 1px solid; }
    .btn--outlined.c-primary   { color: var(--ui-color-primary, #4f46e5);   border-color: var(--ui-color-primary, #4f46e5); }
    .btn--outlined.c-primary:hover { background: var(--ui-color-primary-subtle, #eef2ff); }
    .btn--outlined.c-secondary { color: var(--ui-color-secondary, #7c3aed); border-color: var(--ui-color-secondary, #7c3aed); }
    .btn--outlined.c-secondary:hover { background: var(--ui-color-secondary-subtle, #f5f3ff); }
    .btn--outlined.c-success   { color: var(--ui-color-success, #16a34a);   border-color: var(--ui-color-success, #16a34a); }
    .btn--outlined.c-success:hover { background: var(--ui-color-success-subtle, #f0fdf4); }
    .btn--outlined.c-warning   { color: var(--ui-color-warning, #d97706);   border-color: var(--ui-color-warning, #d97706); }
    .btn--outlined.c-warning:hover { background: var(--ui-color-warning-subtle, #fffbeb); }
    .btn--outlined.c-error     { color: var(--ui-color-error, #dc2626);     border-color: var(--ui-color-error, #dc2626); }
    .btn--outlined.c-error:hover { background: var(--ui-color-error-subtle, #fef2f2); }
    .btn--outlined.c-info      { color: var(--ui-color-info, #2563eb);      border-color: var(--ui-color-info, #2563eb); }
    .btn--outlined.c-info:hover { background: var(--ui-color-info-subtle, #eff6ff); }
    .btn--outlined.c-neutral   { color: var(--ui-color-neutral, #64748b);   border-color: var(--ui-color-neutral, #64748b); }
    .btn--outlined.c-neutral:hover { background: var(--ui-color-neutral-subtle, #f1f5f9); }

    /* ── Ghost ───────────────────────── */
    .btn--ghost          { background: transparent; border: none; }
    .btn--ghost.c-primary   { color: var(--ui-color-primary, #4f46e5); }
    .btn--ghost.c-primary:hover { background: var(--ui-color-primary-subtle, #eef2ff); }
    .btn--ghost.c-secondary { color: var(--ui-color-secondary, #7c3aed); }
    .btn--ghost.c-secondary:hover { background: var(--ui-color-secondary-subtle, #f5f3ff); }
    .btn--ghost.c-success   { color: var(--ui-color-success, #16a34a); }
    .btn--ghost.c-success:hover { background: var(--ui-color-success-subtle, #f0fdf4); }
    .btn--ghost.c-warning   { color: var(--ui-color-warning, #d97706); }
    .btn--ghost.c-warning:hover { background: var(--ui-color-warning-subtle, #fffbeb); }
    .btn--ghost.c-error     { color: var(--ui-color-error, #dc2626); }
    .btn--ghost.c-error:hover { background: var(--ui-color-error-subtle, #fef2f2); }
    .btn--ghost.c-info      { color: var(--ui-color-info, #2563eb); }
    .btn--ghost.c-info:hover { background: var(--ui-color-info-subtle, #eff6ff); }
    .btn--ghost.c-neutral   { color: var(--ui-color-neutral, #64748b); }
    .btn--ghost.c-neutral:hover { background: var(--ui-color-neutral-subtle, #f1f5f9); }

    /* ── Link ────────────────────────── */
    .btn--link          { background: transparent; border: none; text-decoration: underline; }
    .btn--link.c-primary   { color: var(--ui-color-primary, #4f46e5); }
    .btn--link.c-secondary { color: var(--ui-color-secondary, #7c3aed); }
    .btn--link.c-success   { color: var(--ui-color-success, #16a34a); }
    .btn--link.c-warning   { color: var(--ui-color-warning, #d97706); }
    .btn--link.c-error     { color: var(--ui-color-error, #dc2626); }
    .btn--link.c-info      { color: var(--ui-color-info, #2563eb); }
    .btn--link.c-neutral   { color: var(--ui-color-neutral, #64748b); }

    /* ── Disabled / Loading ──────────── */
    .btn--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    .btn--loading {
      position: relative;
      cursor: wait;
      pointer-events: none;
    }

    /* ── Spinner ──────────────────────── */
    .spinner {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: ui-spin 0.75s linear infinite;
      flex-shrink: 0;
    }

    @keyframes ui-spin {
      to { transform: rotate(360deg); }
    }
  `;

  @property({ type: String, reflect: true }) variant: 'filled' | 'outlined' | 'ghost' | 'link' = 'filled';
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String, reflect: true }) color: ColorVariant = 'primary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true }) fullWidth = false;

  render() {
    const classes = {
      btn: true,
      [`btn--${this.variant}`]: true,
      [`btn--${this.size}`]: true,
      [`c-${this.color}`]: true,
      'btn--disabled': this.disabled,
      'btn--loading': this.loading,
    };

    return html`
      <button
        type="button"
        class=${classMap(classes)}
        ?disabled=${this.disabled || this.loading}
        aria-disabled=${this.disabled || this.loading}
        aria-busy=${this.loading}
        part="button"
      >
        ${this.loading ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button': UiButton;
  }
}
