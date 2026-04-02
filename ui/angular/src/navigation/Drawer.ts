import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  computed,
} from '@angular/core';

/**
 * Drawer — Standalone Angular component with slide animation.
 *
 * @example
 * ```html
 * <ui-drawer [(open)]="menuOpen" anchor="left" size="280px" [overlay]="true">
 *   <nav>Drawer content</nav>
 * </ui-drawer>
 * ```
 */
@Component({
  selector: 'ui-drawer',
  standalone: true,
  imports: [],
  template: `
    <div class="ui-drawer-container" [attr.data-open]="open()">
      @if (overlay()) {
        <div class="ui-drawer-backdrop" (click)="onClose()"></div>
      }
      <div [class]="drawerClass()" [attr.data-open]="open()" [style]="sizeStyle()">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .ui-drawer-container {
      position: fixed;
      inset: 0;
      z-index: var(--ui-z-drawer, 1200);
      pointer-events: none;
    }
    .ui-drawer-container[data-open="true"] { pointer-events: auto; }
    .ui-drawer-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      opacity: 0;
      transition: opacity var(--ui-transition-base, 250ms);
    }
    .ui-drawer-container[data-open="true"] .ui-drawer-backdrop { opacity: 1; }

    .ui-drawer {
      position: fixed;
      background: var(--ui-color-surface, #fff);
      box-shadow: var(--ui-shadow-xl);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      transition: transform var(--ui-transition-base, 250ms);
      z-index: 1;
    }
    .ui-drawer--left   { top: 0; left: 0; bottom: 0; transform: translateX(-100%); }
    .ui-drawer--right  { top: 0; right: 0; bottom: 0; transform: translateX(100%); }
    .ui-drawer--top    { top: 0; left: 0; right: 0; transform: translateY(-100%); }
    .ui-drawer--bottom { bottom: 0; left: 0; right: 0; transform: translateY(100%); }

    .ui-drawer--left[data-open="true"],
    .ui-drawer--right[data-open="true"] { transform: translateX(0); }
    .ui-drawer--top[data-open="true"],
    .ui-drawer--bottom[data-open="true"] { transform: translateY(0); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer {
  readonly anchor = input<'left' | 'right' | 'top' | 'bottom'>('left');
  readonly size = input('280px');
  readonly overlay = input(true);

  /** Two-way open state */
  readonly open = model(false);

  readonly close = output<void>();

  protected readonly drawerClass = computed(() =>
    `ui-drawer ui-drawer--${this.anchor()}`
  );

  protected readonly sizeStyle = computed(() => {
    const a = this.anchor();
    if (a === 'left' || a === 'right') return `width:${this.size()}`;
    return `height:${this.size()}`;
  });

  protected onClose(): void {
    this.open.set(false);
    this.close.emit();
  }
}
