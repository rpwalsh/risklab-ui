import {
  computed,
  defineComponent,
  h,
  ref,
  type CSSProperties,
  type PropType,
  type VNodeChild,
} from 'vue';
import {
  useWorkbench,
  useWorkbenchOptional,
  type TimeWindow,
  type WorkbenchFilterValue,
  type WorkbenchPanelState,
  type WorkbenchSelection,
} from './state';
import {
  createWorkbenchThemeVars,
  resolveWorkbenchTheme,
  type WorkbenchThemeTokens,
  type WorkbenchTone,
} from './theme';

export interface WorkbenchShellProps {
  tone?: WorkbenchTone;
  theme?: Partial<WorkbenchThemeTokens>;
}

export interface PanelLayoutProps {
  columns?: string;
  rows?: string;
  minColumnWidth?: number;
  dense?: boolean;
}

export interface WorkbenchPanelProps {
  panelId?: string;
  title: string;
  subtitle?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  padding?: 'none' | 'sm' | 'md';
  tone?: 'default' | 'positive' | 'warning' | 'danger';
}

export interface FilterOption {
  label: string;
  value: WorkbenchFilterValue;
}

export interface FilterDefinition {
  key: string;
  label: string;
  options: FilterOption[];
  multi?: boolean;
  scope?: 'global' | 'panel';
  panelId?: string;
}

export interface FilterBarProps {
  filters: FilterDefinition[];
}

export interface QueryBarProps {
  label?: string;
  placeholder?: string;
}

export interface TimeRangeOption {
  label: string;
  value: TimeWindow;
}

export interface TimeRangeControlProps {
  options?: TimeRangeOption[];
}

export interface EntityInspectorProps {
  title?: string;
  emptyState?: string;
  renderContent?: (selection: WorkbenchSelection | null) => VNodeChild | string | null | undefined;
}

const defaultTimeRanges: TimeRangeOption[] = [
  { label: '1h', value: { preset: '1h', label: 'Last hour' } },
  { label: '24h', value: { preset: '24h', label: 'Last 24 hours' } },
  { label: '7d', value: { preset: '7d', label: 'Last 7 days' } },
  { label: '30d', value: { preset: '30d', label: 'Last 30 days' } },
];

function cx(...values: Array<string | false | null | undefined>): string[] {
  return values.filter(Boolean) as string[];
}

function filterValueIncludes(
  current: WorkbenchFilterValue | undefined,
  expected: WorkbenchFilterValue,
): boolean {
  if (Array.isArray(current) && !Array.isArray(expected)) {
    return current.includes(expected);
  }

  if (Array.isArray(current) && Array.isArray(expected)) {
    return current.length === expected.length && current.every((value, index) => value === expected[index]);
  }

  return current === expected;
}

function toggleFilterValue(
  current: WorkbenchFilterValue | undefined,
  next: WorkbenchFilterValue,
  multi: boolean,
): WorkbenchFilterValue | undefined {
  if (!multi) {
    return filterValueIncludes(current, next) ? undefined : next;
  }

  const nextValue = Array.isArray(next) ? next[0] : next;
  const currentValues = Array.isArray(current)
    ? [...current]
    : current === undefined
      ? []
      : [current];
  const index = currentValues.findIndex((value) => value === nextValue);

  if (index >= 0) {
    currentValues.splice(index, 1);
  } else {
    currentValues.push(nextValue);
  }

  return currentValues.length > 0 ? currentValues : undefined;
}

function timeWindowsEqual(
  left: TimeWindow | null | undefined,
  right: TimeWindow | null | undefined,
): boolean {
  if (!left && !right) {
    return true;
  }
  if (!left || !right) {
    return false;
  }
  return left.preset === right.preset
    && left.from === right.from
    && left.to === right.to
    && left.timezone === right.timezone
    && left.label === right.label;
}

function renderSelection(selection: WorkbenchSelection | null): VNodeChild {
  if (!selection) {
    return null;
  }

  const rows = [
    ['Panel', selection.panelId ?? ''],
    ['Entity', selection.entityId ?? ''],
    ['Series', selection.seriesId ?? ''],
    ['Point', selection.pointId ?? ''],
    ['Label', selection.label ?? ''],
  ].filter(([, value]) => value.trim().length > 0) as Array<[string, string]>;

  for (const [key, value] of Object.entries(selection.meta ?? {})) {
    rows.push([key, typeof value === 'object' ? JSON.stringify(value) : String(value)]);
  }

  return h(
    'dl',
    { class: 'rlwb-selection-list' },
    rows.flatMap(([label, value]) => [h('dt', label), h('dd', value)]),
  );
}

