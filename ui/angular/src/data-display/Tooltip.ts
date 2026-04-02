import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

/**
 * Tooltip — Standalone Angular component wrapping a target element.
 *
 * @example
 * ```html
 * <ui-tooltip content="Hello!" placement="top">
 *   <button>Hover me</button>
 * </ui-tooltip>
 * ```
 */
@Component({
  selector: 'ui-tooltip',
  standalone: true,
  imports: [],
  template: `
    <span
      class="ui-tooltip-wrapper"
      (mouseenter)="show()"
      (mouseleave)="hide()"
      (focusin)="show()"
      (focusout)="hide()"
    >
      <ng-content />
      @if (visible()) {
        <span [class]="tooltipClass()" [style]="positionStyle()" role="tooltip">
          {{ content() }}
        </span>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }
    .ui-tooltip-wrapper { position: relative; display: inline-flex; }
    .ui-tooltip {
      position: absolute;
      padding: 0.375rem 0.625rem;
      font-size: 0.75rem;
      font-family: var(--ui-font-family, inherit);
      font-weight: 500;
      line-height: 1.4;
      border-radius: 0.375rem;
      white-space: nowrap;
      pointer-events: none;
      z-index: var(--ui-z-tooltip, 1500);
      box-sizing: border-box;
      background-color: var(--ui-tooltip-bg, #1f2937);
      color: var(--ui-tooltip-color, #fff);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .ui-tooltip--top    { bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 6px; }
    .ui-tooltip--bottom { top: 100%; left: 50%; transform: translateX(-50%); margin-top: 6px; }
    .ui-tooltip--left   { right: 100%; top: 50%; transform: translateY(-50%); margin-right: 6px; }
    .ui-tooltip--right  { left: 100%; top: 50%; transform: translateY(-50%); margin-left: 6px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tooltip implements OnDestroy {
  readonly content = input('');
  readonly placement = input<'top' | 'bottom' | 'left' | 'right'>('top');
  readonly delay = input(200);

  protected readonly visible = signal(false);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  protected readonly tooltipClass = computed(() =>
    `ui-tooltip ui-tooltip--${this.placement()}`
  );

  protected readonly positionStyle = computed(() => '');

  show(): void {
    this.timeoutId = setTimeout(() => this.visible.set(true), this.delay());
  }

  hide(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.visible.set(false);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}
