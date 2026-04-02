import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ToastService } from './ToastService';

/**
 * ToastContainer — Standalone Angular component that renders the toast list.
 * Place this once in your app root.
 *
 * @example
 * ```html
 * <ui-toast-container />
 * ```
 */
@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          [class]="'ui-toast ui-toast--' + toast.severity + (toast.exiting ? ' ui-toast--exiting' : ' ui-toast--entering')"
          role="alert"
        >
          <span class="ui-toast__icon">
            @switch (toast.severity) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @case ('info') { ℹ }
            }
          </span>
          <span class="ui-toast__message">{{ toast.message }}</span>
          <button type="button" class="ui-toast__close" (click)="toastService.dismiss(toast.id)" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .ui-toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: var(--ui-z-toast, 1400);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    }
    .ui-toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 288px;
      max-width: 568px;
      padding: 0.75rem 1rem;
      border-radius: var(--ui-radius-md, 0.5rem);
      box-shadow: var(--ui-shadow-lg);
      font-family: var(--ui-font-family, inherit);
      font-size: 0.875rem;
      pointer-events: auto;
    }
    .ui-toast--success { background: var(--ui-color-success, #16a34a); color: #fff; }
    .ui-toast--error   { background: var(--ui-color-error, #dc2626); color: #fff; }
    .ui-toast--warning { background: var(--ui-color-warning, #d97706); color: #fff; }
    .ui-toast--info    { background: var(--ui-color-info, #2563eb); color: #fff; }

    .ui-toast--entering { animation: ui-toast-in 200ms ease forwards; }
    .ui-toast--exiting  { animation: ui-toast-out 200ms ease forwards; }

    @keyframes ui-toast-in {
      from { opacity: 0; transform: translateY(8px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes ui-toast-out {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(-8px) scale(0.97); }
    }

    .ui-toast__icon { flex-shrink: 0; font-size: 1.125rem; }
    .ui-toast__message { flex: 1; min-width: 0; }
    .ui-toast__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.7;
      padding: 2px;
      border-radius: 50%;
    }
    .ui-toast__close:hover { opacity: 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {
  protected readonly toastService = inject(ToastService);
}
