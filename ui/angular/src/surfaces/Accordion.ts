import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
} from '@angular/core';

/**
 * Accordion — Standalone Angular component.
 *
 * @example
 * ```html
 * <ui-accordion [multiple]="true">
 *   <ui-accordion-item value="one" heading="Section 1">Content 1</ui-accordion-item>
 *   <ui-accordion-item value="two" heading="Section 2">Content 2</ui-accordion-item>
 * </ui-accordion>
 * ```
 */
@Component({
  selector: 'ui-accordion',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-accordion">
      <ng-content />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-accordion {
      border: 1px solid var(--ui-color-border, #e2e8f0);
      border-radius: var(--ui-radius-lg, 12px);
      overflow: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accordion {
  readonly multiple = input(false);
  readonly value = model<string[]>([]);

  toggle(itemValue: string): void {
    const current = this.value();
    if (current.includes(itemValue)) {
      this.value.set(current.filter((v) => v !== itemValue));
    } else if (this.multiple()) {
      this.value.set([...current, itemValue]);
    } else {
      this.value.set([itemValue]);
    }
  }

  isExpanded(itemValue: string): boolean {
    return this.value().includes(itemValue);
  }
}
