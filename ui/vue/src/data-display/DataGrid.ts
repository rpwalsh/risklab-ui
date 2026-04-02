import { defineComponent, h, ref, computed, type PropType, type CSSProperties } from 'vue';
import type { DataGridColumn, SizeVariant } from '../core/types';

export const UiDataGrid = defineComponent({
  name: 'UiDataGrid',
  props: {
    columns: { type: Array as PropType<DataGridColumn[]>, default: () => [] },
    rows: { type: Array as PropType<Record<string, unknown>[]>, default: () => [] },
    pageSize: { type: Number, default: 0 },
    sortable: { type: Boolean, default: true },
    striped: { type: Boolean, default: false },
    bordered: { type: Boolean, default: false },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    stickyHeader: { type: Boolean, default: false },
  },
  emits: ['sort', 'page-change'],
  setup(props, { emit }) {
    const sortField = ref('');
    const sortDir = ref<'asc' | 'desc'>('asc');
    const page = ref(0);

    const sorted = computed(() => {
      const data = [...props.rows];
      if (props.sortable && sortField.value) {
        data.sort((a, b) => {
          const av = String(a[sortField.value] ?? '');
          const bv = String(b[sortField.value] ?? '');
          const cmp = av.localeCompare(bv, undefined, { numeric: true });
          return sortDir.value === 'asc' ? cmp : -cmp;
        });
      }
      return data;
    });

    const paged = computed(() => {
      if (props.pageSize <= 0) return sorted.value;
      return sorted.value.slice(page.value * props.pageSize, (page.value + 1) * props.pageSize);
    });

    const totalPages = computed(() =>
      props.pageSize > 0 ? Math.ceil(props.rows.length / props.pageSize) : 1,
    );

    const onSort = (field: string) => {
      if (sortField.value === field) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortField.value = field;
        sortDir.value = 'asc';
      }
      page.value = 0;
      emit('sort', { field: sortField.value, direction: sortDir.value });
    };

    const goToPage = (p: number) => {
      page.value = p;
      emit('page-change', p);
    };

    return () => {
      // Table classes
      const tableCls = [
        'ui-table',
        props.striped && 'ui-table--striped',
        'ui-table--hover',
      ].filter(Boolean).join(' ');

      // Header cells
      const headerCells = props.columns.map(col => {
        const canSort = props.sortable && col.sortable !== false;
        const isSorted = sortField.value === col.field;
        const thCls = [
          canSort && 'ui-table-th--sortable',
          props.stickyHeader && 'ui-table-th--sticky',
          col.align === 'right' && 'ui-table-th--right',
          col.align === 'center' && 'ui-table-th--center',
        ].filter(Boolean).join(' ');

        const sortIndicator = canSort
          ? h('span', {
              class: isSorted ? 'ui-table-sort-indicator' : 'ui-table-sort-indicator ui-table-sort-indicator--inactive',
            }, isSorted ? (sortDir.value === 'asc' ? ' ▲' : ' ▼') : ' ▲')
          : null;

        return h('th', {
          class: thCls || undefined,
          style: col.width ? { width: `${col.width}px` } as CSSProperties : undefined,
          onClick: canSort ? () => onSort(col.field) : undefined,
        }, [col.headerName, sortIndicator]);
      });

      // Body rows
      const bodyRows = paged.value.length === 0
        ? [h('tr', null, [h('td', { colspan: props.columns.length, class: 'ui-table-td--empty' }, 'No data')])]
        : paged.value.map((row, i) =>
            h('tr', {
              key: (row as Record<string, unknown>)['id'] as string ?? `${page.value}-${i}`,
              class: ['ui-table-row', props.striped && i % 2 === 1 && 'ui-table-row--striped'].filter(Boolean).join(' ') || undefined,
            },
              props.columns.map(col =>
                h('td', {
                  class: [
                    col.align === 'right' && 'ui-table-td--right',
                    col.align === 'center' && 'ui-table-td--center',
                  ].filter(Boolean).join(' ') || undefined,
                }, String(row[col.field] ?? '')),
              ),
            ),
          );

      const table = h('div', { class: 'ui-table-wrapper' }, [
        h('table', { class: tableCls, 'data-size': props.size }, [
          h('thead', null, [h('tr', null, headerCells)]),
          h('tbody', null, bodyRows),
        ]),
      ]);

      // Pagination
      let pagination: ReturnType<typeof h> | null = null;
      if (props.pageSize > 0 && totalPages.value > 1) {
        pagination = h('div', { class: 'ui-datagrid-pagination' }, [
          h('span', null, `Page ${page.value + 1} of ${totalPages.value}`),
          h('button', {
            type: 'button',
            class: 'ui-datagrid-pagination-btn',
            disabled: page.value === 0,
            onClick: () => goToPage(page.value - 1),
          }, '← Prev'),
          h('button', {
            type: 'button',
            class: 'ui-datagrid-pagination-btn',
            disabled: page.value >= totalPages.value - 1,
            onClick: () => goToPage(page.value + 1),
          }, 'Next →'),
        ]);
      }

      return h('div', {
        class: 'ui-datagrid',
        style: props.bordered ? { border: '1px solid var(--ui-table-border, #e5e7eb)' } as CSSProperties : undefined,
      }, [table, pagination]);
    };
  },
});
