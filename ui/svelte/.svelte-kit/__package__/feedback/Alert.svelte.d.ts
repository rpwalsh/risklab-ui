import type { Snippet } from 'svelte';
type $$ComponentProps = {
    severity?: 'success' | 'info' | 'warning' | 'error';
    variant?: 'filled' | 'outlined' | 'standard';
    closable?: boolean;
    visible?: boolean;
    onclose?: () => void;
    children?: Snippet;
};
declare const Alert: import("svelte").Component<$$ComponentProps, {}, "visible">;
type Alert = ReturnType<typeof Alert>;
export default Alert;
