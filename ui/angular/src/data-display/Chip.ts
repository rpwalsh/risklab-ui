import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * Chip — Standalone Angular component.
 *
 * @example
 * ```html
 * <ui-chip variant="filled" color="primary" [deletable]="true" (delete)="remove()">
 *   Label
 * </ui-chip>
 * ```
 */
@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [],
  template: `
    <span [class]="classes()" [attr.data-color]="color()">
      <span class="ui-chip__label"><ng-content /></span>
      @if (deletable() && !disabled()) {
        <button type="button" class="ui-chip__delete" (click)="onDelete($event)" aria-label="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }
    .ui-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.375em;
      font-family: var(--ui-font-family, inherit);
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
      box-sizing: border-box;
      transition: background-color 150ms, color 150ms, border-color 150ms, opacity 150ms;
      user-select: none;
      max-width: 100%;
    }
    .ui-chip--xs { height: 1.25rem; padding: 0 0.375rem; font-size: 0.625rem; border-radius: 0.625rem; }
    .ui-chip--sm { height: 1.5rem; padding: 0 0.5rem; font-size: 0.75rem; border-radius: 0.75rem; }
    .ui-chip--md { height: 2rem; padding: 0 0.75rem; font-size: 0.8125rem; border-radius: 1rem; }
    .ui-chip--lg { height: 2.5rem; padding: 0 1rem; font-size: 0.875rem; border-radius: 1.25rem; }
    .ui-chip--xl { height: 3rem; padding: 0 1.25rem; font-size: 1rem; border-radius: 1.5rem; }

    .ui-chip--filled[data-color="primary"]   { background: var(--ui-color-primary); color: #fff; border: 1px solid transparent; }
    .ui-chip--filled[data-color="secondary"] { background: var(--ui-color-secondary); color: #fff; border: 1px solid transparent; }
    .ui-chip--filled[data-color="success"]   { background: var(--ui-color-success); color: #fff; border: 1px solid transparent; }
    .ui-chip--filled[data-color="warning"]   { background: var(--ui-color-warning); color: #fff; border: 1px solid transparent; }
    .ui-chip--filled[data-color="error"]     { background: var(--ui-color-error); color: #fff; border: 1px solid transparent; }
    .ui-chip--filled[data-color="info"]      { background: var(--ui-color-info); color: #fff; border: 1px solid transparent; }
    .ui-chip--filled[data-color="neutral"]   { background: var(--ui-color-neutral); color: #fff; border: 1px solid transparent; }

    .ui-chip--outlined[data-color="primary"]   { background: transparent; color: var(--ui-color-primary); border: 1px solid var(--ui-color-primary); }
    .ui-chip--outlined[data-color="secondary"] { background: transparent; color: var(--ui-color-secondary); border: 1px solid var(--ui-color-secondary); }
    .ui-chip--outlined[data-color="success"]   { background: transparent; color: var(--ui-color-success); border: 1px solid var(--ui-color-success); }
    .ui-chip--outlined[data-color="warning"]   { background: transparent; color: var(--ui-color-warning); border: 1px solid var(--ui-color-warning); }
    .ui-chip--outlined[data-color="error"]     { background: transparent; color: var(--ui-color-error); border: 1px solid var(--ui-color-error); }
    .ui-chip--outlined[data-color="info"]      { background: transparent; color: var(--ui-color-info); border: 1px solid var(--ui-color-info); }
    .ui-chip--outlined[data-color="neutral"]   { background: transparent; color: var(--ui-color-neutral); border: 1px solid var(--ui-color-neutral); }

    .ui-chip--disabled { opacity: 0.5; pointer-events: none; }
    .ui-chip__label { overflow: hidden; text-overflow: ellipsis; }
    .ui-chip__delete {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0 -0.25em 0 0;
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      opacity: 0.7;
      line-height: 1;
      border-radius: 50%;
      outline: none;
      transition: opacity 150ms;
    }
    .ui-chip__delete:hover { opacity: 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chip {
  readonly variant = input<'filled' | 'outlined'>('filled');
  readonly size = input<SizeVariant>('md');
  readonly color = input<ColorVariant>('primary');
  readonly deletable = input(false);
  readonly disabled = input(false);

  readonly delete = output<void>();

  protected readonly classes = computed(() => {
    const parts = [
      'ui-chip',
      `ui-chip--${this.variant()}`,
      `ui-chip--${this.size()}`,
    ];
    if (this.disabled()) parts.push('ui-chip--disabled');
    return parts.join(' ');
  });

  protected onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit();
  }
}
