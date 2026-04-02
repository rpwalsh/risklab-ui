import type { Snippet } from 'svelte';
type $$ComponentProps = {
    open?: boolean;
    anchor?: 'left' | 'right' | 'top' | 'bottom';
    size?: string;
    overlay?: boolean;
    children?: Snippet;
};
declare const Drawer: import("svelte").Component<$$ComponentProps, {}, "open">;
type Drawer = ReturnType<typeof Drawer>;
export default Drawer;
