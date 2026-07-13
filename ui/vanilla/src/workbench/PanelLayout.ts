import { UIElement } from '../core/UIElement';
import { register } from '../core/register';
import { WORKBENCH_CSS } from './styles';

export class UIWorkbenchPanelLayout extends UIElement {
  static observedAttributes = ['columns', 'rows', 'min-column-width', 'dense'];

  protected styles(): string {
    return WORKBENCH_CSS;
  }

  protected template(): string {
    const columns = this.getAttribute('columns');
    const rows = this.getAttribute('rows') ?? '';
    const minColumnWidth = this.getAttribute('min-column-width');
    const templateColumns = minColumnWidth
      ? `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`
      : columns
        ? (/^\d+$/.test(columns) ? `repeat(${columns}, 1fr)` : columns)
        : 'repeat(auto-fit, minmax(320px, 1fr))';

    const classes = [
      'rlwb-panel-layout',
      this.hasAttribute('dense') && 'rlwb-panel-layout--dense',
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <div
        class="${classes}"
        style="grid-template-columns:${templateColumns};${rows ? `grid-template-rows:${rows};` : ''}"
      >
        <slot></slot>
      </div>
    `;
  }
}

register('ui-workbench-panel-layout', UIWorkbenchPanelLayout);
