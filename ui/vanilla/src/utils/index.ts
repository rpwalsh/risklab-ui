/**
 * Utility: Media query observer.
 *
 * ```ts
 * import { onMediaQuery } from '@risklab/ui-vanilla/utils';
 * const unsub = onMediaQuery('(max-width: 768px)', (matches) => {
 *   console.log('Mobile:', matches);
 * });
 * // Later: unsub();
 * ```
 */
export function onMediaQuery(
  query: string,
  callback: (matches: boolean) => void,
): () => void {
  const mql = window.matchMedia(query);
  const handler = (e: MediaQueryListEvent | MediaQueryList) =>
    callback(e.matches);
  handler(mql);
  mql.addEventListener('change', handler as (e: MediaQueryListEvent) => void);
  return () =>
    mql.removeEventListener(
      'change',
      handler as (e: MediaQueryListEvent) => void,
    );
}

/**
 * Utility: Debounce a function.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as unknown as T;
}

/**
 * Utility: Click-outside observer.
 * Returns a cleanup function.
 */
export function onClickOutside(
  element: HTMLElement,
  callback: () => void,
): () => void {
  const handler = (e: MouseEvent) => {
    if (!element.contains(e.target as Node)) callback();
  };
  document.addEventListener('click', handler, true);
  return () => document.removeEventListener('click', handler, true);
}
