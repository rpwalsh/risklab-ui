import type { Snippet } from 'svelte';
type $$ComponentProps = {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    gap?: string;
    align?: string;
    justify?: string;
    wrap?: boolean;
    children?: Snippet;
};
declare const Stack: import("svelte").Component<$$ComponentProps, {}, "">;
type Stack = ReturnType<typeof Stack>;
export default Stack;