export const WorkbenchShell = defineComponent({
  name: 'WorkbenchShell',
  inheritAttrs: false,
  props: {
    tone: { type: String as PropType<WorkbenchTone>, default: 'dark' },
    theme: {
      type: Object as PropType<Partial<WorkbenchThemeTokens>>,
      default: () => ({}),
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const nav = slots.nav?.();
      const topbar = slots.topbar?.();
      const inspector = slots.inspector?.();
      const status = slots.status?.();
      const themeStyle = createWorkbenchThemeVars(resolveWorkbenchTheme(props.tone, props.theme));

      return h(
        'div',
        {
          ...attrs,
          'data-rl-workbench': '',
          class: cx(
            'rlwb-shell',
            Boolean(nav?.length) && 'rlwb-shell--has-nav',
            Boolean(inspector?.length) && 'rlwb-shell--has-inspector',
            attrs.class as string | undefined,
          ),
          style: { ...themeStyle, ...(attrs.style as CSSProperties | undefined) },
        },
        [
          nav?.length
            ? h('aside', { class: 'rlwb-shell__nav' }, nav)
            : null,
          h('div', { class: 'rlwb-shell__frame' }, [
            topbar?.length
              ? h('header', { class: 'rlwb-shell__topbar' }, topbar)
              : null,
            h('div', { class: 'rlwb-shell__body' }, [
              h('main', { class: 'rlwb-shell__workspace' }, slots.default?.()),
              inspector?.length
                ? h('aside', { class: 'rlwb-shell__inspector' }, inspector)
                : null,
            ]),
            status?.length
              ? h('footer', { class: 'rlwb-shell__status' }, status)
              : null,
          ]),
        ],
      );
    };
  },
});

export const PanelLayout = defineComponent({
  name: 'PanelLayout',
  inheritAttrs: false,
  props: {
    columns: { type: String, default: undefined },
    rows: { type: String, default: undefined },
    minColumnWidth: { type: Number, default: undefined },
    dense: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const templateColumns = props.minColumnWidth
        ? `repeat(auto-fit, minmax(${props.minColumnWidth}px, 1fr))`
        : props.columns ?? 'repeat(auto-fit, minmax(320px, 1fr))';

      return h(
        'div',
        {
          ...attrs,
          class: cx('rlwb-panel-layout', props.dense && 'rlwb-panel-layout--dense', attrs.class as string | undefined),
          style: {
            'grid-template-columns': templateColumns,
            'grid-template-rows': props.rows,
            ...(attrs.style as CSSProperties | undefined),
          },
        },
        slots.default?.(),
      );
    };
  },
});

export const WorkbenchPanel = defineComponent({
  name: 'WorkbenchPanel',
  inheritAttrs: false,
  props: {
    panelId: { type: String, default: undefined },
    title: { type: String, required: true },
    subtitle: { type: String, default: undefined },
    collapsible: { type: Boolean, default: false },
    defaultCollapsed: { type: Boolean, default: false },
    padding: { type: String as PropType<'none' | 'sm' | 'md'>, default: 'md' },
    tone: { type: String as PropType<'default' | 'positive' | 'warning' | 'danger'>, default: 'default' },
  },
  setup(props, { attrs, slots }) {
    const workbench = useWorkbenchOptional();
    const localCollapsed = ref(props.defaultCollapsed);

    const panelState = computed<WorkbenchPanelState>(() => (
      props.panelId && workbench
        ? (workbench.state.value.panels[props.panelId] ?? {})
        : { collapsed: localCollapsed.value }
    ));

    const collapsed = computed(() => Boolean(panelState.value.collapsed ?? localCollapsed.value));

    const toggle = () => {
      const nextValue = !collapsed.value;
      if (props.panelId && workbench) {
        workbench.actions.patchPanelState(props.panelId, { collapsed: nextValue });
      } else {
        localCollapsed.value = nextValue;
      }
    };

    return () => h(
      'section',
      {
        ...attrs,
        class: cx(
          'rlwb-panel',
          collapsed.value && 'rlwb-panel--collapsed',
          `rlwb-panel--padding-${props.padding}`,
          props.tone !== 'default' && `rlwb-panel--tone-${props.tone}`,
          attrs.class as string | undefined,
        ),
      },
      [
        h('header', { class: 'rlwb-panel__header' }, [
          h('div', { class: 'rlwb-panel__titles' }, [
            h('div', { class: 'rlwb-panel__title' }, props.title),
            props.subtitle ? h('div', { class: 'rlwb-panel__subtitle' }, props.subtitle) : null,
          ]),
          h('div', { class: 'rlwb-panel__actions' }, [
            slots.actions?.(),
            props.collapsible
              ? h('button', { type: 'button', class: 'rlwb-icon-button', onClick: toggle }, '⌄')
              : null,
          ]),
        ]),
        !collapsed.value
          ? h('div', { class: 'rlwb-panel__body' }, slots.default?.())
          : null,
        slots.footer?.()
          ? h('footer', { class: 'rlwb-panel__footer' }, slots.footer())
          : null,
      ],
    );
  },
});

