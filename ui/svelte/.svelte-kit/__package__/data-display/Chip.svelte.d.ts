import type { Snippet } from 'svelte';
import type { SizeVariant, ColorVariant } from '../core/types.js';
type $$ComponentProps = {
    variant?: 'filled' | 'outlined';
    size?: SizeVariant;
    color?: ColorVariant;
    deletable?: boolean;
    disabled?: boolean;
    ondelete?: () => void;
    children?: Snippet;
};
declare const Chip: import("svelte").Component<$$ComponentProps, {}, "">;
type Chip = ReturnType<typeof Chip>;
export default Chip;
