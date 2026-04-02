import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ThemeMode } from '../core/types';

/**
 * `<ui-theme-provider>` — Provides theme context via CSS custom properties.
 *
 * @slot - Default slot for all child content.
 *
 * @csspart root - The root wrapper element.
 *
 * @example
 * ```html
 * <ui-theme-provider mode="dark">
 *   <ui-button>Dark themed</ui-button>
 * </ui-theme-provider>
 * ```
 */
@customElement('ui-theme-provider')
export class UiThemeProvider extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
      color: var(--ui-color-text);
      background: var(--ui-color-surface);
      line-height: 1.5;
    }

    :host([resolved-mode='dark']) {
      --ui-color-surface: #1e293b;
      --ui-color-surface-variant: #0f172a;
      --ui-color-surface-inverse: #f8fafc;
      --ui-color-text: #f8fafc;
      --ui-color-text-secondary: #94a3b8;
      --ui-color-text-disabled: #64748b;
      --ui-color-text-inverse: #0f172a;
      --ui-color-border: #334155;
      --ui-color-border-strong: #475569;
      --ui-color-primary: #818cf8;
      --ui-color-primary-hover: #6366f1;
      --ui-color-primary-subtle: #1e1b4b;
      --ui-color-secondary: #a78bfa;
      --ui-color-secondary-subtle: #2e1065;
      --ui-color-neutral-subtle: #1e293b;
      --ui-color-success-subtle: #052e16;
      --ui-color-warning-subtle: #1c1917;
      --ui-color-error-subtle: #450a0a;
      --ui-color-info-subtle: #172554;
      --ui-alert-success-bg: #052e16;
      --ui-alert-info-bg: #172554;
      --ui-alert-warning-bg: #1c1917;
      --ui-alert-error-bg: #450a0a;
    }

    :host([resolved-mode='light']) {
      --ui-color-surface: #ffffff;
      --ui-color-surface-variant: #f8fafc;
      --ui-color-surface-inverse: #0f172a;
      --ui-color-text: #0f172a;
      --ui-color-text-secondary: #64748b;
      --ui-color-text-disabled: #94a3b8;
      --ui-color-text-inverse: #ffffff;
      --ui-color-border: #e2e8f0;
      --ui-color-border-strong: #cbd5e1;
      --ui-color-primary: #4f46e5;
      --ui-color-primary-hover: #4338ca;
      --ui-color-primary-subtle: #eef2ff;
      --ui-color-secondary: #7c3aed;
      --ui-color-secondary-subtle: #f5f3ff;
      --ui-color-neutral-subtle: #f1f5f9;
      --ui-color-success-subtle: #f0fdf4;
      --ui-color-warning-subtle: #fffbeb;
      --ui-color-error-subtle: #fef2f2;
      --ui-color-info-subtle: #eff6ff;
    }
  `;

  /** Theme mode: 'light', 'dark', or 'system'. */
  @property({ type: String, reflect: true })
  mode: ThemeMode = 'light';

  /** Resolved theme after evaluating 'system' preference. */
  @state() private _resolvedMode: 'light' | 'dark' = 'light';

  private _mediaQuery?: MediaQueryList;
  private _mediaHandler = (e: MediaQueryListEvent) => {
    if (this.mode === 'system') {
      this._applySystemTheme(e.matches);
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    this._syncResolvedMode();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._teardownSystemListener();
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has('mode')) {
      if (this.mode === 'system') {
        this._setupSystemListener();
      } else {
        this._teardownSystemListener();
        this._resolvedMode = this.mode === 'dark' ? 'dark' : 'light';
      }
      this._syncResolvedAttribute();
    }
  }

  private _syncResolvedMode(): void {
    if (this.mode === 'system') {
      this._setupSystemListener();
    } else {
      this._resolvedMode = this.mode === 'dark' ? 'dark' : 'light';
    }
    this._syncResolvedAttribute();
  }

  private _setupSystemListener(): void {
    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this._mediaQuery.addEventListener('change', this._mediaHandler);
    this._applySystemTheme(this._mediaQuery.matches);
  }

  private _teardownSystemListener(): void {
    this._mediaQuery?.removeEventListener('change', this._mediaHandler);
  }

  private _applySystemTheme(prefersDark: boolean): void {
    this._resolvedMode = prefersDark ? 'dark' : 'light';
    this._syncResolvedAttribute();
  }

  private _syncResolvedAttribute(): void {
    this.setAttribute('resolved-mode', this._resolvedMode);
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-theme-provider': UiThemeProvider;
  }
}
