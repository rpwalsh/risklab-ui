import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
} from '@angular/core';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * Switch — Standalone Angular component with two-way `checked` binding.
 *
 * @example
 * ```html
 * <ui-switch [(checked)]="darkMode" label="Dark mode" color="primary" />
 * ```
 */
@Component({
  selector: 'ui-switch',
  standalone: true,
  imports: [],
  template: `
    <label
      class="ui-switch"
      [attr.data-size]="size()"
      [attr.data-color]="color()"
      [attr.data-disabled]="disabled()"
    >
      <span class="ui-switch__track" [attr.data-checked]="checked()">
        <span class="ui-switch__thumb" [attr.data-checked]="checked()"></span>
        <input
          type="checkbox"
          class="ui-switch__input"
          role="switch"
          [checked]="checked()"
          [disabled]="disabled()"
          [attr.aria-checked]="checked()"
          (change)="onToggle()"
        />
      </span>
      @if (label()) {
        <span class="ui-switch__text">{{ label() }}</span>
      }
    </label>
  `,
  styles: [`
    :host { display: inline-flex; }
    .ui-switch {
      display: inline-flex;
      align-items: center;
      gap: 0.5em;
      cursor: pointer;
      font-family: var(--ui-font-family, inherit);
      font-size: var(--ui-sw-font-size, 0.875rem);
      user-select: none;
    }
    .ui-switch[data-disabled="true"] { opacity: 0.5; cursor: not-allowed; }

    .ui-switch[data-size="xs"] { --ui-sw-track-w: 1.75rem; --ui-sw-track-h: 1rem;    --ui-sw-thumb: 0.75rem;   --ui-sw-font-size: 0.75rem; }
    .ui-switch[data-size="sm"] { --ui-sw-track-w: 2.25rem; --ui-sw-track-h: 1.25rem; --ui-sw-thumb: 0.9375rem; --ui-sw-font-size: 0.8125rem; }
    .ui-switch[data-size="md"] { --ui-sw-track-w: 2.75rem; --ui-sw-track-h: 1.5rem;  --ui-sw-thumb: 1.125rem;  --ui-sw-font-size: 0.875rem; }
    .ui-switch[data-size="lg"] { --ui-sw-track-w: 3.25rem; --ui-sw-track-h: 1.75rem; --ui-sw-thumb: 1.375rem;  --ui-sw-font-size: 1rem; }
    .ui-switch[data-size="xl"] { --ui-sw-track-w: 3.75rem; --ui-sw-track-h: 2rem;    --ui-sw-thumb: 1.625rem;  --ui-sw-font-size: 1.125rem; }

    .ui-switch[data-color="primary"]   { --ui-sw-active-bg: var(--ui-color-primary, #4f46e5); }
    .ui-switch[data-color="secondary"] { --ui-sw-active-bg: var(--ui-color-secondary, #7c3aed); }
    .ui-switch[data-color="success"]   { --ui-sw-active-bg: var(--ui-color-success, #16a34a); }
    .ui-switch[data-color="warning"]   { --ui-sw-active-bg: var(--ui-color-warning, #d97706); }
    .ui-switch[data-color="error"]     { --ui-sw-active-bg: var(--ui-color-error, #dc2626); }
    .ui-switch[data-color="info"]      { --ui-sw-active-bg: var(--ui-color-info, #2563eb); }
    .ui-switch[data-color="neutral"]   { --ui-sw-active-bg: var(--ui-color-neutral, #64748b); }

    .ui-switch__track {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: var(--ui-sw-track-w, 2.75rem);
      height: var(--ui-sw-track-h, 1.5rem);
      background-color: var(--ui-sw-bg, #d1d5db);
      border-radius: 9999px;
      transition: background-color 200ms;
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .ui-switch__track[data-checked="true"] { background-color: var(--ui-sw-active-bg, var(--ui-color-primary)); }

    .ui-switch__thumb {
      position: absolute;
      width: var(--ui-sw-thumb, 1.125rem);
      height: var(--ui-sw-thumb, 1.125rem);
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      transition: transform 200ms;
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
    }
    .ui-switch__thumb[data-checked="true"] {
      transform: translateY(-50%) translateX(calc(var(--ui-sw-track-w, 2.75rem) - var(--ui-sw-thumb, 1.125rem) - 4px));
    }

    .ui-switch__input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      margin: 0;
      padding: 0;
      cursor: pointer;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .ui-switch__input:disabled { cursor: not-allowed; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Switch {
  readonly disabled = input(false);
  readonly size = input<SizeVariant>('md');
  readonly color = input<ColorVariant>('primary');
  readonly label = input('');

  /** Two-way bound checked state */
  readonly checked = model(false);

  protected onToggle(): void {
    if (!this.disabled()) {
      this.checked.update(v => !v);
    }
  }
}
