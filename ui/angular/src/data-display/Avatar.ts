import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  signal,
} from '@angular/core';
import type { SizeVariant } from '../core/types';

/**
 * Avatar — Standalone Angular component.
 *
 * @example
 * ```html
 * <ui-avatar src="/photo.jpg" alt="Jane" size="md" variant="circular" />
 * <ui-avatar initials="JD" size="lg" variant="rounded" />
 * ```
 */
@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [],
  template: `
    <span [class]="classes()" [attr.data-size]="size()" [attr.data-color]="'primary'" [attr.data-show-image]="showImg()">
      @if (src() && !imgError()) {
        <img class="ui-avatar__img" [src]="src()" [alt]="alt()" (error)="onImgError()" />
      } @else if (initials()) {
        {{ initials() }}
      } @else {
        <svg viewBox="0 0 24 24" fill="currentColor" width="60%" height="60%">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      width: var(--ui-avatar-size, 40px);
      height: var(--ui-avatar-size, 40px);
      font-family: var(--ui-font-family, inherit);
      font-weight: 600;
      line-height: 1;
      user-select: none;
      box-sizing: border-box;
      background-color: var(--ui-color-primary-subtle, #eef2ff);
      color: var(--ui-color-primary, #4f46e5);
    }
    span[data-size="xs"] { --ui-avatar-size: 24px; font-size: 10px; }
    span[data-size="sm"] { --ui-avatar-size: 32px; font-size: 13px; }
    span[data-size="md"] { --ui-avatar-size: 40px; font-size: 16px; }
    span[data-size="lg"] { --ui-avatar-size: 48px; font-size: 19px; }
    span[data-size="xl"] { --ui-avatar-size: 64px; font-size: 26px; }

    span[data-show-image="true"] { background-color: transparent; }

    .ui-avatar--circular { border-radius: 50%; }
    .ui-avatar--rounded { border-radius: var(--ui-radius-md, 0.5rem); }
    .ui-avatar--square { border-radius: 0; }

    .ui-avatar__img { width: 100%; height: 100%; object-fit: cover; display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly src = input('');
  readonly alt = input('');
  readonly size = input<SizeVariant>('md');
  readonly variant = input<'circular' | 'rounded' | 'square'>('circular');
  readonly initials = input('');

  protected readonly imgError = signal(false);

  protected readonly showImg = computed(() => !!(this.src() && !this.imgError()));

  protected readonly classes = computed(() =>
    `ui-avatar ui-avatar--${this.variant()}`
  );

  protected onImgError(): void {
    this.imgError.set(true);
  }
}
