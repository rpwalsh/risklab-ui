import type { SizeVariant, ColorVariant } from '../core/types.js';
type $$ComponentProps = {
    checked?: boolean;
    disabled?: boolean;
    size?: SizeVariant;
    color?: ColorVariant;
    label?: string;
    onchange?: (e: Event) => void;
};
declare const Switch: import("svelte").Component<$$ComponentProps, {}, "checked">;
type Switch = ReturnType<typeof Switch>;
export default Switch;
