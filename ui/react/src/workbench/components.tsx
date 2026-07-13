import React, { useState } from 'react';
import {
  type TimeWindow,
  type WorkbenchFilterValue,
  type WorkbenchPanelState,
  type WorkbenchSelection,
  useWorkbenchActions,
  useWorkbenchActionsOptional,
  useWorkbenchSelector,
  useWorkbenchSelectorOptional,
} from './state';
import {
  createWorkbenchThemeVars,
  resolveWorkbenchTheme,
  type WorkbenchThemeTokens,
  type WorkbenchTone,
} from './theme';

export interface WorkbenchShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  nav?: React.ReactNode;
  topbar?: React.ReactNode;
  inspector?: React.ReactNode;
  statusBar?: React.ReactNode;
  tone?: WorkbenchTone;
  theme?: Partial<WorkbenchThemeTokens>;
}

export interface PanelLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: string;
  rows?: string;
  minColumnWidth?: number;
  dense?: boolean;
}

export interface WorkbenchPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  children: React.ReactNode;
  panelId?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  padding?: 'none' | 'sm' | 'md';
  tone?: 'default' | 'positive' | 'warning' | 'danger';
}

export interface FilterOption {
  label: React.ReactNode;
  value: WorkbenchFilterValue;
}

export interface FilterDefinition {
  key: string;
  label: React.ReactNode;
  options: FilterOption[];
  multi?: boolean;
  scope?: 'global' | 'panel';
  panelId?: string;
}

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  filters: FilterDefinition[];
}

export interface QueryBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  label?: React.ReactNode;
  placeholder?: string;
}

export interface TimeRangeOption {
  label: React.ReactNode;
  value: TimeWindow;
}

export interface TimeRangeControlProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: TimeRangeOption[];
}

export interface EntityInspectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  emptyState?: React.ReactNode;
  actions?: React.ReactNode;
  renderContent?: (selection: WorkbenchSelection | null) => React.ReactNode;
}

const defaultTimeRanges: TimeRangeOption[] = [
  { label: '1h', value: { preset: '1h', label: 'Last hour' } },
  { label: '24h', value: { preset: '24h', label: 'Last 24 hours' } },
  { label: '7d', value: { preset: '7d', label: 'Last 7 days' } },
  { label: '30d', value: { preset: '30d', label: 'Last 30 days' } },
];

export function WorkbenchShell({
  children,
  nav,
  topbar,
  inspector,
  statusBar,
  tone = 'dark',
  theme,
  className,
  style,
  ...rest
}: WorkbenchShellProps): React.ReactElement {
  const themeStyle = createWorkbenchThemeVars(resolveWorkbenchTheme(tone, theme));

  return (
    <div
      {...rest}
      data-rl-workbench=""
      data-tone={tone}
      className={cx(
        'rlwb-shell',
        Boolean(nav) && 'rlwb-shell--has-nav',
        Boolean(inspector) && 'rlwb-shell--has-inspector',
        className,
      )}
      style={{ ...themeStyle, ...style }}
    >
      {nav ? <aside className="rlwb-shell__nav">{nav}</aside> : null}
      <div className="rlwb-shell__frame">
        {topbar ? <header className="rlwb-shell__topbar">{topbar}</header> : null}
        <div className="rlwb-shell__body">
          <main className="rlwb-shell__workspace">{children}</main>
          {inspector ? <aside className="rlwb-shell__inspector">{inspector}</aside> : null}
        </div>
        {statusBar ? <footer className="rlwb-shell__status">{statusBar}</footer> : null}
      </div>
    </div>
  );
}

