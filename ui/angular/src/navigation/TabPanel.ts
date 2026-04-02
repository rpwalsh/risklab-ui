import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  computed,
} from '@angular/core';
import { Tabs } from './Tabs';

/**
 * TabPanel — Standalone Angular component, shown when parent Tabs selects matching value.
 *
 * @example
 * ```html
 * <ui-tab-panel value="general">Panel content here</ui-tab-panel>
 * ```
 */
@Component({
  selector: 'ui-tab-panel',
  standalone: true,
  imports: [],
  template: `
    @if (active()) {
      <div class="ui-tab-panel" role="tabpanel">
        <ng-content />
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .ui-tab-panel { padding: var(--ui-space-4, 16px); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabPanel {
  private readonly tabs = inject(Tabs);

  readonly value = input.required<string>();

  readonly active = computed(() => this.tabs.value() === this.value());
}