export const QueryBar = defineComponent({
  name: 'QueryBar',
  props: {
    label: { type: String, default: 'Query' },
    placeholder: { type: String, default: 'Search, scope, or command' },
  },
  setup(props) {
    const { state, actions } = useWorkbench();
    return () => h('label', { class: 'rlwb-query-bar' }, [
      h('span', { class: 'rlwb-query-label' }, props.label),
      h('input', {
        class: 'rlwb-query-input',
        type: 'search',
        value: state.value.query,
        placeholder: props.placeholder,
        onInput: (event: Event) => {
          actions.setQuery((event.currentTarget as HTMLInputElement).value);
        },
      }),
    ]);
  },
});

export const FilterBar = defineComponent({
  name: 'FilterBar',
  props: {
    filters: {
      type: Array as PropType<FilterDefinition[]>,
      required: true,
    },
  },
  setup(props) {
    const { state, actions } = useWorkbench();

    return () => h(
      'div',
      { class: 'rlwb-filter-bar' },
      props.filters.map((filter) => {
        const currentValue = filter.scope === 'panel'
          ? state.value.panels[filter.panelId ?? '']?.filters?.[filter.key]
          : state.value.filters[filter.key];

        return h('div', { class: 'rlwb-filter-group' }, [
          h('span', { class: 'rlwb-filter-group__label' }, filter.label),
          h(
            'div',
            { class: 'rlwb-filter-group__options' },
            filter.options.map((option) => h(
              'button',
              {
                type: 'button',
                class: 'rlwb-filter-chip',
                'aria-pressed': filterValueIncludes(currentValue, option.value),
                onClick: () => {
                  const nextValue = toggleFilterValue(currentValue, option.value, Boolean(filter.multi));
                  if (filter.scope === 'panel' && filter.panelId) {
                    actions.setPanelFilter(filter.panelId, filter.key, nextValue);
                  } else {
                    actions.setFilter(filter.key, nextValue);
                  }
                },
              },
              option.label,
            )),
          ),
        ]);
      }),
    );
  },
});

export const TimeRangeControl = defineComponent({
  name: 'TimeRangeControl',
  props: {
    options: {
      type: Array as PropType<TimeRangeOption[]>,
      default: () => defaultTimeRanges,
    },
  },
  setup(props) {
    const { state, actions } = useWorkbench();
    return () => h(
      'div',
      { class: 'rlwb-time-range' },
      props.options.map((option) => h(
        'button',
        {
          type: 'button',
          class: 'rlwb-filter-chip',
          'aria-pressed': timeWindowsEqual(state.value.timeWindow, option.value),
          onClick: () => actions.setTimeWindow(option.value),
        },
        option.label,
      )),
    );
  },
});

export const EntityInspector = defineComponent({
  name: 'EntityInspector',
  props: {
    title: { type: String, default: 'Inspector' },
    emptyState: {
      type: String,
      default: 'Select a record, point, or entity to inspect it here.',
    },
    renderContent: {
      type: Function as PropType<(selection: WorkbenchSelection | null) => VNodeChild | string | null | undefined>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const workbench = useWorkbenchOptional();
    const selection = computed(() => workbench?.state.value.selection ?? null);

    return () => {
      const rendered = props.renderContent?.(selection.value);
      const body = typeof rendered === 'string'
        ? h('div', { innerHTML: rendered })
        : rendered ?? renderSelection(selection.value) ?? h('div', { class: 'rlwb-empty-state' }, props.emptyState);

      return h('section', { class: 'rlwb-inspector' }, [
        h('header', { class: 'rlwb-inspector__header' }, [
          h('div', { class: 'rlwb-panel__titles' }, [
            h('div', { class: 'rlwb-panel__title' }, props.title),
          ]),
          slots.actions?.()
            ? h('div', { class: 'rlwb-panel__actions' }, slots.actions())
            : null,
        ]),
        h('div', { class: 'rlwb-inspector__body' }, body),
      ]);
    };
  },
});
