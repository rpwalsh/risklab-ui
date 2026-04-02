import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  computed,
} from '@angular/core';

/**
 * Alert — Standalone Angular component.
 *
 * @example
 * ```html
 * <ui-alert severity="success" variant="standard" [closable]="true" (close)="dismiss()">
 *   Saved successfully!
 * </ui-alert>
 * ```
 */
@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [],
  template: `
    @if (visible()) {
      <div [class]="classes()" role="alert" [attr.data-variant]="variant()" [attr.data-severity]="severity()">
        <span class="ui-alert__icon">
          @switch (severity()) {
            @case ('success') { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> }
            @case ('error') { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> }
            @case ('warning') { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
            @case ('info') { <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> }
          }
        </span>
        <div class="ui-alert__content">
          <ng-content />
        </div>
        @if (closable()) {
          <button type="button" class="ui-alert__close" (click)="onClose()" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .ui-alert {
      display: flex;
      align-items: flex-start;
      padding: 12px 16px;
      border-radius: var(--ui-radius-sm, 0.25rem);
      font-family: var(--ui-font-family, inherit);
      font-size: 0.875rem;
      line-height: 1.43;
      gap: 12px;
    }
    .ui-alert[data-variant="standard"][data-severity="success"] { background: var(--ui-alert-success-bg, #f0fdf4); color: #2e7d32; }
    .ui-alert[data-variant="standard"][data-severity="info"]    { background: var(--ui-alert-info-bg, #eff6ff); color: #0288d1; }
    .ui-alert[data-variant="standard"][data-severity="warning"] { background: var(--ui-alert-warning-bg, #fffbeb); color: #ed6c02; }
    .ui-alert[data-variant="standard"][data-severity="error"]   { background: var(--ui-alert-error-bg, #fef2f2); color: #d32f2f; }

    .ui-alert[data-variant="outlined"][data-severity="success"] { background: transparent; border: 1px solid #2e7d32; color: #2e7d32; }
    .ui-alert[data-variant="outlined"][data-severity="info"]    { background: transparent; border: 1px solid #0288d1; color: #0288d1; }
    .ui-alert[data-variant="outlined"][data-severity="warning"] { background: transparent; border: 1px solid #ed6c02; color: #ed6c02; }
    .ui-alert[data-variant="outlined"][data-severity="error"]   { background: transparent; border: 1px solid #d32f2f; color: #d32f2f; }

    .ui-alert[data-variant="filled"][data-severity="success"] { background: #2e7d32; color: #fff; }
    .ui-alert[data-variant="filled"][data-severity="info"]    { background: #0288d1; color: #fff; }
    .ui-alert[data-variant="filled"][data-severity="warning"] { background: #ed6c02; color: #fff; }
    .ui-alert[data-variant="filled"][data-severity="error"]   { background: #d32f2f; color: #fff; }

    .ui-alert__icon { display: flex; align-items: center; flex-shrink: 0; margin-top: 2px; }
    .ui-alert__content { flex: 1; min-width: 0; }
    .ui-alert__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      color: inherit;
      opacity: 0.7;
    }
    .ui-alert__close:hover { opacity: 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
  readonly severity = input<'success' | 'info' | 'warning' | 'error'>('info');
  readonly variant = input<'filled' | 'outlined' | 'standard'>('standard');
  readonly closable = input(false);

  /** Two-way visible state */
  readonly visible = model(true);

  readonly close = output<void>();

  protected readonly classes = computed(() => 'ui-alert');

  protected onClose(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
