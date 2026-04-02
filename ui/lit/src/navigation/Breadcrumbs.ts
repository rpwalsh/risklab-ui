import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-breadcrumbs>` — Breadcrumb navigation with configurable separator.
 * Automatically inserts separators between slotted children.
 *
 * @slot - Breadcrumb items (links, spans).
 *
 * @example
 * ```html
 * <ui-breadcrumbs separator="/">
 *   <a href="/">Home</a>
 *   <a href="/products">Products</a>
 *   <span>Detail</span>
 * </ui-breadcrumbs>
 * ```
 */
@customElement('ui-breadcrumbs')
export class UiBreadcrumbs extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      font-family: var(--ui-font-family, inherit);
      font-size: var(--ui-text-sm, 0.875rem);
      color: var(--ui-color-text-secondary, #64748b);
    }

    .list {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
      flex-wrap: wrap;
    }

    ::slotted(:not(:last-child))::after {
      content: var(--ui-breadcrumb-separator, '/');
      margin-inline: var(--ui-space-2, 0.5rem);
      user-select: none;
      opacity: 0.6;
    }

    ::slotted(:last-child) {
      color: var(--ui-color-text, #0f172a);
      font-weight: 500;
    }

    ::slotted(a) {
      color: inherit;
      text-decoration: none;
    }
    ::slotted(a:hover) {
      text-decoration: underline;
    }
  `;

  @property({ type: String }) separator = '/';

  updated(changed: Map<string, unknown>): void {
    if (changed.has('separator')) {
      this.style.setProperty('--ui-breadcrumb-separator', `'${this.separator}'`);
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.style.setProperty('--ui-breadcrumb-separator', `'${this.separator}'`);
  }

  render() {
    return html`
      <nav aria-label="Breadcrumb" part="nav">
        <slot></slot>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-breadcrumbs': UiBreadcrumbs;
  }
}
