import type { SizeVariant, ColorVariant } from '../core/types.js';
type $$ComponentProps = {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    size?: SizeVariant;
    color?: ColorVariant;
    label?: string;
    onchange?: (e: Event) => void;
};
declare const Checkbox: import("svelte").Component<$$ComponentProps, {}, "checked">;
type Checkbox = ReturnType<typeof Checkbox>;
export default Checkbox;
