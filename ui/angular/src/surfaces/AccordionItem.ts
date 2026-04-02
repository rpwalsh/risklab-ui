import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
} from '@angular/core';
import { Accordion } from './Accordion';

/**
 * AccordionItem — Standalone Angular component.
 * Must be placed inside a `<ui-accordion>`.
 *
 * @example
 * ```html
 * <ui-accordion-item value="section1" heading="Title">Body</ui-accordion-item>
 * ```
 */
@Component({
  selector: 'ui-accordion-item',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-accordion-item" [class.ui-accordion-item--expanded]="expanded()">
      <button
        type="button"
        class="ui-accordion-item__trigger"
        [disabled]="disabled()"
        [attr.aria-expanded]="expanded()"
        (click)="toggle()"
      >
        <span class="ui-accordion-item__heading">{{ heading() }}</span>
        <svg class="ui-accordion-item__chevron" width="16" height="16" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      @if (expanded()) {
        <div class="ui-accordion-item__panel" role="region">
          <div class="ui-accordion-item__content">
            <ng-content />
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-accordion-item + .ui-accordion-item {
      border-top: 1px solid var(--ui-color-border, #e2e8f0);
    }
    .ui-accordion-item__trigger {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding: var(--ui-space-4, 16px);
      border: none;
      background: var(--ui-color-surface, #fff);
      color: var(--ui-color-text, #0f172a);
      font-size: var(--ui-text-sm, 0.875rem);
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .ui-accordion-item__trigger:hover:not(:disabled) {
      background: var(--ui-color-gray-50, #f8fafc);
    }
    .ui-accordion-item__trigger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .ui-accordion-item__chevron {
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }
    .ui-accordion-item--expanded .ui-accordion-item__chevron {
      transform: rotate(180deg);
    }
    .ui-accordion-item__panel {
      overflow: hidden;
    }
    .ui-accordion-item__content {
      padding: 0 var(--ui-space-4, 16px) var(--ui-space-4, 16px);
      font-size: var(--ui-text-sm, 0.875rem);
      color: var(--ui-color-text-secondary, #64748b);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItem {
  private readonly accordion = inject(Accordion);

  readonly value = input.required<string>();
  readonly heading = input('');
  readonly disabled = input(false);

  expanded(): boolean {
    return this.accordion.isExpanded(this.value());
  }

  toggle(): void {
    if (!this.disabled()) {
      this.accordion.toggle(this.value());
    }
  }
}
