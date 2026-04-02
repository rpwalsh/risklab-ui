import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * Checkbox — Standalone Angular component with two-way `checked` binding.
 *
 * @example
 * ```html
 * <ui-checkbox [(checked)]="agree" label="I agree to terms" color="primary" />
 * ```
 */
@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [],
  template: `
    <label [class]="hostClass()" [attr.data-size]="size()" [attr.data-color]="color()">
      <input
        #inputEl
        type="checkbox"
        class="ui-checkbox__input"
        [checked]="checked()"
        [disabled]="disabled()"
        [indeterminate]="indeterminate()"
        (change)="onChange($event)"
      />
      <span class="ui-checkbox__box">
        @if (checked() && !indeterminate()) {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
        @if (indeterminate()) {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      </span>
      @if (label()) {
        <span class="ui-checkbox__label">{{ label() }}</span>
      }
    </label>
  `,
  styles: [`
    :host { display: inline-flex; }
    label {
      display: inline-flex;
      align-items: center;
      gap: 0.5em;
      cursor: pointer;
      font-family: var(--ui-font-family, inherit);
      font-size: var(--_cb-font, 0.875rem);
      user-select: none;
    }
    label[data-size="xs"] { --_cb-size: 14px; --_cb-font: 0.75rem; }
    label[data-size="sm"] { --_cb-size: 16px; --_cb-font: 0.8125rem; }
    label[data-size="md"] { --_cb-size: 18px; --_cb-font: 0.875rem; }
    label[data-size="lg"] { --_cb-size: 22px; --_cb-font: 1rem; }
    label[data-size="xl"] { --_cb-size: 26px; --_cb-font: 1.125rem; }

    .ui-checkbox__input { position: absolute; opacity: 0; width: 0; height: 0; }

    .ui-checkbox__box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--_cb-size, 18px);
      height: var(--_cb-size, 18px);
      border: 2px solid var(--ui-color-border, #d1d5db);
      border-radius: var(--ui-radius-sm, 0.25rem);
      transition: background-color 150ms, border-color 150ms;
      flex-shrink: 0;
      color: #fff;
    }
    .ui-checkbox__box svg {
      width: calc(var(--_cb-size, 18px) - 4px);
      height: calc(var(--_cb-size, 18px) - 4px);
    }

    .ui-checkbox__input:checked + .ui-checkbox__box,
    .ui-checkbox__input:indeterminate + .ui-checkbox__box {
      background-color: var(--_cb-color, var(--ui-color-primary, #4f46e5));
      border-color: var(--_cb-color, var(--ui-color-primary, #4f46e5));
    }

    .ui-checkbox__input:disabled + .ui-checkbox__box { opacity: 0.5; cursor: not-allowed; }
    .ui-checkbox__input:focus-visible + .ui-checkbox__box {
      outline: 2px solid var(--ui-color-primary);
      outline-offset: 2px;
    }

    label[data-color="primary"]   { --_cb-color: var(--ui-color-primary, #4f46e5); }
    label[data-color="secondary"] { --_cb-color: var(--ui-color-secondary, #7c3aed); }
    label[data-color="success"]   { --_cb-color: var(--ui-color-success, #16a34a); }
    label[data-color="warning"]   { --_cb-color: var(--ui-color-warning, #d97706); }
    label[data-color="error"]     { --_cb-color: var(--ui-color-error, #dc2626); }
    label[data-color="info"]      { --_cb-color: var(--ui-color-info, #2563eb); }
    label[data-color="neutral"]   { --_cb-color: var(--ui-color-neutral, #64748b); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkbox {
  readonly indeterminate = input(false);
  readonly disabled = input(false);
  readonly size = input<SizeVariant>('md');
  readonly color = input<ColorVariant>('primary');
  readonly label = input('');

  /** Two-way bound checked state */
  readonly checked = model(false);

  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  constructor() {
    effect(() => {
      const el = this.inputEl()?.nativeElement;
      if (el) el.indeterminate = this.indeterminate();
    });
  }

  protected readonly hostClass = computed(() => 'ui-checkbox');

  protected onChange(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.checked.set(el.checked);
  }
}
