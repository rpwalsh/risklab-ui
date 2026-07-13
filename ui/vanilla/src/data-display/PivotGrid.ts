import { pivotData, type AggregateOperation } from './pivotEngine';
import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

export interface PivotValueDefinition {
  field?: string;
  operation: AggregateOperation;
  label: string;
}

export interface PivotGridConfig {
  rows: string[];
  column: string;
  values: PivotValueDefinition[];
}

const escapeHTML = (value: unknown): string => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const formatValue = (value: unknown): string => typeof value === 'number'
  ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)
  : String(value ?? '—');

export class UIPivotGrid extends UIElement {
  private _rows: Record<string, unknown>[] = [];
  private _config: PivotGridConfig = { rows: [], column: '', values: [] };

  set rows(value: Record<string, unknown>[]) { this._rows = value ?? []; this.render(); }
  get rows(): readonly Record<string, unknown>[] { return this._rows; }
  set config(value: PivotGridConfig) { this._config = value ?? { rows: [], column: '', values: [] }; this.render(); }
  get config(): PivotGridConfig { return this._config; }

  protected styles(): string {
    return `:host{display:block;min-width:0}.viewport{overflow:auto;max-height:var(--ui-pivot-height,420px);border:1px solid var(--ui-color-border,#334155);border-radius:.55rem;background:var(--ui-color-surface,#07111f)}table{width:100%;border-collapse:separate;border-spacing:0;font-size:.8rem;font-variant-numeric:tabular-nums}th,td{padding:.55rem .65rem;border-right:1px solid var(--ui-color-border,#334155);border-bottom:1px solid var(--ui-color-border,#334155);white-space:nowrap;text-align:right}th{position:sticky;top:0;z-index:2;background:var(--ui-color-surface-variant,#0f1b2d);color:var(--ui-color-text-secondary,#9fb0c8);font-weight:650}.dimension{position:sticky;left:0;z-index:1;text-align:left;background:var(--ui-color-surface,#07111f);font-weight:600}.total{background:color-mix(in srgb,var(--ui-color-primary,#22d3ee) 8%,var(--ui-color-surface,#07111f));font-weight:700}.empty{padding:2rem;text-align:center;color:var(--ui-color-text-secondary,#9fb0c8)}`;
  }

  protected template(): string {
    if (!this._config.column || this._config.rows.length === 0 || this._config.values.length === 0) return '<div class="empty">Set rows, column, and values to create a pivot view.</div>';
    const values = this._config.values.map((value, index) => ({ field: value.field, operation: value.operation, as: `value-${index}` }));
    const result = pivotData(this._rows, { rows: this._config.rows, column: this._config.column, values });
    const header = result.columns.map((column) => this._config.values.map((value) => `<th>${escapeHTML(column)} · ${escapeHTML(value.label)}</th>`).join('')).join('');
    const body = result.rows.map((row) => {
      const dimensions = this._config.rows.map((field) => escapeHTML(row.dimensions[field])).join(' / ');
      const cells = result.columns.map((column) => this._config.values.map((_value, index) => `<td>${escapeHTML(formatValue(row.cells[String(column)]?.[`value-${index}`]))}</td>`).join('')).join('');
      const totals = this._config.values.map((_value, index) => `<td class="total">${escapeHTML(formatValue(row.totals[`value-${index}`]))}</td>`).join('');
      return `<tr><td class="dimension">${dimensions}</td>${cells}${totals}</tr>`;
    }).join('');
    const grand = this._config.values.map((_value, index) => `<td class="total">${escapeHTML(formatValue(result.totals[`value-${index}`]))}</td>`).join('');
    return `<div class="viewport"><table aria-label="Pivot data"><thead><tr><th class="dimension">${escapeHTML(this._config.rows.join(' / '))}</th>${header}${this._config.values.map((value) => `<th>Total · ${escapeHTML(value.label)}</th>`).join('')}</tr></thead><tbody>${body || '<tr><td class="empty">No rows</td></tr>'}<tr><td class="dimension total">Grand total</td><td colspan="${Math.max(1, result.columns.length * this._config.values.length)}"></td>${grand}</tr></tbody></table></div>`;
  }
}

register('ui-pivot-grid', UIPivotGrid);
