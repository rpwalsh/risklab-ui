import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
  output,
} from '@angular/core';
import type { SizeVariant, SelectOptionData } from '../core/types';

/**
 * Select — Standalone Angular component with two-way `value` binding.
 *
 * @example
 * ```html
 * <ui-select label="Country" [(value)]="country" [options]="countries" />
 * ```
 */
@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-select" [attr.data-size]="size()" [attr.data-variant]="'outlined'" [attr.data-error]="error()">
      @if (label()) {
        <label class="ui-select__label">{{ label() }}</label>
      }
      <select
        class="ui-select__native"
        [disabled]="disabled()"
        [value]="value()"
        (change)="onChange($event)"
      >
        @if (placeholder()) {
          <option value="" disabled [selected]="!value()">{{ placeholder() }}</option>
        }
        @for (opt of options(); track opt.value) {
          <option [value]="opt.value" [disabled]="opt.disabled ?? false">{{ opt.label }}</option>
        }
      </select>
      @if (helperText()) {
        <p [class]="error() ? 'ui-select__helper ui-select__helper--error' : 'ui-select__helper ui-select__helper--normal'">
          {{ helperText() }}
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-select {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-family: var(--ui-font-family, inherit);
    }
    .ui-select__label {
      font-size: var(--ui-sel-label-size, 0.8125rem);
      font-weight: 500;
      color: var(--ui-sel-label-color, #374151);
    }
    .ui-select__native {
      height: var(--ui-sel-height, 2.5rem);
      padding: var(--ui-sel-padding, 0 2rem 0 0.75rem);
      font-size: var(--ui-sel-font-size, 0.875rem);
      font-family: inherit;
      background-color: var(--ui-sel-bg, transparent);
      border: 1px solid var(--ui-sel-border, #d1d5db);
      border-radius: var(--ui-sel-radius, 0.375rem);
      color: inherit;
      outline: none;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
      transition: border-color 150ms;
      box-sizing: border-box;
      width: 100%;
    }
    .ui-select__native:focus {
      border-color: var(--ui-color-primary, #4f46e5);
    }
    .ui-select__native:disabled { opacity: 0.5; cursor: not-allowed; }
    .ui-select__helper { font-size: 0.75rem; margin: 0; }
    .ui-select__helper--error { color: var(--ui-color-error, #dc2626); }
    .ui-select__helper--normal { color: var(--ui-sel-helper-color, #6b7280); }

    [data-size="xs"] .ui-select__native { height: 1.5rem; font-size: 0.75rem; }
    [data-size="sm"] .ui-select__native { height: 2rem; font-size: 0.8125rem; }
    [data-size="lg"] .ui-select__native { height: 3rem; font-size: 1rem; }
    [data-size="xl"] .ui-select__native { height: 3.5rem; font-size: 1.125rem; }

    [data-error="true"] .ui-select__native { border-color: var(--ui-color-error, #dc2626); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {
  readonly options = input<SelectOptionData[]>([]);
  readonly size = input<SizeVariant>('md');
  readonly label = input('');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly error = input(false);
  readonly helperText = input('');

  /** Two-way bound value */
  readonly value = model('');

  readonly selectionChange = output<string>();

  protected onChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
    this.selectionChange.emit(val);
  }
}
