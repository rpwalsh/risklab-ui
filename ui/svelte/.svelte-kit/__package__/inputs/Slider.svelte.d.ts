import type { SizeVariant, ColorVariant } from '../core/types.js';
type $$ComponentProps = {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    size?: SizeVariant;
    color?: ColorVariant;
    oninput?: (e: Event) => void;
};
declare const Slider: import("svelte").Component<$$ComponentProps, {}, "value">;
type Slider = ReturnType<typeof Slider>;
export default Slider;
