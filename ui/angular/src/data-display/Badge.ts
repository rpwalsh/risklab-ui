import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import type { ColorVariant } from '../core/types';

/**
 * Badge — Standalone Angular component wrapping a child element.
 *
 * @example
 * ```html
 * <ui-badge [content]="5" color="error">
 *   <span>🔔</span>
 * </ui-badge>
 * ```
 */
@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [],
  template: `
    <span class="ui-badge" [attr.data-color]="color()">
      <ng-content />
      @if (variant() === 'dot') {
        <span class="ui-badge__indicator ui-badge__indicator--dot"></span>
      } @else {
        <span class="ui-badge__indicator" [class.ui-badge__indicator--invisible]="!displayValue()">
          {{ displayValue() }}
        </span>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }
    .ui-badge {
      position: relative;
      display: inline-flex;
      vertical-align: middle;
      flex-shrink: 0;
    }
    .ui-badge__indicator {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      font-family: var(--ui-font-family, inherit);
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
      z-index: 1;
      border: 2px solid var(--ui-badge-outline, #fff);
      min-width: 1.25rem;
      height: 1.25rem;
      font-size: 0.75rem;
      padding: 0 0.375rem;
      border-radius: 0.625rem;
      top: 0;
      right: 0;
      transform: translateX(50%) translateY(-50%);
      background-color: var(--ui-color-error, #ef4444);
      color: #fff;
    }
    .ui-badge__indicator--invisible { display: none; }
    .ui-badge__indicator--dot {
      min-width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      padding: 0;
      font-size: 0;
    }

    [data-color="primary"]   .ui-badge__indicator { background-color: var(--ui-color-primary, #4f46e5); }
    [data-color="secondary"] .ui-badge__indicator { background-color: var(--ui-color-secondary, #7c3aed); }
    [data-color="success"]   .ui-badge__indicator { background-color: var(--ui-color-success, #16a34a); }
    [data-color="warning"]   .ui-badge__indicator { background-color: var(--ui-color-warning, #d97706); }
    [data-color="error"]     .ui-badge__indicator { background-color: var(--ui-color-error, #dc2626); }
    [data-color="info"]      .ui-badge__indicator { background-color: var(--ui-color-info, #2563eb); }
    [data-color="neutral"]   .ui-badge__indicator { background-color: var(--ui-color-neutral, #64748b); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  readonly content = input<string | number | undefined>(undefined);
  readonly variant = input<'standard' | 'dot'>('standard');
  readonly color = input<ColorVariant>('error');
  readonly max = input(99);

  protected readonly displayValue = computed(() => {
    const c = this.content();
    if (c === undefined || c === null || c === '') return '';
    const num = typeof c === 'number' ? c : parseInt(String(c), 10);
    if (!isNaN(num) && num > this.max()) return `${this.max()}+`;
    return String(c);
  });
}
