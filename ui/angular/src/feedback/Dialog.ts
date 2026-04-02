import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  computed,
  HostListener,
} from '@angular/core';
import type { SizeVariant } from '../core/types';

/**
 * Dialog — Standalone Angular component with overlay backdrop.
 *
 * @example
 * ```html
 * <ui-dialog [(open)]="showDialog" [modal]="true" size="md" (close)="onDialogClose()">
 *   <div dialog-header>Title</div>
 *   <div dialog-body>Content here</div>
 *   <div dialog-footer>
 *     <ui-button (click)="showDialog = false">Close</ui-button>
 *   </div>
 * </ui-dialog>
 * ```
 */
@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [],
  template: `
    @if (open()) {
      <div class="ui-dialog-overlay" (click)="onBackdropClick()" role="presentation">
        <div
          [class]="dialogClass()"
          role="dialog"
          [attr.aria-modal]="modal()"
          (click)="$event.stopPropagation()"
        >
          <div class="ui-dialog__header">
            <ng-content select="[dialog-header]" />
            <button type="button" class="ui-dialog__close" (click)="onClose()" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="ui-dialog__body">
            <ng-content select="[dialog-body]" />
            <ng-content />
          </div>
          <div class="ui-dialog__footer">
            <ng-content select="[dialog-footer]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .ui-dialog-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--ui-z-modal, 1300);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.5);
      padding: 1rem;
    }
    .ui-dialog {
      background: var(--ui-color-surface, #fff);
      border-radius: var(--ui-radius-lg, 0.75rem);
      box-shadow: var(--ui-shadow-xl);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      overflow: hidden;
    }
    .ui-dialog--xs { width: 320px; }
    .ui-dialog--sm { width: 400px; }
    .ui-dialog--md { width: 560px; }
    .ui-dialog--lg { width: 720px; }
    .ui-dialog--xl { width: 900px; }

    .ui-dialog__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--ui-color-border, #e2e8f0);
      font-weight: 600;
      font-size: 1.125rem;
    }
    .ui-dialog__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      color: var(--ui-color-text-secondary);
    }
    .ui-dialog__close:hover { color: var(--ui-color-text); }
    .ui-dialog__body {
      padding: 1.25rem;
      overflow-y: auto;
      flex: 1;
    }
    .ui-dialog__footer {
      padding: 0.75rem 1.25rem;
      border-top: 1px solid var(--ui-color-border, #e2e8f0);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    .ui-dialog__footer:empty { display: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  readonly modal = input(true);
  readonly size = input<SizeVariant>('md');

  /** Two-way open state */
  readonly open = model(false);

  readonly close = output<void>();

  protected readonly dialogClass = computed(() =>
    `ui-dialog ui-dialog--${this.size()}`
  );

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    if (this.open()) {
      this.onClose();
    }
  }

  protected onBackdropClick(): void {
    if (!this.modal()) {
      this.onClose();
    }
  }

  protected onClose(): void {
    this.open.set(false);
    this.close.emit();
  }
}
