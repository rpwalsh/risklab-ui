import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

/**
 * Grid — Standalone Angular component.
 * CSS Grid layout with configurable columns, rows, and gap.
 *
 * @example
 * ```html
 * <ui-grid [columns]="3" gap="16px">
 *   <div>Cell 1</div>
 *   <div>Cell 2</div>
 *   <div>Cell 3</div>
 * </ui-grid>
 * ```
 */
@Component({
  selector: 'ui-grid',
  standalone: true,
  imports: [],
  template: `
    <div
      class="ui-grid"
      [style.gridTemplateColumns]="columnsTemplate()"
      [style.gridTemplateRows]="rows()"
      [style.gap]="gap()"
    >
      <ng-content />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-grid {
      display: grid;
      box-sizing: border-box;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grid {
  readonly columns = input<number | string>(12);
  readonly rows = input<string>('');
  readonly gap = input('var(--ui-space-3, 12px)');

  columnsTemplate(): string {
    const c = this.columns();
    if (typeof c === 'number') {
      return `repeat(${c}, 1fr)`;
    }
    return c;
  }
}
