import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

/**
 * Paper — Standalone Angular component.
 * A surface container with elevation/variant support.
 *
 * @example
 * ```html
 * <ui-paper [elevation]="3" variant="elevation">Content</ui-paper>
 * ```
 */
@Component({
  selector: 'ui-paper',
  standalone: true,
  imports: [],
  template: `
    <div [class]="rootClass()">
      <ng-content />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-paper {
      background: var(--ui-color-surface, #fff);
      border-radius: var(--ui-radius-lg, 12px);
      color: var(--ui-color-text, #0f172a);
      transition: box-shadow 0.2s ease;
    }
    .ui-paper--outlined {
      border: 1px solid var(--ui-color-border, #e2e8f0);
    }
    .ui-paper--elevation-0 { box-shadow: none; }
    .ui-paper--elevation-1 { box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06); }
    .ui-paper--elevation-2 { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.06); }
    .ui-paper--elevation-3 { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.05); }
    .ui-paper--elevation-4 { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.04); }
    .ui-paper--elevation-5 { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); }
    .ui-paper--square { border-radius: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paper {
  readonly variant = input<'elevation' | 'outlined'>('elevation');
  readonly elevation = input<0 | 1 | 2 | 3 | 4 | 5>(1);
  readonly square = input(false);

  readonly rootClass = computed(() => {
    const classes = ['ui-paper'];
    if (this.variant() === 'outlined') {
      classes.push('ui-paper--outlined');
    } else {
      classes.push(`ui-paper--elevation-${this.elevation()}`);
    }
    if (this.square()) classes.push('ui-paper--square');
    return classes.join(' ');
  });
}
