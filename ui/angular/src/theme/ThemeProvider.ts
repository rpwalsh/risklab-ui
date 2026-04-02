import {
  Component,
  ChangeDetectionStrategy,
  input,
  inject,
  effect,
  ElementRef,
} from '@angular/core';
import type { ThemeMode } from '../core/types';
import { ThemeService } from './ThemeService';

/**
 * ThemeProvider — Standalone wrapper component.
 * Sets `ui-dark` class and provides ThemeService to descendants.
 *
 * @example
 * ```html
 * <ui-theme-provider mode="dark">
 *   <ui-button>Inside dark theme</ui-button>
 * </ui-theme-provider>
 * ```
 */
@Component({
  selector: 'ui-theme-provider',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-root" [class.ui-dark]="theme.isDark()">
      <ng-content />
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .ui-root {
      font-family: var(--ui-font-family);
      color: var(--ui-color-text);
      background: var(--ui-color-surface);
    }
  `],
  providers: [ThemeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeProvider {
  readonly mode = input<ThemeMode>('light');
  readonly theme = inject(ThemeService);
  private readonly elRef = inject(ElementRef);

  constructor() {
    effect(() => {
      this.theme.setMode(this.mode());
      this.theme.applyToElement(this.elRef.nativeElement);
    });
  }
}
