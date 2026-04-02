import type { SizeVariant, ColorVariant } from '../core/types.js';
type $$ComponentProps = {
    value?: number;
    variant?: 'determinate' | 'indeterminate';
    type?: 'linear' | 'circular';
    size?: SizeVariant;
    color?: ColorVariant;
};
declare const Progress: import("svelte").Component<$$ComponentProps, {}, "">;
type Progress = ReturnType<typeof Progress>;
export default Progress;
