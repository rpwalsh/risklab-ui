import { createMemo, createSignal, mergeProps, splitProps, type Component, type JSX } from 'solid-js';
import {
  useWorkbench,
  useWorkbenchOptional,
  type TimeWindow,
  type WorkbenchFilterValue,
  type WorkbenchSelection,
} from './state';
import {
  createWorkbenchThemeVars,
  resolveWorkbenchTheme,
  type WorkbenchThemeTokens,
  type WorkbenchTone,
} from './theme';

export interface WorkbenchShellProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
  nav?: JSX.Element;
  topbar?: JSX.Element;
  inspector?: JSX.Element;
  statusBar?: JSX.Element;
  tone?: WorkbenchTone;
  theme?: Partial<WorkbenchThemeTokens>;
}

export interface PanelLayoutProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
  columns?: string;
  rows?: string;
  minColumnWidth?: number;
  dense?: boolean;
}

export interface WorkbenchPanelProps extends Omit<JSX.HTMLAttributes<HTMLElement>, 'title'> {
  children?: JSX.Element;
  panelId?: string;
  title: JSX.Element;
  subtitle?: JSX.Element;
  actions?: JSX.Element;
  footer?: JSX.Element;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  padding?: 'none' | 'sm' | 'md';
  tone?: 'default' | 'positive' | 'warning' | 'danger';
}

export interface FilterOption {
  label: JSX.Element;
  value: WorkbenchFilterValue;
}

export interface FilterDefinition {
  key: string;
  label: JSX.Element;
  options: FilterOption[];
  multi?: boolean;
  scope?: 'global' | 'panel';
  panelId?: string;
}

export interface FilterBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
  filters: FilterDefinition[];
}

export interface QueryBarProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: JSX.Element;
  placeholder?: string;
}

export interface TimeRangeOption {
  label: JSX.Element;
  value: TimeWindow;
}

export interface TimeRangeControlProps extends JSX.HTMLAttributes<HTMLDivElement> {
  options?: TimeRangeOption[];
}

export interface EntityInspectorProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: JSX.Element;
  emptyState?: JSX.Element;
  actions?: JSX.Element;
  renderContent?: (selection: WorkbenchSelection | null) => JSX.Element;
}

const defaultTimeRanges: TimeRangeOption[] = [
  { label: '1h', value: { preset: '1h', label: 'Last hour' } },
  { label: '24h', value: { preset: '24h', label: 'Last 24 hours' } },
  { label: '7d', value: { preset: '7d', label: 'Last 7 days' } },
  { label: '30d', value: { preset: '30d', label: 'Last 30 days' } },
];

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

function renderSelection(selection: WorkbenchSelection | null): JSX.Element | null {
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

  return (
    <dl class="rlwb-selection-list">
      {rows.flatMap(([label, value]) => [<dt>{label}</dt>, <dd>{value}</dd>])}
    </dl>
  );
}

export const WorkbenchShell: Component<WorkbenchShellProps> = (rawProps) => {
  const props = mergeProps({ tone: 'dark' as WorkbenchTone }, rawProps);
  const [local, rest] = splitProps(props, [
    'children',
    'nav',
    'topbar',
    'inspector',
    'statusBar',
    'tone',
    'theme',
    'class',
    'style',
  ]);

  const themeStyle = createMemo(() => createWorkbenchThemeVars(resolveWorkbenchTheme(local.tone, local.theme)));

  return (
    <div
      {...rest}
      data-rl-workbench=""
      classList={{
        'rlwb-shell': true,
        'rlwb-shell--has-nav': Boolean(local.nav),
        'rlwb-shell--has-inspector': Boolean(local.inspector),
      }}
      class={local.class}
      style={{ ...themeStyle(), ...(local.style as JSX.CSSProperties | undefined) }}
    >
      {local.nav ? <aside class="rlwb-shell__nav">{local.nav}</aside> : null}
      <div class="rlwb-shell__frame">
        {local.topbar ? <header class="rlwb-shell__topbar">{local.topbar}</header> : null}
        <div class="rlwb-shell__body">
          <main class="rlwb-shell__workspace">{local.children}</main>
          {local.inspector ? <aside class="rlwb-shell__inspector">{local.inspector}</aside> : null}
        </div>
        {local.statusBar ? <footer class="rlwb-shell__status">{local.statusBar}</footer> : null}
      </div>
    </div>
  );
};

export const PanelLayout: Component<PanelLayoutProps> = (rawProps) => {
  const props = mergeProps({ dense: false }, rawProps);
  const [local, rest] = splitProps(props, [
    'children',
    'columns',
    'rows',
    'minColumnWidth',
    'dense',
    'class',
    'style',
  ]);

  const templateColumns = createMemo(() => (
    local.minColumnWidth
      ? `repeat(auto-fit, minmax(${local.minColumnWidth}px, 1fr))`
      : local.columns ?? 'repeat(auto-fit, minmax(320px, 1fr))'
  ));

  return (
    <div
      {...rest}
      classList={{ 'rlwb-panel-layout': true, 'rlwb-panel-layout--dense': local.dense }}
      class={local.class}
      style={{
        'grid-template-columns': templateColumns(),
        'grid-template-rows': local.rows,
        ...(local.style as JSX.CSSProperties | undefined),
      }}
    >
      {local.children}
    </div>
  );
};

