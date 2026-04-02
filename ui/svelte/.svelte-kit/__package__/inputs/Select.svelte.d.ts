import type { SizeVariant, SelectOptionData } from '../core/types.js';
type $$ComponentProps = {
    value?: string;
    options?: SelectOptionData[];
    size?: SizeVariant;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    onchange?: (e: Event) => void;
};
declare const Select: import("svelte").Component<$$ComponentProps, {}, "value">;
type Select = ReturnType<typeof Select>;
export default Select;
