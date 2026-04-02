import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

/**
 * Box — Standalone Angular component.
 * A generic layout primitive that maps to a configurable HTML element.
 *
 * @example
 * ```html
 * <ui-box element="section" p="16px" m="8px" display="flex" bg="#f1f5f9">
 *   Content
 * </ui-box>
 * ```
 */
@Component({
  selector: 'ui-box',
  standalone: true,
  imports: [],
  template: `
    <div
      class="ui-box"
      [style.padding]="p()"
      [style.margin]="m()"
      [style.display]="display()"
      [style.background]="bg()"
    >
      <ng-content />
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .ui-box {
      box-sizing: border-box;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Box {
  readonly element = input<string>('div');
  readonly p = input<string>('');
  readonly m = input<string>('');
  readonly display = input<string>('');
  readonly bg = input<string>('');
}