export const WorkbenchPanel: Component<WorkbenchPanelProps> = (rawProps) => {
  const props = mergeProps(
    { defaultCollapsed: false, padding: 'md' as const, tone: 'default' as const },
    rawProps,
  );
  const [local, rest] = splitProps(props, [
    'children',
    'panelId',
    'title',
    'subtitle',
    'actions',
    'footer',
    'collapsible',
    'defaultCollapsed',
    'padding',
    'tone',
    'class',
  ]);

  const workbench = useWorkbenchOptional();
  const [localCollapsed, setLocalCollapsed] = createSignal(local.defaultCollapsed);
  const panelState = createMemo(() => (
    local.panelId && workbench ? (workbench.state().panels[local.panelId] ?? {}) : {}
  ));
  const collapsed = createMemo(() => Boolean(panelState().collapsed ?? localCollapsed()));

  const toggleCollapsed = () => {
    if (local.panelId && workbench) {
      workbench.actions.patchPanelState(local.panelId, { collapsed: !collapsed() });
      return;
    }
    setLocalCollapsed(!collapsed());
  };

  return (
    <section
      {...rest}
      classList={{
        'rlwb-panel': true,
        'rlwb-panel--collapsed': collapsed(),
        [`rlwb-panel--padding-${local.padding}`]: true,
        [`rlwb-panel--tone-${local.tone}`]: local.tone !== 'default',
      }}
      class={local.class}
    >
      <header class="rlwb-panel__header">
        <div class="rlwb-panel__titles">
          <div class="rlwb-panel__title">{local.title}</div>
          {local.subtitle ? <div class="rlwb-panel__subtitle">{local.subtitle}</div> : null}
        </div>
        <div class="rlwb-panel__actions">
          {local.actions}
          {local.collapsible ? <button type="button" class="rlwb-icon-button" onClick={toggleCollapsed}>⌄</button> : null}
        </div>
      </header>
      {!collapsed() ? <div class="rlwb-panel__body">{local.children}</div> : null}
      {local.footer ? <footer class="rlwb-panel__footer">{local.footer}</footer> : null}
    </section>
  );
};

export const QueryBar: Component<QueryBarProps> = (rawProps) => {
  const props = mergeProps({ label: 'Query', placeholder: 'Search, scope, or command' }, rawProps);
  const [local, rest] = splitProps(props, ['label', 'placeholder', 'class']);
  const { state, actions } = useWorkbench();

  return (
    <label class="rlwb-query-bar">
      <span class="rlwb-query-label">{local.label}</span>
      <input
        {...rest}
        class={`rlwb-query-input ${local.class ?? ''}`.trim()}
        type="search"
        value={state().query}
        placeholder={local.placeholder}
        onInput={(event) => actions.setQuery(event.currentTarget.value)}
      />
    </label>
  );
};

export const FilterBar: Component<FilterBarProps> = (props) => {
  const { state, actions } = useWorkbench();

  return (
    <div class="rlwb-filter-bar">
      {props.filters.map((filter) => {
        const currentValue = createMemo(() => (
          filter.scope === 'panel'
            ? state().panels[filter.panelId ?? '']?.filters?.[filter.key]
            : state().filters[filter.key]
        ));

        return (
          <div class="rlwb-filter-group">
            <span class="rlwb-filter-group__label">{filter.label}</span>
            <div class="rlwb-filter-group__options">
              {filter.options.map((option) => (
                <button
                  type="button"
                  class="rlwb-filter-chip"
                  aria-pressed={filterValueIncludes(currentValue(), option.value)}
                  onClick={() => {
                    const nextValue = toggleFilterValue(currentValue(), option.value, Boolean(filter.multi));
                    if (filter.scope === 'panel' && filter.panelId) {
                      actions.setPanelFilter(filter.panelId, filter.key, nextValue);
                    } else {
                      actions.setFilter(filter.key, nextValue);
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const TimeRangeControl: Component<TimeRangeControlProps> = (rawProps) => {
  const props = mergeProps({ options: defaultTimeRanges }, rawProps);
  const { state, actions } = useWorkbench();

  return (
    <div class="rlwb-time-range">
      {props.options.map((option) => (
        <button
          type="button"
          class="rlwb-filter-chip"
          aria-pressed={timeWindowsEqual(state().timeWindow, option.value)}
          onClick={() => actions.setTimeWindow(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export const EntityInspector: Component<EntityInspectorProps> = (props) => {
  const workbench = useWorkbenchOptional();
  const selection = createMemo(() => workbench?.state().selection ?? null);
  const rendered = createMemo(() => props.renderContent?.(selection()) ?? renderSelection(selection()));

  return (
    <section class={`rlwb-inspector ${props.class ?? ''}`.trim()}>
      <header class="rlwb-inspector__header">
        <div class="rlwb-panel__titles">
          <div class="rlwb-panel__title">{props.title ?? 'Inspector'}</div>
        </div>
        {props.actions ? <div class="rlwb-panel__actions">{props.actions}</div> : null}
      </header>
      <div class="rlwb-inspector__body">
        {rendered() ?? <div class="rlwb-empty-state">{props.emptyState ?? 'Select a record, point, or entity to inspect it here.'}</div>}
      </div>
    </section>
  );
};
