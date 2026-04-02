/**
 * @risklab/ui-solid — Utilities
 * Signal-based media query, click-outside directive, debounce.
 */

import {
  createSignal,
  onMount,
  onCleanup,
  type Accessor,
} from 'solid-js';

// ─── createMediaQuery ──────────────────────────────────────────────
/**
 * Reactive media query hook. Returns an Accessor<boolean>.
 *
 * @example
 * const isMobile = createMediaQuery('(max-width: 768px)');
 * <Show when={isMobile()}>Mobile!</Show>
 */
export function createMediaQuery(query: string): Accessor<boolean> {
  const [matches, setMatches] = createSignal(false);

  onMount(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    onCleanup(() => mq.removeEventListener('change', handler));
  });

  return matches;
}

// ─── clickOutside ──────────────────────────────────────────────────
/**
 * Solid directive for detecting clicks outside an element.
 *
 * Usage in JSX:
 * ```tsx
 * <div use:clickOutside={() => setOpen(false)}>...</div>
 * ```
 *
 * Note: You must declare `clickOutside` in scope for the directive to work.
 */
export function clickOutside(el: HTMLElement, accessor: () => () => void): void {
  const handler = (e: MouseEvent) => {
    if (!el.contains(e.target as Node)) {
      accessor()();
    }
  };

  document.addEventListener('pointerdown', handler);
  onCleanup(() => document.removeEventListener('pointerdown', handler));
}

// ─── debounce ──────────────────────────────────────────────────────
/**
 * Generic debounce utility.
 *
 * @example
 * const debouncedSearch = debounce((q: string) => search(q), 300);
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
