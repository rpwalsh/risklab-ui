import type { SizeVariant } from '../core/types.js';
type $$ComponentProps = {
    count?: number;
    page?: number;
    siblingCount?: number;
    boundaryCount?: number;
    size?: SizeVariant;
    onpage?: (page: number) => void;
};
declare const Pagination: import("svelte").Component<$$ComponentProps, {}, "page">;
type Pagination = ReturnType<typeof Pagination>;
export default Pagination;
