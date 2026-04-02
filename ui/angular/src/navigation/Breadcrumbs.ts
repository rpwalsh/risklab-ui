import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

/**
 * Breadcrumbs — Standalone Angular component.
 *
 * @example
 * ```html
 * <ui-breadcrumbs separator="/">
 *   <a href="/">Home</a>
 *   <a href="/products">Products</a>
 *   <span>Current</span>
 * </ui-breadcrumbs>
 * ```
 */
@Component({
  selector: 'ui-breadcrumbs',
  standalone: true,
  imports: [],
  template: `
    <nav class="ui-breadcrumbs" aria-label="Breadcrumb">
      <ng-content />
    </nav>
  `,
  styles: [`
    :host { display: block; }
    .ui-breadcrumbs {
      display: flex;
      align-items: center;
      font-size: var(--ui-text-sm, 0.875rem);
      color: var(--ui-color-text-secondary, #64748b);
      flex-wrap: wrap;
      gap: 0;
    }
    :host ::ng-deep > *:not(:last-child)::after {
      content: var(--ui-breadcrumb-separator, '/');
      margin-inline: var(--ui-space-2, 8px);
      user-select: none;
      color: var(--ui-color-text-secondary);
    }
    :host ::ng-deep > *:last-child {
      color: var(--ui-color-text, #0f172a);
      font-weight: 500;
    }
    :host ::ng-deep a {
      color: inherit;
      text-decoration: none;
    }
    :host ::ng-deep a:hover { text-decoration: underline; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--ui-breadcrumb-separator]': "'\"' + separator() + '\"'",
  },
})
export class Breadcrumbs {
  readonly separator = input('/');
}
