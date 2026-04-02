import type { Snippet } from 'svelte';
type $$ComponentProps = {
    variant?: 'elevated' | 'outlined' | 'filled';
    interactive?: boolean;
    onclick?: (e: MouseEvent) => void;
    header?: Snippet;
    children?: Snippet;
    footer?: Snippet;
};
declare const Card: import("svelte").Component<$$ComponentProps, {}, "">;
type Card = ReturnType<typeof Card>;
export default Card;
