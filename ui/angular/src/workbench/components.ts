import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChildren,
  inject,
  input,
  signal,
} from '@angular/core';
import type {
  TimeWindow,
  WorkbenchFilterValue,
  WorkbenchSelection,
} from './model';
import type { WorkbenchThemeTokens, WorkbenchTone } from './theme';
import { createWorkbenchThemeVars, resolveWorkbenchTheme } from './theme';
import { WorkbenchService } from './WorkbenchService';

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

export interface TimeRangeOption {
  label: string;
  value: TimeWindow;
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

@Component({
  selector: 'ui-workbench-shell',
  standalone: true,
  imports: [],
  template: `
    <div
      data-rl-workbench=""
      class="rlwb-shell"
      [class.rlwb-shell--has-nav]="navNodes().length > 0"
      [class.rlwb-shell--has-inspector]="inspectorNodes().length > 0"
      [attr.style]="themeStyle()"
    >
      @if (navNodes().length > 0) {
        <aside class="rlwb-shell__nav">
          <ng-content select="[workbench-nav]" />
        </aside>
      }
      <div class="rlwb-shell__frame">
        @if (topbarNodes().length > 0) {
          <header class="rlwb-shell__topbar">
            <ng-content select="[workbench-topbar]" />
          </header>
        }
        <div class="rlwb-shell__body">
          <main class="rlwb-shell__workspace">
            <ng-content />
          </main>
          @if (inspectorNodes().length > 0) {
            <aside class="rlwb-shell__inspector">
              <ng-content select="[workbench-inspector]" />
            </aside>
          }
        </div>
        @if (statusNodes().length > 0) {
          <footer class="rlwb-shell__status">
            <ng-content select="[workbench-status]" />
          </footer>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchShell {
  readonly tone = input<WorkbenchTone>('dark');
  readonly theme = input<Partial<WorkbenchThemeTokens>>({});
  readonly navNodes = contentChildren('[workbench-nav]', { descendants: true, read: ElementRef });
  readonly topbarNodes = contentChildren('[workbench-topbar]', { descendants: true, read: ElementRef });
  readonly inspectorNodes = contentChildren('[workbench-inspector]', { descendants: true, read: ElementRef });
  readonly statusNodes = contentChildren('[workbench-status]', { descendants: true, read: ElementRef });

  themeStyle(): string {
    return Object.entries(createWorkbenchThemeVars(resolveWorkbenchTheme(this.tone(), this.theme())))
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  }
}

@Component({
  selector: 'ui-panel-layout',
  standalone: true,
  imports: [],
  template: `
    <div
      class="rlwb-panel-layout"
      [class.rlwb-panel-layout--dense]="dense()"
      [style.gridTemplateColumns]="templateColumns()"
      [style.gridTemplateRows]="rows() || null"
    >
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelLayout {
  readonly columns = input<string | undefined>(undefined);
  readonly rows = input<string | undefined>(undefined);
  readonly minColumnWidth = input<number | undefined>(undefined);
  readonly dense = input(false);

  templateColumns(): string {
    if (this.minColumnWidth()) {
      return `repeat(auto-fit, minmax(${this.minColumnWidth()}px, 1fr))`;
    }
    return this.columns() ?? 'repeat(auto-fit, minmax(320px, 1fr))';
  }
}

@Component({
  selector: 'ui-workbench-panel',
  standalone: true,
  imports: [],
  template: `
    <section
      class="rlwb-panel"
      [class.rlwb-panel--collapsed]="collapsed()"
      [class.rlwb-panel--padding-none]="padding() === 'none'"
      [class.rlwb-panel--padding-sm]="padding() === 'sm'"
      [class.rlwb-panel--padding-md]="padding() === 'md'"
      [class.rlwb-panel--tone-positive]="tone() === 'positive'"
      [class.rlwb-panel--tone-warning]="tone() === 'warning'"
      [class.rlwb-panel--tone-danger]="tone() === 'danger'"
    >
      <header class="rlwb-panel__header">
        <div class="rlwb-panel__titles">
          <div class="rlwb-panel__title">{{ title() }}</div>
          @if (subtitle()) {
            <div class="rlwb-panel__subtitle">{{ subtitle() }}</div>
          }
        </div>
        <div class="rlwb-panel__actions">
          <ng-content select="[panel-actions]" />
          @if (collapsible()) {
            <button type="button" class="rlwb-icon-button" (click)="toggleCollapsed()">⌄</button>
          }
        </div>
      </header>
      @if (!collapsed()) {
        <div class="rlwb-panel__body">
          <ng-content />
        </div>
      }
      @if (footerNodes().length > 0) {
        <footer class="rlwb-panel__footer">
          <ng-content select="[panel-footer]" />
        </footer>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchPanel {
  readonly workbench = inject(WorkbenchService, { optional: true });
  readonly footerNodes = contentChildren('[panel-footer]', { descendants: true, read: ElementRef });
  readonly panelId = input<string | undefined>(undefined);
  readonly title = input('');
  readonly subtitle = input<string | undefined>(undefined);
  readonly collapsible = input(false);
  readonly defaultCollapsed = input(false);
  readonly padding = input<'none' | 'sm' | 'md'>('md');
  readonly tone = input<'default' | 'positive' | 'warning' | 'danger'>('default');
  private readonly localCollapsed = signal(false);

  readonly collapsed = computed(() => {
    const serviceState = this.panelId() && this.workbench
      ? this.workbench.state().panels[this.panelId()!]?.collapsed
      : undefined;
    return Boolean(serviceState ?? this.localCollapsed() ?? this.defaultCollapsed());
  });

  toggleCollapsed(): void {
    if (this.panelId() && this.workbench) {
      this.workbench.actions.patchPanelState(this.panelId()!, { collapsed: !this.collapsed() });
      return;
    }

    this.localCollapsed.set(!this.collapsed());
  }
}

@Component({
  selector: 'ui-query-bar',
  standalone: true,
  imports: [],
  template: `
    <label class="rlwb-query-bar">
      <span class="rlwb-query-label">{{ label() }}</span>
      <input
        class="rlwb-query-input"
        type="search"
        [value]="workbench.query()"
        [placeholder]="placeholder()"
        (input)="updateQuery($event)"
      />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryBar {
  readonly workbench = inject(WorkbenchService);
  readonly label = input('Query');
  readonly placeholder = input('Search, scope, or command');

  updateQuery(event: Event): void {
    this.workbench.actions.setQuery((event.currentTarget as HTMLInputElement).value);
  }
}

@Component({
  selector: 'ui-filter-bar',
  standalone: true,
  imports: [],
  template: `
    <div class="rlwb-filter-bar">
      @for (filter of filters(); track filter.key) {
        <div class="rlwb-filter-group">
          <span class="rlwb-filter-group__label">{{ filter.label }}</span>
          <div class="rlwb-filter-group__options">
            @for (option of filter.options; track option.label) {
              <button
                type="button"
                class="rlwb-filter-chip"
                [attr.aria-pressed]="isPressed(filter, option)"
                (click)="toggle(filter, option.value)"
              >
                {{ option.label }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBar {
  readonly workbench = inject(WorkbenchService);
  readonly filters = input<FilterDefinition[]>([]);

  isPressed(filter: FilterDefinition, option: FilterOption): boolean {
    const currentValue = filter.scope === 'panel'
      ? this.workbench.state().panels[filter.panelId ?? '']?.filters?.[filter.key]
      : this.workbench.state().filters[filter.key];
    return filterValueIncludes(currentValue, option.value);
  }

  toggle(filter: FilterDefinition, value: WorkbenchFilterValue): void {
    const currentValue = filter.scope === 'panel'
      ? this.workbench.state().panels[filter.panelId ?? '']?.filters?.[filter.key]
      : this.workbench.state().filters[filter.key];
    const nextValue = toggleFilterValue(currentValue, value, Boolean(filter.multi));

    if (filter.scope === 'panel' && filter.panelId) {
      this.workbench.actions.setPanelFilter(filter.panelId, filter.key, nextValue);
    } else {
      this.workbench.actions.setFilter(filter.key, nextValue);
    }
  }
}

@Component({
  selector: 'ui-time-range-control',
  standalone: true,
  imports: [],
  template: `
    <div class="rlwb-time-range">
      @for (option of options(); track option.label) {
        <button
          type="button"
          class="rlwb-filter-chip"
          [attr.aria-pressed]="isActive(option)"
          (click)="workbench.actions.setTimeWindow(option.value)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeRangeControl {
  readonly workbench = inject(WorkbenchService);
  readonly options = input<TimeRangeOption[]>(defaultTimeRanges);

  isActive(option: TimeRangeOption): boolean {
    return timeWindowsEqual(this.workbench.state().timeWindow, option.value);
  }
}

@Component({
  selector: 'ui-entity-inspector',
  standalone: true,
  imports: [],
  template: `
    <section class="rlwb-inspector">
      <header class="rlwb-inspector__header">
        <div class="rlwb-panel__titles">
          <div class="rlwb-panel__title">{{ title() }}</div>
        </div>
      </header>
      <div class="rlwb-inspector__body">
        @if (renderContent() && renderedContent()) {
          <div [innerHTML]="renderedContent()"></div>
        } @else if (selectionEntries().length > 0) {
          <dl class="rlwb-selection-list">
            @for (entry of selectionEntries(); track entry[0]) {
              <dt>{{ entry[0] }}</dt>
              <dd>{{ entry[1] }}</dd>
            }
          </dl>
        } @else {
          <div class="rlwb-empty-state">{{ emptyState() }}</div>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityInspector {
  readonly workbench = inject(WorkbenchService, { optional: true });
  readonly title = input('Inspector');
  readonly emptyState = input('Select a record, point, or entity to inspect it here.');
  readonly renderContent = input<((selection: WorkbenchSelection | null) => string | null | undefined) | undefined>(undefined);

  readonly selection = computed(() => this.workbench?.selection() ?? null);

  renderedContent(): string | null | undefined {
    return this.renderContent()?.(this.selection());
  }

  selectionEntries(): Array<[string, string]> {
    const selection = this.selection();
    if (!selection) {
      return [];
    }

    const entries = [
      ['Panel', selection.panelId ?? ''],
      ['Entity', selection.entityId ?? ''],
      ['Series', selection.seriesId ?? ''],
      ['Point', selection.pointId ?? ''],
      ['Label', selection.label ?? ''],
    ].filter(([, value]) => value.trim().length > 0) as Array<[string, string]>;

    for (const [key, value] of Object.entries(selection.meta ?? {})) {
      entries.push([key, typeof value === 'object' ? JSON.stringify(value) : String(value)]);
    }

    return entries;
  }
}
