import { Injectable, signal, computed, inject } from '@angular/core';
import type { ThemeMode, ThemeTokens } from '../core/types';
import { MediaQueryService } from '../utils';

/**
 * ThemeService — Injectable service managing theme state via Angular signals.
 *
 * @example
 * ```typescript
 * @Component({
 *   providers: [ThemeService],
 *   template: `<button (click)="theme.toggle()">Toggle</button>`
 * })
 * export class App {
 *   theme = inject(ThemeService);
 * }
 * ```
 */
@Injectable()
export class ThemeService {
  private readonly mq = inject(MediaQueryService);
  private readonly prefersDark = this.mq.matches('(prefers-color-scheme: dark)');
  /** Current theme mode signal */
  readonly mode = signal<ThemeMode>('light');

  /** Custom token overrides */
  readonly tokens = signal<Partial<ThemeTokens>>({});

  /** Computed: whether the current mode resolves to dark */
  readonly isDark = computed(() => {
    const m = this.mode();
    if (m === 'system') {
      return this.prefersDark();
    }
    return m === 'dark';
  });

  /** Toggle between light and dark */
  toggle(): void {
    this.mode.update(m => (m === 'dark' ? 'light' : 'dark'));
  }

  /** Set the theme mode */
  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  /** Merge custom tokens */
  setTokens(t: Partial<ThemeTokens>): void {
    this.tokens.update(prev => ({ ...prev, ...t }));
  }

  /** Apply theme CSS variables to an element */
  applyToElement(el: HTMLElement): void {
    if (this.isDark()) {
      el.classList.add('ui-dark');
      el.setAttribute('data-ui-theme', 'dark');
    } else {
      el.classList.remove('ui-dark');
      el.setAttribute('data-ui-theme', 'light');
    }
    const t = this.tokens();
    if (t.colorPrimary) el.style.setProperty('--ui-color-primary', t.colorPrimary);
    if (t.colorSecondary) el.style.setProperty('--ui-color-secondary', t.colorSecondary);
    if (t.colorSurface) el.style.setProperty('--ui-color-surface', t.colorSurface);
    if (t.colorSurfaceVariant) el.style.setProperty('--ui-color-surface-variant', t.colorSurfaceVariant);
    if (t.colorText) el.style.setProperty('--ui-color-text', t.colorText);
    if (t.colorTextSecondary) el.style.setProperty('--ui-color-text-secondary', t.colorTextSecondary);
    if (t.colorBorder) el.style.setProperty('--ui-color-border', t.colorBorder);
    if (t.fontFamily) el.style.setProperty('--ui-font-family', t.fontFamily);
  }
}
