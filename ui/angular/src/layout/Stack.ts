import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

/**
 * Stack — Standalone Angular component.
 * Flexbox stack layout with configurable direction, gap, alignment.
 *
 * @example
 * ```html
 * <ui-stack direction="column" gap="12px" align="center">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </ui-stack>
 * ```
 */
@Component({
  selector: 'ui-stack',
  standalone: true,
  imports: [],
  template: `
    <div
      class="ui-stack"
      [style.flexDirection]="direction()"
      [style.gap]="gap()"
      [style.alignItems]="align()"
      [style.justifyContent]="justify()"
      [style.flexWrap]="wrap() ? 'wrap' : 'nowrap'"
    >
      <ng-content />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-stack {
      display: flex;
      box-sizing: border-box;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stack {
  readonly direction = input<'row' | 'column' | 'row-reverse' | 'column-reverse'>('column');
  readonly gap = input('var(--ui-space-3, 12px)');
  readonly align = input<string>('stretch');
  readonly justify = input<string>('flex-start');
  readonly wrap = input(false);
}
