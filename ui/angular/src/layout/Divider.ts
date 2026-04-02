import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

/**
 * Divider — Standalone Angular component.
 * A horizontal or vertical separator line.
 *
 * @example
 * ```html
 * <ui-divider orientation="horizontal" />
 * ```
 */
@Component({
  selector: 'ui-divider',
  standalone: true,
  imports: [],
  template: `
    <div [class]="rootClass()" role="separator" [attr.aria-orientation]="orientation()"></div>
  `,
  styles: [`
    :host { display: block; }
    .ui-divider {
      flex-shrink: 0;
      border: none;
    }
    .ui-divider--horizontal {
      width: 100%;
      border-top-width: var(--ui-divider-thickness, 1px);
      border-top-style: solid;
      border-top-color: var(--ui-color-border, #e2e8f0);
    }
    .ui-divider--vertical {
      align-self: stretch;
      height: auto;
      min-height: 100%;
      border-left-width: var(--ui-divider-thickness, 1px);
      border-left-style: solid;
      border-left-color: var(--ui-color-border, #e2e8f0);
    }
    :host([orientation="vertical"]) {
      display: inline-block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.orientation]': 'orientation()',
    '[style.--ui-color-border]': 'color() || null',
    '[style.--ui-divider-thickness]': 'thickness() || null',
  },
})
export class Divider {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly color = input('');
  readonly thickness = input('');

  readonly rootClass = computed(() => {
    return `ui-divider ui-divider--${this.orientation()}`;
  });
}
