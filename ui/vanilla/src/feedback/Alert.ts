import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-alert>` — Feedback alert banner.
 *
 * @attr {string} severity - success | info | warning | error (default: info)
 * @attr {string} variant - filled | outlined | standard (default: standard)
 * @attr {boolean} closable - Shows a close button
 *
 * @fires ui-close - Fires when close button is clicked
 */
export class UIAlert extends UIElement {
  static observedAttributes = ['severity', 'variant', 'closable'];

  protected styles(): string {
    return /* css */ `
      :host { display: block; }
      :host([hidden]) { display: none !important; }

      .alert {
        display: flex;
        align-items: flex-start;
        gap: var(--ui-space-3, 0.75rem);
        padding: var(--ui-space-3, 0.75rem) var(--ui-space-4, 1rem);
        border-radius: var(--ui-radius-md, 0.5rem);
        font-size: var(--ui-text-sm, 0.875rem);
        line-height: var(--ui-leading-normal, 1.5);
      }

      /* Standard */
      .alert.std-success { background: var(--ui-alert-success-bg, #f0fdf4); color: var(--ui-color-success, #16a34a); }
      .alert.std-info    { background: var(--ui-alert-info-bg, #eff6ff);    color: var(--ui-color-info, #2563eb); }
      .alert.std-warning { background: var(--ui-alert-warning-bg, #fffbeb); color: var(--ui-color-warning, #d97706); }
      .alert.std-error   { background: var(--ui-alert-error-bg, #fef2f2);   color: var(--ui-color-error, #dc2626); }

      /* Filled */
      .alert.fill-success { background: var(--ui-color-success, #16a34a); color: #fff; }
      .alert.fill-info    { background: var(--ui-color-info, #2563eb);    color: #fff; }
      .alert.fill-warning { background: var(--ui-color-warning, #d97706); color: #fff; }
      .alert.fill-error   { background: var(--ui-color-error, #dc2626);   color: #fff; }

      /* Outlined */
      .alert.out-success { border: 1px solid var(--ui-color-success); color: var(--ui-color-success); background: transparent; }
      .alert.out-info    { border: 1px solid var(--ui-color-info);    color: var(--ui-color-info);    background: transparent; }
      .alert.out-warning { border: 1px solid var(--ui-color-warning); color: var(--ui-color-warning); background: transparent; }
      .alert.out-error   { border: 1px solid var(--ui-color-error);   color: var(--ui-color-error);   background: transparent; }

      .icon { flex-shrink: 0; font-size: 1.25em; line-height: 1; }
      .content { flex: 1; }

      .close-btn {
        all: unset;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.15s;
        font-size: 1rem;
        line-height: 1;
        padding: 0.125rem;
      }
      .close-btn:hover { opacity: 1; }
    `;
  }

  protected template(): string {
    const severity = this.getAttr('severity', 'info');
    const variant = this.getAttr('variant', 'standard');
    const closable = this.getBoolAttr('closable');

    const icons: Record<string, string> = {
      success: '✓', info: 'ℹ', warning: '⚠', error: '✕',
    };
    const prefixMap: Record<string, string> = {
      standard: 'std', filled: 'fill', outlined: 'out',
    };
    const prefix = prefixMap[variant] || 'std';

    return `
      <div class="alert ${prefix}-${severity}" role="alert" part="alert">
        <span class="icon" aria-hidden="true">${icons[severity] || 'ℹ'}</span>
        <div class="content" part="content"><slot></slot></div>
        ${closable ? '<button class="close-btn" aria-label="Close" part="close">✕</button>' : ''}
      </div>
    `;
  }

  protected onRendered(): void {
    this.$('.close-btn')?.addEventListener('click', () => {
      this.emit('ui-close');
      this.hidden = true;
    });
  }
}

register('ui-alert', UIAlert);
