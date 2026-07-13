import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export interface TreeGridColumn { field: string; headerName: string; width?: number; align?: 'left' | 'center' | 'right'; }
export interface TreeGridRow extends Record<string, unknown> { id: string; children?: TreeGridRow[]; }

const escapeHTML = (value: unknown): string => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export class UITreeGrid extends UIElement {
  private _columns: TreeGridColumn[] = [];
  private _rows: TreeGridRow[] = [];
  private expanded = new Set<string>();
  private selected = '';

  set columns(value: TreeGridColumn[]) { this._columns = value ?? []; this.render(); }
  get columns(): readonly TreeGridColumn[] { return this._columns; }
  set rows(value: TreeGridRow[]) { this._rows = value ?? []; this.render(); }
  get rows(): readonly TreeGridRow[] { return this._rows; }
  expandAll(): void { this.walk(this._rows, (row) => { if (row.children?.length) this.expanded.add(row.id); }); this.render(); }
  collapseAll(): void { this.expanded.clear(); this.render(); }

  protected styles(): string {
    return `:host{display:block;min-width:0}.shell{border:1px solid var(--ui-color-border,#334155);border-radius:.55rem;overflow:auto;max-height:var(--ui-tree-grid-height,420px);background:var(--ui-color-surface,#07111f)}table{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed;font-size:.82rem}th,td{height:38px;padding:0 .6rem;border-right:1px solid var(--ui-color-border,#334155);border-bottom:1px solid var(--ui-color-border,#334155);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}th{position:sticky;top:0;z-index:2;text-align:left;background:var(--ui-color-surface-variant,#0f1b2d);color:var(--ui-color-text-secondary,#9fb0c8)}tr[aria-selected=true] td{background:color-mix(in srgb,var(--ui-color-primary,#22d3ee) 14%,var(--ui-color-surface,#07111f))}tr:hover td{background:color-mix(in srgb,var(--ui-color-primary,#22d3ee) 7%,var(--ui-color-surface,#07111f))}.tree-cell{display:flex;align-items:center;gap:.35rem}.toggle{width:1.5rem;height:1.5rem;padding:0;border:0;background:transparent;color:var(--ui-color-primary,#22d3ee);cursor:pointer}.leaf{display:inline-block;width:1.5rem;text-align:center;color:var(--ui-color-text-secondary,#9fb0c8)}`;
  }

  protected template(): string {
    const rows: string[] = [];
    const renderRows = (items: readonly TreeGridRow[], depth: number) => {
      for (const row of items) {
        const hasChildren = Boolean(row.children?.length);
        const isOpen = this.expanded.has(row.id);
        const cells = this._columns.map((column, index) => `<td style="text-align:${column.align ?? 'left'}"><div class="${index === 0 ? 'tree-cell' : ''}" style="${index === 0 ? `padding-left:${depth * 18}px` : ''}">${index === 0 ? (hasChildren ? `<button class="toggle" data-toggle="${escapeHTML(row.id)}" aria-label="${isOpen ? 'Collapse' : 'Expand'} ${escapeHTML(row[column.field])}" aria-expanded="${isOpen}">${isOpen ? '−' : '+'}</button>` : '<span class="leaf">•</span>') : ''}<span>${escapeHTML(row[column.field])}</span></div></td>`).join('');
        rows.push(`<tr data-row="${escapeHTML(row.id)}" aria-level="${depth + 1}" aria-expanded="${hasChildren ? isOpen : 'false'}" aria-selected="${this.selected === row.id}">${cells}</tr>`);
        if (hasChildren && isOpen) renderRows(row.children!, depth + 1);
      }
    };
    renderRows(this._rows, 0);
    return `<div class="shell"><table role="treegrid"><thead><tr>${this._columns.map((column) => `<th style="width:${column.width ?? 160}px">${escapeHTML(column.headerName)}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${Math.max(1, this._columns.length)}">No rows</td></tr>`}</tbody></table></div>`;
  }

  protected onRendered(): void {
    this.$$<HTMLButtonElement>('[data-toggle]').forEach((button) => button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = button.dataset.toggle!;
      if (this.expanded.has(id)) this.expanded.delete(id);
      else this.expanded.add(id);
      this.render();
      this.emit('ui-expansion', { rowId: id, expanded: this.expanded.has(id) });
    }));
    this.$$<HTMLTableRowElement>('[data-row]').forEach((row) => row.addEventListener('click', () => {
      this.selected = row.dataset.row!;
      this.render();
      this.emit('ui-selection', { rowId: this.selected });
    }));
  }

  private walk(rows: readonly TreeGridRow[], visit: (row: TreeGridRow) => void): void { for (const row of rows) { visit(row); if (row.children) this.walk(row.children, visit); } }
}

register('ui-tree-grid', UITreeGrid);
