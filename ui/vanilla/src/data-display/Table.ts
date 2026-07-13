import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export interface UITableColumn { key: string; label: string; sortable?: boolean; align?: 'left' | 'center' | 'right'; }

export class UITable extends UIElement {
  static observedAttributes = ['striped', 'hover', 'dense', 'caption', 'empty-message'];
  private _columns: UITableColumn[] = [];
  private _rows: Record<string, unknown>[] = [];
  private sortKey = '';
  private sortDirection: 'asc' | 'desc' = 'asc';
  set columns(value: UITableColumn[]) { this._columns = value ?? []; this.render(); }
  get columns(): UITableColumn[] { return this._columns; }
  set rows(value: Record<string, unknown>[]) { this._rows = value ?? []; this.render(); }
  get rows(): Record<string, unknown>[] { return this._rows; }
  protected styles(): string { return `:host{display:block;overflow:auto;width:100%}table{width:100%;border-collapse:collapse;font-size:.875rem}caption{text-align:left;padding:.5rem 0;font-weight:700}th,td{padding:var(--_pad,.65rem .75rem);border-bottom:1px solid var(--ui-color-border,#cbd5e1);text-align:left}th{color:var(--ui-color-text-secondary,#64748b);font-size:.75rem;text-transform:uppercase;letter-spacing:.04em}th button{all:unset;cursor:pointer;display:inline-flex;gap:.35rem;align-items:center}:host([dense]){--_pad:.4rem .55rem}:host([striped]) tbody tr:nth-child(even){background:color-mix(in srgb,var(--ui-color-text,#fff) 3%,transparent)}:host([hover]) tbody tr:hover{background:color-mix(in srgb,var(--ui-color-primary,#4f46e5) 8%,transparent)}.empty{text-align:center;color:var(--ui-color-text-secondary,#64748b)}`; }
  protected template(): string { const rows = [...this.rows].sort((a, b) => this.sortKey ? String(a[this.sortKey] ?? '').localeCompare(String(b[this.sortKey] ?? '')) * (this.sortDirection === 'asc' ? 1 : -1) : 0); return `<table><caption>${this.getAttr('caption')}</caption><thead><tr>${this.columns.map((column) => `<th style="text-align:${column.align ?? 'left'}">${column.sortable ? `<button data-key="${column.key}">${column.label}<span>${this.sortKey === column.key ? (this.sortDirection === 'asc' ? '↑' : '↓') : '↕'}</span></button>` : column.label}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map((row, index) => `<tr data-index="${index}">${this.columns.map((column) => `<td style="text-align:${column.align ?? 'left'}">${String(row[column.key] ?? '')}</td>`).join('')}</tr>`).join('') : `<tr><td class="empty" colspan="${Math.max(1, this.columns.length)}">${this.getAttr('empty-message', 'No rows')}</td></tr>`}</tbody></table>`; }
  protected onRendered(): void { this.$$<HTMLButtonElement>('th button').forEach((button) => button.addEventListener('click', () => { const key = button.dataset.key ?? ''; this.sortDirection = this.sortKey === key && this.sortDirection === 'asc' ? 'desc' : 'asc'; this.sortKey = key; this.render(); this.emit('ui-sort', { key, direction: this.sortDirection }); })); this.$$<HTMLElement>('tbody tr[data-index]').forEach((row) => row.addEventListener('click', () => this.emit('ui-row-select', { index: Number(row.dataset.index) }))); }
}

register('ui-table', UITable);
