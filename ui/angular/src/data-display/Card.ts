import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

/**
 * Card — Standalone Angular component with content projection slots.
 *
 * @example
 * ```html
 * <ui-card variant="elevated" [interactive]="true">
 *   <div card-header>Header</div>
 *   <div card-content>Body content here</div>
 *   <div card-actions>
 *     <ui-button size="sm">Action</ui-button>
 *   </div>
 * </ui-card>
 * ```
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [],
  template: `
    <div [class]="classes()">
      <ng-content select="[card-header]" />
      <ng-content select="[card-media]" />
      <ng-content select="[card-content]" />
      <ng-content />
      <ng-content select="[card-actions]" />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ui-card {
      display: flex;
      flex-direction: column;
      border-radius: var(--ui-card-radius, 0.75rem);
      overflow: hidden;
      font-family: var(--ui-font-family, inherit);
      color: var(--ui-card-color, inherit);
      transition: box-shadow 200ms, transform 100ms;
      box-sizing: border-box;
    }
    .ui-card--elevated {
      background-color: var(--ui-card-bg, var(--ui-color-surface, #fff));
      box-shadow: var(--ui-shadow-sm, 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06));
      border: none;
    }
    .ui-card--outlined {
      background-color: var(--ui-card-bg, var(--ui-color-surface, #fff));
      box-shadow: none;
      border: 1px solid var(--ui-color-border, #e2e8f0);
    }
    .ui-card--filled {
      background-color: var(--ui-color-surface-variant, #f8fafc);
      box-shadow: none;
      border: none;
    }
    .ui-card--interactive { cursor: pointer; }
    .ui-card--interactive:hover { box-shadow: var(--ui-shadow-md); transform: translateY(-1px); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  readonly variant = input<'elevated' | 'outlined' | 'filled'>('elevated');
  readonly interactive = input(false);

  protected readonly classes = computed(() => {
    const parts = ['ui-card', `ui-card--${this.variant()}`];
    if (this.interactive()) parts.push('ui-card--interactive');
    return parts.join(' ');
  });
}
