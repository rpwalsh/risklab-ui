import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-theme-provider>` — Applies CSS custom property theme tokens to children.
 *
 * @attr {string} mode - light | dark (default: light)
 *
 * Wrap your app to apply the design system tokens. Tokens are set via CSS
 * custom properties that all `<ui-*>` components consume.
 *
 * @example
 * ```html
 * <ui-theme-provider mode="dark">
 *   <ui-button>I'm dark themed</ui-button>
 * </ui-theme-provider>
 * ```
 */
export class UIThemeProvider extends UIElement {
  static observedAttributes = ['mode'];

  protected styles(): string {
    return /* css */ `
      :host { display: contents; }

      :host([mode="dark"]) {
        --ui-color-surface:         #0f172a;
        --ui-color-surface-variant: #1e293b;
        --ui-color-surface-inverse: #f8fafc;
        --ui-color-text:            #f1f5f9;
        --ui-color-text-secondary:  #94a3b8;
        --ui-color-text-disabled:   #475569;
        --ui-color-text-inverse:    #0f172a;
        --ui-color-border:          #334155;
        --ui-color-border-strong:   #475569;
        --ui-color-primary:         #818cf8;
        --ui-color-primary-hover:   #6366f1;
        --ui-color-primary-subtle:  rgba(129,140,248,.12);
        --ui-color-secondary:       #a78bfa;
        --ui-color-secondary-subtle:rgba(167,139,250,.12);
        --ui-color-neutral:         #94a3b8;
        --ui-color-neutral-subtle:  rgba(148,163,184,.12);
        --ui-color-success:         #4ade80;
        --ui-color-success-subtle:  rgba(74,222,128,.12);
        --ui-color-warning:         #fbbf24;
        --ui-color-warning-subtle:  rgba(251,191,36,.12);
        --ui-color-error:           #f87171;
        --ui-color-error-subtle:    rgba(248,113,113,.12);
        --ui-color-info:            #60a5fa;
        --ui-color-info-subtle:     rgba(96,165,250,.12);
        --ui-alert-success-bg:      rgba(74,222,128,.12);
        --ui-alert-info-bg:         rgba(96,165,250,.12);
        --ui-alert-warning-bg:      rgba(251,191,36,.12);
        --ui-alert-error-bg:        rgba(248,113,113,.12);
        --ui-gray-50:  #0f172a;
        --ui-gray-100: #1e293b;
        --ui-gray-200: #334155;
        --ui-gray-300: #475569;
        --ui-gray-400: #64748b;
        --ui-gray-500: #94a3b8;
        --ui-gray-600: #cbd5e1;
        --ui-gray-700: #e2e8f0;
        --ui-gray-800: #f1f5f9;
        --ui-gray-900: #f8fafc;
      }
    `;
  }

  protected template(): string {
    return '<slot></slot>';
  }
}

register('ui-theme-provider', UIThemeProvider);
