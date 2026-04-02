import {
  Component,
  ChangeDetectionStrategy,
  model,
  contentChildren,
} from '@angular/core';
import { Tab } from './Tab';

/**
 * Tabs — Standalone Angular component managing tab selection.
 *
 * @example
 * ```html
 * <ui-tabs [(value)]="activeTab">
 *   <ui-tab value="general">General</ui-tab>
 *   <ui-tab value="security">Security</ui-tab>
 *
 *   <ui-tab-panel value="general">General content</ui-tab-panel>
 *   <ui-tab-panel value="security">Security content</ui-tab-panel>
 * </ui-tabs>
 * ```
 */
@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-tabs ui-tabs--horizontal">
      <div class="ui-tab-list" role="tablist" aria-orientation="horizontal" data-variant="line">
        @for (tab of tabs(); track tab.value()) {
          <button
            type="button"
            class="ui-tab ui-tab--md"
            role="tab"
            [attr.aria-selected]="tab.value() === value()"
            [disabled]="tab.disabled()"
            (click)="selectTab(tab.value())"
          >
            {{ tab.label() }}
          </button>
        }
      </div>
      <div class="ui-tab-panels">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-tabs { display: flex; flex-direction: column; }
    .ui-tab-list {
      display: flex;
      gap: var(--ui-space-1, 4px);
      border-bottom: 2px solid var(--ui-color-border, #e2e8f0);
    }
    .ui-tab {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      border: none;
      background: none;
      cursor: pointer;
      white-space: nowrap;
      outline: none;
      transition: all 150ms;
      color: var(--ui-color-text-secondary, #64748b);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      padding: 8px 16px;
      font-size: var(--ui-text-sm, 0.875rem);
    }
    .ui-tab[aria-selected="true"] {
      border-bottom-color: var(--ui-color-primary, #4f46e5);
      color: var(--ui-color-primary, #4f46e5);
    }
    .ui-tab:disabled { opacity: 0.5; cursor: not-allowed; }
    .ui-tab:hover:not(:disabled):not([aria-selected="true"]) {
      color: var(--ui-color-text);
    }
    .ui-tab-panel { padding: var(--ui-space-4, 16px); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs {
  /** Two-way bound active tab value */
  readonly value = model('');

  readonly tabs = contentChildren(Tab);

  protected selectTab(tabValue: string): void {
    this.value.set(tabValue);
  }
}
