/** Create a Svelte-compatible readable store that tracks a CSS media query. */
export function mediaQuery(query: string) {
  let value = $state(false);
  let cleanup: (() => void) | undefined;

  if (typeof window !== 'undefined') {
    const mql = window.matchMedia(query);
    value = mql.matches;
    const handler = (e: MediaQueryListEvent) => { value = e.matches; };
    mql.addEventListener('change', handler);
    cleanup = () => mql.removeEventListener('change', handler);
  }

  return {
    get current() { return value; },
    destroy() {
      cleanup?.();
    },
    subscribe(fn: (v: boolean) => void) {
      fn(value);
      return $effect.root(() => {
        $effect(() => { fn(value); });
        return () => { cleanup?.(); };
      });
    },
  };
}

/** Svelte action — calls `handler` on clicks outside the node. */
export function clickOutside(node: HTMLElement, handler: () => void) {
  const onClick = (event: MouseEvent) => {
    if (!node.contains(event.target as Node)) {
      handler();
    }
  };
  document.addEventListener('click', onClick, true);
  return {
    destroy() {
      document.removeEventListener('click', onClick, true);
    },
  };
}

/** Debounce a function by `delay` ms. */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as unknown as T;
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
