import type { Snippet } from 'svelte';
import type { ColorVariant } from '../core/types.js';
type $$ComponentProps = {
    content?: string | number;
    variant?: 'standard' | 'dot';
    color?: ColorVariant;
    max?: number;
    children?: Snippet;
};
declare const Badge: import("svelte").Component<$$ComponentProps, {}, "">;
type Badge = ReturnType<typeof Badge>;
export default Badge;
