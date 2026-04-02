import type { Snippet } from 'svelte';
type $$ComponentProps = {
    content?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    children?: Snippet;
};
declare const Tooltip: import("svelte").Component<$$ComponentProps, {}, "">;
type Tooltip = ReturnType<typeof Tooltip>;
export default Tooltip;
