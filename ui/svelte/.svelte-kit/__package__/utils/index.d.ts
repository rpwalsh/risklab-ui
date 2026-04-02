/** Create a Svelte-compatible readable store that tracks a CSS media query. */
export declare function mediaQuery(query: string): {
    readonly current: boolean;
    destroy(): void;
    subscribe(fn: (v: boolean) => void): () => void;
};
/** Svelte action — calls `handler` on clicks outside the node. */
export declare function clickOutside(node: HTMLElement, handler: () => void): {
    destroy(): void;
};
/** Debounce a function by `delay` ms. */
export declare function debounce<T extends (...args: any[]) => void>(fn: T, delay?: number): T;
/** Clamp a number between min and max. */
export declare function clamp(value: number, min: number, max: number): number;
