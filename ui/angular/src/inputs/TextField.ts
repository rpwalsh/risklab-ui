import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
  output,
} from '@angular/core';
import type { SizeVariant } from '../core/types';

/**
 * TextField — Standalone Angular component with two-way `value` binding.
 *
 * @example
 * ```html
 * <ui-text-field label="Email" [(value)]="email" placeholder="you@example.com" />
 * ```
 */
@Component({
  selector: 'ui-text-field',
  standalone: true,
  imports: [],
  template: `
    <div [class]="wrapperClass()" [attr.data-size]="size()" [attr.data-variant]="variant()" [attr.data-error]="error()">
      @if (label()) {
        <label class="ui-textfield__label">{{ label() }}</label>
      }
      <div class="ui-textfield__wrapper" [class.ui-textfield__wrapper--disabled]="disabled()">
        <input
          class="ui-textfield__input"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readOnly]="readonly()"
          [value]="value()"
          (input)="onInput($event)"
        />
      </div>
      @if (helperText()) {
        <p [class]="error() ? 'ui-textfield__helper ui-textfield__helper--error' : 'ui-textfield__helper ui-textfield__helper--normal'">
          {{ helperText() }}
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-textfield {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-family: var(--ui-font-family, inherit);
    }
    .ui-textfield__label {
      font-size: var(--ui-tf-label-size, 0.8125rem);
      font-weight: 500;
      color: var(--ui-tf-label-color, #374151);
    }
    .ui-textfield__wrapper {
      display: flex;
      align-items: center;
      gap: 0.5em;
      height: var(--ui-tf-height, 2.5rem);
      padding: var(--ui-tf-padding, 0 0.75rem);
      font-size: var(--ui-tf-font-size, 0.875rem);
      background-color: var(--ui-tf-bg, transparent);
      border: 1px solid var(--ui-tf-border, #d1d5db);
      border-radius: var(--ui-tf-radius, 0.375rem);
      transition: border-color 150ms;
      box-sizing: border-box;
    }
    .ui-textfield__wrapper:focus-within {
      border-color: var(--ui-tf-focus-border, var(--ui-color-primary, #4f46e5));
    }
    .ui-textfield__wrapper--disabled { opacity: 0.5; pointer-events: none; }
    .ui-textfield__input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font: inherit;
      color: inherit;
      padding: 0;
      min-width: 0;
    }
    .ui-textfield__helper { font-size: 0.75rem; margin: 0; }
    .ui-textfield__helper--error { color: var(--ui-color-error, #dc2626); }
    .ui-textfield__helper--normal { color: var(--ui-tf-helper-color, #6b7280); }

    /* Size tokens */
    :host-context([data-size="xs"]) .ui-textfield__wrapper,
    [data-size="xs"] .ui-textfield__wrapper { --ui-tf-height: 1.5rem; --ui-tf-font-size: 0.75rem; --ui-tf-padding: 0 0.375rem; --ui-tf-radius: 0.25rem; }
    [data-size="sm"] .ui-textfield__wrapper { --ui-tf-height: 2rem; --ui-tf-font-size: 0.8125rem; --ui-tf-padding: 0 0.5rem; --ui-tf-radius: 0.3125rem; }
    [data-size="lg"] .ui-textfield__wrapper { --ui-tf-height: 3rem; --ui-tf-font-size: 1rem; --ui-tf-padding: 0 1rem; --ui-tf-radius: 0.5rem; }
    [data-size="xl"] .ui-textfield__wrapper { --ui-tf-height: 3.5rem; --ui-tf-font-size: 1.125rem; --ui-tf-padding: 0 1.25rem; --ui-tf-radius: 0.625rem; }

    /* Variant: filled */
    [data-variant="filled"] .ui-textfield__wrapper { background: var(--ui-tf-filled-bg, #f3f4f6); border-color: transparent; }
    /* Variant: underlined */
    [data-variant="underlined"] .ui-textfield__wrapper { border-color: transparent; border-bottom-color: var(--ui-tf-border-color, #d1d5db); border-radius: 0; }
    /* Error overrides */
    [data-error="true"] .ui-textfield__wrapper { border-color: var(--ui-color-error, #dc2626); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextField {
  readonly variant = input<'outlined' | 'filled' | 'underlined'>('outlined');
  readonly size = input<SizeVariant>('md');
  readonly label = input('');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input(false);
  readonly helperText = input('');
  readonly type = input('text');

  /** Two-way bound value */
  readonly value = model('');

  readonly inputChange = output<string>();

  protected readonly wrapperClass = computed(() => 'ui-textfield');

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.inputChange.emit(val);
  }
}
