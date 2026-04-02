/**
 * @risklab/ui-lit — Utility functions.
 */

/**
 * Media query observer. Fires callback immediately and on change.
 * Returns a cleanup function.
 *
 * @example
 * ```ts
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
 * Debounce a function by `ms` milliseconds.
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
 * Click-outside observer. Fires `callback` when a click lands outside `element`.
 * Returns a cleanup function.
 *
 * @example
 * ```ts
 * const unsub = onClickOutside(menuEl, () => menuEl.hidden = true);
 * ```
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
