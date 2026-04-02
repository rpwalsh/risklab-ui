import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-grid>` — CSS Grid layout container.
 *
 * @attr {string} columns - grid-template-columns (default: repeat(12, 1fr))
 * @attr {string} gap - Grid gap (default: var(--ui-space-4))
 * @attr {string} rows - grid-template-rows
 */
export class UIGrid extends UIElement {
  static observedAttributes = ['columns', 'gap', 'rows'];

  protected styles(): string {
    return ':host { display: block; }';
  }

  protected template(): string {
    const columns = this.getAttr('columns', 'repeat(12, 1fr)');
    const gap = this.getAttr('gap', 'var(--ui-space-4, 1rem)');
    const rows = this.getAttr('rows');

    const style = [
      'display:grid',
      `grid-template-columns:${columns}`,
      `gap:${gap}`,
      rows ? `grid-template-rows:${rows}` : '',
    ].filter(Boolean).join(';');

    return `<div style="${style}" part="grid"><slot></slot></div>`;
  }
}

register('ui-grid', UIGrid);
