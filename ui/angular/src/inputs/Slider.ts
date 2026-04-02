import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
} from '@angular/core';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * Slider — Standalone Angular component with two-way `value` binding.
 *
 * @example
 * ```html
 * <ui-slider [(value)]="volume" [min]="0" [max]="100" [step]="1" color="primary" />
 * ```
 */
@Component({
  selector: 'ui-slider',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-slider" [attr.data-size]="size()" [attr.data-color]="color()">
      <input
        type="range"
        class="ui-slider__input"
        [class.ui-slider__input--disabled]="disabled()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.aria-valuenow]="value()"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        (input)="onInput($event)"
      />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-slider { display: flex; flex-direction: column; gap: 0.25rem; font-family: inherit; position: relative; }

    .ui-slider[data-size="xs"] { --ui-slider-track-h: 2px; --ui-slider-thumb: 12px; }
    .ui-slider[data-size="sm"] { --ui-slider-track-h: 3px; --ui-slider-thumb: 14px; }
    .ui-slider[data-size="md"] { --ui-slider-track-h: 4px; --ui-slider-thumb: 16px; }
    .ui-slider[data-size="lg"] { --ui-slider-track-h: 6px; --ui-slider-thumb: 20px; }
    .ui-slider[data-size="xl"] { --ui-slider-track-h: 8px; --ui-slider-thumb: 24px; }

    .ui-slider[data-color="primary"]   { --ui-slider-color: var(--ui-color-primary, #4f46e5); }
    .ui-slider[data-color="secondary"] { --ui-slider-color: var(--ui-color-secondary, #7c3aed); }
    .ui-slider[data-color="success"]   { --ui-slider-color: var(--ui-color-success, #16a34a); }
    .ui-slider[data-color="warning"]   { --ui-slider-color: var(--ui-color-warning, #d97706); }
    .ui-slider[data-color="error"]     { --ui-slider-color: var(--ui-color-error, #dc2626); }
    .ui-slider[data-color="info"]      { --ui-slider-color: var(--ui-color-info, #2563eb); }
    .ui-slider[data-color="neutral"]   { --ui-slider-color: var(--ui-color-neutral, #64748b); }

    .ui-slider__input {
      width: 100%;
      height: var(--ui-slider-thumb, 16px);
      appearance: none;
      background: transparent;
      cursor: pointer;
      outline: none;
      margin: 0;
      padding: 0;
    }
    .ui-slider__input--disabled { opacity: 0.5; cursor: not-allowed; }

    .ui-slider__input::-webkit-slider-runnable-track {
      height: var(--ui-slider-track-h, 4px);
      background: var(--ui-color-border, #e2e8f0);
      border-radius: 9999px;
    }
    .ui-slider__input::-webkit-slider-thumb {
      appearance: none;
      width: var(--ui-slider-thumb, 16px);
      height: var(--ui-slider-thumb, 16px);
      border-radius: 50%;
      background: var(--ui-slider-color, var(--ui-color-primary));
      border: 2px solid #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,.2);
      margin-top: calc((var(--ui-slider-track-h, 4px) - var(--ui-slider-thumb, 16px)) / 2);
      cursor: pointer;
    }
    .ui-slider__input::-moz-range-track {
      height: var(--ui-slider-track-h, 4px);
      background: var(--ui-color-border, #e2e8f0);
      border-radius: 9999px;
    }
    .ui-slider__input::-moz-range-thumb {
      width: var(--ui-slider-thumb, 16px);
      height: var(--ui-slider-thumb, 16px);
      border-radius: 50%;
      background: var(--ui-slider-color, var(--ui-color-primary));
      border: 2px solid #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,.2);
      cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Slider {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false);
  readonly size = input<SizeVariant>('md');
  readonly color = input<ColorVariant>('primary');

  /** Two-way bound value */
  readonly value = model(0);

  protected onInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.value.set(val);
  }
}
