import type { Snippet } from 'svelte';
import type { SizeVariant } from '../core/types.js';
type $$ComponentProps = {
    open?: boolean;
    modal?: boolean;
    size?: SizeVariant;
    children?: Snippet;
};
declare const Dialog: import("svelte").Component<$$ComponentProps, {}, "open">;
type Dialog = ReturnType<typeof Dialog>;
export default Dialog;
