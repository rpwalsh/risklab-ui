import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

/**
 * Skeleton — Standalone Angular component for loading placeholders.
 *
 * @example
 * ```html
 * <ui-skeleton variant="text" width="200px" animation="pulse" />
 * <ui-skeleton variant="circular" width="48px" height="48px" animation="wave" />
 * <ui-skeleton variant="rectangular" height="120px" />
 * ```
 */
@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [],
  template: `
    <span [class]="classes()" [style]="styles()" aria-hidden="true">
      @if (animation() === 'wave') {
        <span class="ui-skeleton__inner"></span>
      }
    </span>
  `,
  styles: [`
    :host { display: block; }
    .ui-skeleton {
      display: block;
      background-color: var(--ui-skeleton-bg, rgba(0,0,0,0.11));
    }
    .ui-skeleton--text {
      height: 1.2em;
      border-radius: 4px;
      width: 100%;
      transform-origin: 0 55%;
      transform: scale(1, 0.6);
    }
    .ui-skeleton--circular { border-radius: 50%; }
    .ui-skeleton--rectangular { border-radius: 0; }
    .ui-skeleton--rounded { border-radius: var(--ui-radius-md, 0.5rem); }

    .ui-skeleton--pulse { animation: ui-skeleton-pulse 2s ease-in-out 0.5s infinite; }

    .ui-skeleton--wave { overflow: hidden; position: relative; }
    .ui-skeleton__inner {
      position: absolute;
      inset: 0;
      animation: ui-skeleton-wave 2s linear 0.5s infinite;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    }

    @keyframes ui-skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes ui-skeleton-wave {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  readonly variant = input<'text' | 'circular' | 'rectangular' | 'rounded'>('text');
  readonly width = input<string | undefined>(undefined);
  readonly height = input<string | undefined>(undefined);
  readonly animation = input<'pulse' | 'wave' | 'none'>('pulse');

  protected readonly classes = computed(() => {
    const parts = ['ui-skeleton', `ui-skeleton--${this.variant()}`];
    if (this.animation() !== 'none') parts.push(`ui-skeleton--${this.animation()}`);
    return parts.join(' ');
  });

  protected readonly styles = computed(() => {
    const s: string[] = [];
    if (this.width()) s.push(`width:${this.width()}`);
    if (this.height()) s.push(`height:${this.height()}`);
    return s.join(';');
  });
}
