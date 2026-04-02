import type { SizeVariant } from '../core/types.js';
type $$ComponentProps = {
    value?: string;
    variant?: 'outlined' | 'filled' | 'underlined';
    size?: SizeVariant;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    error?: boolean;
    helperText?: string;
    type?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
};
declare const TextField: import("svelte").Component<$$ComponentProps, {}, "value">;
type TextField = ReturnType<typeof TextField>;
export default TextField;
