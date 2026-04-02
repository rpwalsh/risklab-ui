import {
  ref,
  readonly,
  onMounted,
  onUnmounted,
  watch,
  type Ref,
} from 'vue';

/* ─── useMediaQuery ─── */
export function useMediaQuery(query: string | Ref<string>) {
  const matches = ref(false);
  let mql: MediaQueryList | null = null;
  let handler: ((e: MediaQueryListEvent) => void) | null = null;

  function setup(q: string) {
    cleanup();
    if (typeof window === 'undefined') return;
    mql = window.matchMedia(q);
    matches.value = mql.matches;
    handler = (e) => { matches.value = e.matches; };
    mql.addEventListener('change', handler);
  }

  function cleanup() {
    if (mql && handler) {
      mql.removeEventListener('change', handler);
      mql = null;
      handler = null;
    }
  }

  onMounted(() => {
    const q = typeof query === 'string' ? query : query.value;
    setup(q);

    if (typeof query !== 'string') {
      watch(query, (newQ) => setup(newQ));
    }
  });

  onUnmounted(cleanup);

  return readonly(matches);
}

/* ─── useClickOutside ─── */
export function useClickOutside(
  target: Ref<HTMLElement | null | undefined>,
  callback: (event: MouseEvent) => void,
) {
  function handler(e: MouseEvent) {
    const el = target.value;
    if (!el) return;
    if (el === e.target || el.contains(e.target as Node)) return;
    callback(e);
  }

  onMounted(() => {
    document.addEventListener('mousedown', handler, true);
  });

  onUnmounted(() => {
    document.removeEventListener('mousedown', handler, true);
  });
}

/* ─── useDebouncedRef ─── */
export function useDebouncedRef<T>(initialValue: T, delay = 300) {
  const value = ref(initialValue) as Ref<T>;
  const debounced = ref(initialValue) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(value, (newVal) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = newVal;
    }, delay);
  });

  onUnmounted(() => {
    if (timer) clearTimeout(timer);
  });

  return { value, debounced: readonly(debounced) };
}
