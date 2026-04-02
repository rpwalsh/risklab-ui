type $$ComponentProps = {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string;
    height?: string;
    animation?: 'pulse' | 'wave' | 'none';
};
declare const Skeleton: import("svelte").Component<$$ComponentProps, {}, "">;
type Skeleton = ReturnType<typeof Skeleton>;
export default Skeleton;
