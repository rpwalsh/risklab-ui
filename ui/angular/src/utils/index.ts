import {
  Injectable,
  signal,
  effect,
  DestroyRef,
  inject,
  Directive,
  ElementRef,
  output,
} from '@angular/core';

/* ------------------------------------------------------------------ */
/*  MediaQueryService                                                 */
/* ------------------------------------------------------------------ */

/**
 * MediaQueryService — Injectable Angular service.
 * Returns a reactive signal that tracks a CSS media query.
 *
 * @example
 * ```ts
 * const mq = inject(MediaQueryService);
 * const isMobile = mq.matches('(max-width: 768px)');
 * effect(() => console.log('mobile?', isMobile()));
 * ```
 */
@Injectable({ providedIn: 'root' })
export class MediaQueryService {
  private readonly cache = new Map<string, ReturnType<typeof signal<boolean>>>();

  matches(query: string) {
    const existing = this.cache.get(query);
    if (existing) return existing.asReadonly();

    if (typeof window === 'undefined') {
      const sig = signal(false);
      this.cache.set(query, sig);
      return sig.asReadonly();
    }

    const mql = window.matchMedia(query);
    const sig = signal(mql.matches);

    const handler = (e: MediaQueryListEvent) => sig.set(e.matches);
    mql.addEventListener('change', handler);

    this.cache.set(query, sig);
    return sig.asReadonly();
  }
}

/* ------------------------------------------------------------------ */
/*  ClickOutsideDirective                                             */
/* ------------------------------------------------------------------ */

/**
 * ClickOutsideDirective — Standalone Angular directive.
 * Emits when a click occurs outside the host element.
 *
 * @example
 * ```html
 * <div (uiClickOutside)="close()">Dropdown</div>
 * ```
 */
@Directive({
  selector: '[uiClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly uiClickOutside = output<MouseEvent>();

  private listener = (event: MouseEvent) => {
    const target = event.target as Node;
    if (target && !this.el.nativeElement.contains(target)) {
      this.uiClickOutside.emit(event);
    }
  };

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this.listener, true);
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('click', this.listener, true);
      });
    }
  }
}
