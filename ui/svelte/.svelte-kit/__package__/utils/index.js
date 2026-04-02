/** Create a Svelte-compatible readable store that tracks a CSS media query. */
export function mediaQuery(query) {
    let value = $state(false);
    let cleanup;
    if (typeof window !== 'undefined') {
        const mql = window.matchMedia(query);
        value = mql.matches;
        const handler = (e) => { value = e.matches; };
        mql.addEventListener('change', handler);
        cleanup = () => mql.removeEventListener('change', handler);
    }
    return {
        get current() { return value; },
        destroy() {
            cleanup?.();
        },
        subscribe(fn) {
            fn(value);
            return $effect.root(() => {
                $effect(() => { fn(value); });
                return () => { cleanup?.(); };
            });
        },
    };
}
/** Svelte action — calls `handler` on clicks outside the node. */
export function clickOutside(node, handler) {
    const onClick = (event) => {
        if (!node.contains(event.target)) {
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
export function debounce(fn, delay = 300) {
    let timer;
    return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    });
}
/** Clamp a number between min and max. */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
