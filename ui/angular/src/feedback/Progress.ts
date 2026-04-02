import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * Progress — Standalone Angular component supporting linear and circular variants.
 *
 * @example
 * ```html
 * <ui-progress [value]="75" type="linear" variant="determinate" color="primary" size="md" />
 * <ui-progress type="circular" variant="indeterminate" color="secondary" />
 * ```
 */
@Component({
  selector: 'ui-progress',
  standalone: true,
  imports: [],
  template: `
    @if (type() === 'linear') {
      <div class="ui-linear-progress" role="progressbar"
           [attr.aria-valuenow]="variant() === 'determinate' ? value() : null"
           [attr.aria-valuemin]="0" [attr.aria-valuemax]="100"
           [attr.data-size]="size()">
        @if (variant() === 'determinate') {
          <div class="ui-linear-progress__bar ui-linear-progress__bar--determinate" [style.width.%]="clampedValue()" [style.background-color]="colorVar()"></div>
        } @else {
          <div class="ui-linear-progress__bar ui-linear-progress__bar--indeterminate-1" [style.background-color]="colorVar()"></div>
          <div class="ui-linear-progress__bar ui-linear-progress__bar--indeterminate-2" [style.background-color]="colorVar()"></div>
        }
      </div>
    } @else {
      <svg [class]="circularClass()" viewBox="0 0 44 44" [style.width.px]="circularSize()" [style.height.px]="circularSize()">
        <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" stroke-width="4" opacity="0.15" />
        <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" stroke-width="4"
                stroke-linecap="round"
                [class]="variant() === 'determinate' ? 'ui-circular-progress__circle--determinate' : 'ui-circular-progress__circle--indeterminate'"
                [attr.stroke-dasharray]="dashArray()"
                [attr.stroke-dashoffset]="dashOffset()"
        />
      </svg>
    }
  `,
  styles: [`
    :host { display: inline-flex; }
    .ui-linear-progress {
      position: relative;
      overflow: hidden;
      display: block;
      width: 100%;
      background-color: var(--ui-progress-track-color, rgba(0,0,0,0.08));
      border-radius: 4px;
      height: 4px;
    }
    .ui-linear-progress[data-size="sm"] { height: 2px; }
    .ui-linear-progress[data-size="md"] { height: 4px; }
    .ui-linear-progress[data-size="lg"] { height: 8px; }

    .ui-linear-progress__bar {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      border-radius: inherit;
    }
    .ui-linear-progress__bar--determinate { transition: width 0.4s linear; }
    .ui-linear-progress__bar--indeterminate-1 {
      width: auto;
      animation: ui-linear-ind-1 2.1s cubic-bezier(0.65,0.815,0.735,0.395) infinite;
    }
    .ui-linear-progress__bar--indeterminate-2 {
      width: auto;
      animation: ui-linear-ind-2 2.1s cubic-bezier(0.165,0.84,0.44,1) 1.15s infinite;
    }

    @keyframes ui-linear-ind-1 {
      0%  { left: -35%; right: 100%; }
      60% { left: 100%; right: -90%; }
      100%{ left: 100%; right: -90%; }
    }
    @keyframes ui-linear-ind-2 {
      0%  { left: -200%; right: 100%; }
      60% { left: 107%; right: -8%; }
      100%{ left: 107%; right: -8%; }
    }

    .ui-circular-progress { display: inline-block; color: var(--ui-color-primary, #4f46e5); }
    .ui-circular-progress--indeterminate { animation: ui-circ-rotate 1.4s linear infinite; }

    .ui-circular-progress__circle--determinate { transition: stroke-dashoffset 0.3s ease; }
    .ui-circular-progress__circle--indeterminate { animation: ui-circ-dash 1.4s ease-in-out infinite; }

    @keyframes ui-circ-rotate { to { transform: rotate(360deg); } }
    @keyframes ui-circ-dash {
      0%  { stroke-dasharray: 1,200; stroke-dashoffset: 0; }
      50% { stroke-dasharray: 89,200; stroke-dashoffset: -35; }
      100%{ stroke-dasharray: 89,200; stroke-dashoffset: -124; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Progress {
  readonly value = input(0);
  readonly variant = input<'determinate' | 'indeterminate'>('determinate');
  readonly type = input<'linear' | 'circular'>('linear');
  readonly size = input<SizeVariant>('md');
  readonly color = input<ColorVariant>('primary');

  private readonly circumference = 2 * Math.PI * 18; // r=18

  protected readonly clampedValue = computed(() =>
    Math.min(100, Math.max(0, this.value()))
  );

  protected readonly colorVar = computed(() => {
    const map: Record<string, string> = {
      primary: 'var(--ui-color-primary, #4f46e5)',
      secondary: 'var(--ui-color-secondary, #7c3aed)',
      success: 'var(--ui-color-success, #16a34a)',
      warning: 'var(--ui-color-warning, #d97706)',
      error: 'var(--ui-color-error, #dc2626)',
      info: 'var(--ui-color-info, #2563eb)',
      neutral: 'var(--ui-color-neutral, #64748b)',
    };
    return map[this.color()] ?? map['primary'];
  });

  protected readonly circularSize = computed(() => {
    const map: Record<string, number> = { xs: 20, sm: 28, md: 40, lg: 52, xl: 64 };
    return map[this.size()] ?? 40;
  });

  protected readonly circularClass = computed(() =>
    `ui-circular-progress${this.variant() === 'indeterminate' ? ' ui-circular-progress--indeterminate' : ''}`
  );

  protected readonly dashArray = computed(() => `${this.circumference} ${this.circumference}`);

  protected readonly dashOffset = computed(() => {
    if (this.variant() === 'indeterminate') return 0;
    return this.circumference - (this.clampedValue() / 100) * this.circumference;
  });
}
