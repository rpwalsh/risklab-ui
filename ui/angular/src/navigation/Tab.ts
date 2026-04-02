import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

/**
 * Tab — Standalone Angular component used inside Tabs.
 * Acts as a declarative tab definition. The parent Tabs component reads
 * `value`, `label`, and `disabled` to render the tab buttons.
 *
 * @example
 * ```html
 * <ui-tab value="general" label="General" [disabled]="false"></ui-tab>
 * ```
 */
@Component({
  selector: 'ui-tab',
  standalone: true,
  imports: [],
  template: ``,
  styles: [`:host { display: none; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab {
  readonly value = input.required<string>();
  readonly label = input('');
  readonly disabled = input(false);
}