export function PanelLayout({
  children,
  columns,
  rows,
  minColumnWidth = 320,
  dense = false,
  className,
  style,
  ...rest
}: PanelLayoutProps): React.ReactElement {
  return (
    <div
      {...rest}
      className={cx('rlwb-panel-layout', dense && 'rlwb-panel-layout--dense', className)}
      style={{
        gridTemplateColumns: columns ?? `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`,
        gridTemplateRows: rows,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function WorkbenchPanel({
  children,
  panelId,
  title,
  subtitle,
  actions,
  footer,
  collapsible = false,
  defaultCollapsed = false,
  padding = 'md',
  tone = 'default',
  className,
  ...rest
}: WorkbenchPanelProps): React.ReactElement {
  const workbenchActions = useWorkbenchActionsOptional();
  const storedPanelState = useWorkbenchSelectorOptional((state) =>
    panelId ? state.panels[panelId] : undefined,
  );
  const [localState, setLocalState] = useState<WorkbenchPanelState>({
    collapsed: defaultCollapsed,
  });
  const panelState = panelId && workbenchActions ? storedPanelState : localState;
  const collapsed = panelState?.collapsed ?? false;

  const setPanelState = (patch: Partial<WorkbenchPanelState>) => {
    if (panelId && workbenchActions) {
      workbenchActions.patchPanelState(panelId, patch);
      return;
    }
    setLocalState((current) => ({ ...current, ...patch }));
  };

  return (
    <section
      {...rest}
      className={cx(
        'rlwb-panel',
        `rlwb-panel--tone-${tone}`,
        `rlwb-panel--padding-${padding}`,
        collapsed && 'rlwb-panel--collapsed',
        className,
      )}
      data-panel-id={panelId}
      data-collapsed={collapsed || undefined}
    >
      <header className="rlwb-panel__header">
        <div className="rlwb-panel__titles">
          <div className="rlwb-panel__title">{title}</div>
          {subtitle ? <div className="rlwb-panel__subtitle">{subtitle}</div> : null}
        </div>
        <div className="rlwb-panel__actions">
          {actions}
          {collapsible ? (
            <button
              type="button"
              className="rlwb-icon-button"
              aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
              onClick={() => setPanelState({ collapsed: !collapsed })}
            >
              {collapsed ? '+' : '-'}
            </button>
          ) : null}
        </div>
      </header>
      {!collapsed ? <div className="rlwb-panel__body">{children}</div> : null}
      {!collapsed && footer ? <footer className="rlwb-panel__footer">{footer}</footer> : null}
    </section>
  );
}

export function QueryBar({
  label = 'Query',
  placeholder = 'Search entities, incidents, owners, or hosts',
  className,
  ...rest
}: QueryBarProps): React.ReactElement {
  const query = useWorkbenchSelector((state) => state.query);
  const actions = useWorkbenchActions();

  return (
    <label className={cx('rlwb-query-bar', className)}>
      <span className="rlwb-query-label">{label}</span>
      <input
        {...rest}
        type="search"
        value={query ?? ''}
        placeholder={placeholder}
        className="rlwb-query-input"
        onChange={(event) => actions.setQuery(event.currentTarget.value)}
      />
    </label>
  );
}

export function FilterBar({
  filters,
  className,
  ...rest
}: FilterBarProps): React.ReactElement {
  return (
    <div {...rest} className={cx('rlwb-filter-bar', className)}>
      {filters.map((definition) => (
        <FilterDefinitionControl
          key={`${definition.scope ?? 'global'}:${definition.panelId ?? 'global'}:${definition.key}`}
          definition={definition}
        />
      ))}
    </div>
  );
}

function FilterDefinitionControl({ definition }: { definition: FilterDefinition }): React.ReactElement {
  const scope = definition.scope ?? 'global';
  const currentValue = useWorkbenchSelector((state) => scope === 'panel'
    ? definition.panelId
      ? state.panels[definition.panelId]?.filters?.[definition.key]
      : undefined
    : state.filters[definition.key]);
  const actions = useWorkbenchActions();
  return (
    <div className="rlwb-filter-group">
      <span className="rlwb-filter-group__label">{definition.label}</span>
      <div className="rlwb-filter-group__options">
        {definition.options.map((option) => {
          const active = isFilterActive(currentValue, option.value, definition.multi);
          return (
            <button
              key={String(option.label)}
              type="button"
              className="rlwb-filter-chip"
              aria-pressed={active}
              onClick={() => {
                const nextValue = definition.multi
                  ? toggleMultiValue(currentValue, option.value)
                  : active ? undefined : option.value;
                if (scope === 'panel' && definition.panelId) {
                  actions.setPanelFilter(definition.panelId, definition.key, nextValue);
                } else actions.setFilter(definition.key, nextValue);
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimeRangeControl({
  options = defaultTimeRanges,
  className,
  ...rest
}: TimeRangeControlProps): React.ReactElement {
  const timeWindow = useWorkbenchSelector((state) => state.timeWindow);
  const actions = useWorkbenchActions();

  return (
    <div {...rest} className={cx('rlwb-time-range', className)}>
      <span className="rlwb-filter-group__label">Time</span>
      <div className="rlwb-filter-group__options">
        {options.map((option) => {
          const active = areTimeWindowsEqual(timeWindow, option.value);
          return (
            <button
              key={String(option.label)}
              type="button"
              className="rlwb-filter-chip"
              aria-pressed={active}
              onClick={() => actions.setTimeWindow(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EntityInspector({
  title = 'Inspector',
  emptyState = 'Select an entity, point, or record to inspect it here.',
  actions,
  renderContent,
  className,
  ...rest
}: EntityInspectorProps): React.ReactElement {
  const selection = useWorkbenchSelectorOptional((state) => state.selection) ?? null;

  return (
    <div {...rest} className={cx('rlwb-inspector', className)}>
      <header className="rlwb-inspector__header">
        <div className="rlwb-panel__title">{title}</div>
        <div className="rlwb-panel__actions">{actions}</div>
      </header>
      <div className="rlwb-inspector__body">
        {renderContent
          ? renderContent(selection)
          : selection
            ? <DefaultSelectionContent selection={selection} />
            : <div className="rlwb-empty-state">{emptyState}</div>}
      </div>
    </div>
  );
}

function DefaultSelectionContent({
  selection,
}: {
  selection: WorkbenchSelection;
}): React.ReactElement {
  return (
    <dl className="rlwb-selection-list">
      {selection.label ? (
        <>
          <dt>Label</dt>
          <dd>{selection.label}</dd>
        </>
      ) : null}
      {selection.entityId ? (
        <>
          <dt>Entity</dt>
          <dd>{selection.entityId}</dd>
        </>
      ) : null}
      {selection.panelId ? (
        <>
          <dt>Panel</dt>
          <dd>{selection.panelId}</dd>
        </>
      ) : null}
      {selection.seriesId ? (
        <>
          <dt>Series</dt>
          <dd>{selection.seriesId}</dd>
        </>
      ) : null}
      {selection.pointId ? (
        <>
          <dt>Point</dt>
          <dd>{selection.pointId}</dd>
        </>
      ) : null}
    </dl>
  );
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function isFilterActive(
  currentValue: WorkbenchFilterValue | undefined,
  optionValue: WorkbenchFilterValue,
  multi?: boolean,
): boolean {
  if (multi) {
    if (!Array.isArray(currentValue)) {
      return false;
    }
    return Array.isArray(optionValue)
      ? optionValue.every((value) => currentValue.includes(value))
      : currentValue.includes(optionValue);
  }

  if (Array.isArray(currentValue) || Array.isArray(optionValue)) {
    return JSON.stringify(currentValue) === JSON.stringify(optionValue);
  }

  return currentValue === optionValue;
}

function toggleMultiValue(
  currentValue: WorkbenchFilterValue | undefined,
  optionValue: WorkbenchFilterValue,
): WorkbenchFilterValue | undefined {
  const existing = Array.isArray(currentValue)
    ? currentValue
    : currentValue === undefined
      ? []
      : [currentValue];
  const values = Array.isArray(optionValue) ? optionValue : [optionValue];
  const next = [...existing];

  for (const value of values) {
    const index = next.findIndex((entry) => entry === value);
    if (index >= 0) {
      next.splice(index, 1);
    } else {
      next.push(value);
    }
  }

  return next.length > 0 ? next : undefined;
}

function areTimeWindowsEqual(
  left: TimeWindow | null | undefined,
  right: TimeWindow | null | undefined,
): boolean {
  if (!left || !right) {
    return left === right;
  }

  return left.preset === right.preset
    && left.from === right.from
    && left.to === right.to
    && left.timezone === right.timezone;
}
