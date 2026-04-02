import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * Button — Standalone Angular component.
 *
 * @example
 * ```html
 * <ui-button variant="filled" size="md" color="primary" (click)="save()">
 *   Save
 * </ui-button>
 * ```
 */
@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [class]="classes()"
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() || null"
      [attr.aria-disabled]="disabled() || loading() || null"
      (click)="onClick($event)"
    >
      @if (loading()) {
        <svg class="ui-btn__spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                  stroke-dasharray="31.4 31.4" />
        </svg>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    :host { display: inline-flex; }
    :host([fullWidth]) { display: flex; width: 100%; }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      border: none;
      cursor: pointer;
      font-family: var(--ui-font-family, inherit);
      font-weight: var(--ui-weight-medium, 500);
      line-height: 1;
      white-space: nowrap;
      transition: background-color var(--ui-transition-fast, 150ms),
                  color var(--ui-transition-fast, 150ms),
                  border-color var(--ui-transition-fast, 150ms),
                  opacity var(--ui-transition-fast, 150ms);
      outline: none;
      box-sizing: border-box;
      width: 100%;
    }

    button:focus-visible {
      outline: 2px solid var(--ui-color-primary);
      outline-offset: 2px;
    }

    /* Sizes */
    .ui-btn--xs { height: 1.5rem; padding: 0 0.5rem; font-size: var(--ui-text-xs, 0.75rem); border-radius: var(--ui-radius-sm, 0.25rem); }
    .ui-btn--sm { height: 2rem; padding: 0 0.75rem; font-size: var(--ui-text-sm, 0.875rem); border-radius: var(--ui-radius-sm, 0.25rem); }
    .ui-btn--md { height: 2.5rem; padding: 0 1rem; font-size: var(--ui-text-sm, 0.875rem); border-radius: var(--ui-radius-md, 0.5rem); }
    .ui-btn--lg { height: 3rem; padding: 0 1.5rem; font-size: var(--ui-text-base, 1rem); border-radius: var(--ui-radius-md, 0.5rem); }
    .ui-btn--xl { height: 3.5rem; padding: 0 2rem; font-size: var(--ui-text-lg, 1.125rem); border-radius: var(--ui-radius-lg, 0.75rem); }

    /* Filled */
    .ui-btn--filled { background-color: var(--_btn-bg); color: #fff; border: none; }
    .ui-btn--filled:hover:not(:disabled) { filter: brightness(0.9); }

    /* Outlined */
    .ui-btn--outlined { background: transparent; color: var(--_btn-bg); border: 1px solid var(--_btn-bg); }
    .ui-btn--outlined:hover:not(:disabled) { background: var(--_btn-bg); color: #fff; }

    /* Ghost */
    .ui-btn--ghost { background: transparent; color: var(--_btn-bg); border: none; }
    .ui-btn--ghost:hover:not(:disabled) { background: color-mix(in srgb, var(--_btn-bg) 10%, transparent); }

    /* Link */
    .ui-btn--link { background: transparent; color: var(--_btn-bg); border: none; text-decoration: underline; padding: 0; height: auto; }
    .ui-btn--link:hover:not(:disabled) { opacity: 0.8; }

    /* Colors */
    .ui-btn--primary { --_btn-bg: var(--ui-color-primary, #4f46e5); }
    .ui-btn--secondary { --_btn-bg: var(--ui-color-secondary, #7c3aed); }
    .ui-btn--success { --_btn-bg: var(--ui-color-success, #16a34a); }
    .ui-btn--warning { --_btn-bg: var(--ui-color-warning, #d97706); }
    .ui-btn--error { --_btn-bg: var(--ui-color-error, #dc2626); }
    .ui-btn--info { --_btn-bg: var(--ui-color-info, #2563eb); }
    .ui-btn--neutral { --_btn-bg: var(--ui-color-neutral, #64748b); }

    /* States */
    .ui-btn--disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
    .ui-btn--full { width: 100%; }
    .ui-btn--loading { cursor: wait; }

    .ui-btn__spinner {
      animation: ui-spin 0.75s linear infinite;
      flex-shrink: 0;
    }
    @keyframes ui-spin { to { transform: rotate(360deg); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<'filled' | 'outlined' | 'ghost' | 'link'>('filled');
  readonly size = input<SizeVariant>('md');
  readonly color = input<ColorVariant>('primary');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly fullWidth = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly btnClick = output<MouseEvent>();

  protected onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.btnClick.emit(event);
    }
  }

  protected readonly classes = computed(() => {
    const parts = [
      'ui-btn',
      `ui-btn--${this.variant()}`,
      `ui-btn--${this.size()}`,
      `ui-btn--${this.color()}`,
    ];
    if (this.fullWidth()) parts.push('ui-btn--full');
    if (this.disabled() || this.loading()) parts.push('ui-btn--disabled');
    if (this.loading()) parts.push('ui-btn--loading');
    return parts.join(' ');
  });
}
