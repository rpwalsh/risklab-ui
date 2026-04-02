import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-breadcrumbs>` — Breadcrumb navigation.
 *
 * @attr {string} separator - Separator character (default: /)
 *
 * @example
 * ```html
 * <ui-breadcrumbs separator="›">
 *   <a href="/">Home</a>
 *   <a href="/products">Products</a>
 *   <span>Widget</span>
 * </ui-breadcrumbs>
 * ```
 */
export class UIBreadcrumbs extends UIElement {
  static observedAttributes = ['separator'];

  protected styles(): string {
    return /* css */ `
      :host { display: block; }
      nav { display: flex; align-items: center; flex-wrap: wrap; gap: var(--ui-space-1, 0.25rem); }
      .sep {
        color: var(--ui-color-text-secondary, #64748b);
        font-size: var(--ui-text-sm, 0.875rem);
        user-select: none;
      }
      ::slotted(*) {
        font-size: var(--ui-text-sm, 0.875rem);
        color: var(--ui-color-text-secondary, #64748b);
        text-decoration: none;
      }
      ::slotted(a:hover) { color: var(--ui-color-primary, #4f46e5); text-decoration: underline; }
      ::slotted(*:last-child) { color: var(--ui-color-text, #0f172a); font-weight: var(--ui-weight-medium, 500); }
    `;
  }

  protected template(): string {
    return `
      <nav aria-label="Breadcrumb" part="nav">
        <slot></slot>
      </nav>
    `;
  }

  protected onConnected(): void {
    // Insert separators between slotted children
    requestAnimationFrame(() => this._insertSeparators());
  }

  private _insertSeparators(): void {
    const sep = this.getAttr('separator', '/');
    const items = Array.from(this.children).filter((c) => !c.classList.contains('_bc-sep'));

    // Remove old separators
    this.querySelectorAll('._bc-sep').forEach((s) => s.remove());

    items.forEach((item, i) => {
      if (i < items.length - 1) {
        const span = document.createElement('span');
        span.className = '_bc-sep';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ` ${sep} `;
        span.style.color = 'var(--ui-color-text-secondary, #64748b)';
        span.style.fontSize = 'var(--ui-text-sm, 0.875rem)';
        item.after(span);
      }
    });
  }
}

register('ui-breadcrumbs', UIBreadcrumbs);
