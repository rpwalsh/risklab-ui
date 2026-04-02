import type { Snippet } from 'svelte';
import type { SizeVariant, ColorVariant } from '../core/types.js';
type $$ComponentProps = {
    variant?: 'filled' | 'outlined' | 'ghost' | 'link';
    size?: SizeVariant;
    color?: ColorVariant;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
};
declare const Button: import("svelte").Component<$$ComponentProps, {}, "">;
type Button = ReturnType<typeof Button>;
export default Button;
