import type { DataGridColumn } from '../core/types.js';
type $$ComponentProps = {
    columns?: DataGridColumn[];
    rows?: Record<string, unknown>[];
    pageSize?: number;
    sortable?: boolean;
    striped?: boolean;
    bordered?: boolean;
    onsort?: (field: string, dir: 'asc' | 'desc') => void;
    onpage?: (page: number) => void;
};
declare const DataGrid: import("svelte").Component<$$ComponentProps, {}, "">;
type DataGrid = ReturnType<typeof DataGrid>;
export default DataGrid;
