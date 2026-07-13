import type {
  TimeWindow,
  WorkbenchFilterValue,
  WorkbenchSelection,
  WorkbenchState,
  WorkbenchStore,
} from './state';
import type { WorkbenchThemeTokens, WorkbenchTone } from './theme';
import { createInitialWorkbenchState, createWorkbenchStore } from './state';
import { createWorkbenchThemeVars, resolveWorkbenchTheme } from './theme';

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

export type RenderSelectionContent =
  | ((selection: WorkbenchSelection | null) => string | Node | DocumentFragment | null | undefined)
  | null
  | undefined;

export const defaultTimeRangeOptions: TimeRangeOption[] = [
  { label: '1h', value: { preset: '1h', label: 'Last hour' } },
  { label: '24h', value: { preset: '24h', label: 'Last 24 hours' } },
  { label: '7d', value: { preset: '7d', label: 'Last 7 days' } },
  { label: '30d', value: { preset: '30d', label: 'Last 30 days' } },
];

export function getOrCreateWorkbenchStore(
  store: WorkbenchStore | null | undefined,
  initialState?: Partial<WorkbenchState>,
): WorkbenchStore {
  return store ?? createWorkbenchStore(createInitialWorkbenchState(initialState));
}

export function resolveElementWorkbenchStore(
  element: HTMLElement,
  explicitStore?: WorkbenchStore | null,
): WorkbenchStore | null {
  if (explicitStore) {
    return explicitStore;
  }

  const shell = element.closest('ui-workbench-shell') as
    | { workbenchStore?: WorkbenchStore | null; store?: WorkbenchStore | null }
    | null;

  return shell?.workbenchStore ?? shell?.store ?? null;
}

export function serializeThemeStyle(
  tone: WorkbenchTone,
  theme?: Partial<WorkbenchThemeTokens>,
): string {
  const vars = createWorkbenchThemeVars(resolveWorkbenchTheme(tone, theme));
  return Object.entries(vars)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}

export function slotHasContent(slot: HTMLSlotElement | null): boolean {
  if (!slot) {
    return false;
  }

  return slot.assignedNodes({ flatten: true }).some((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return true;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').trim().length > 0;
    }

    return false;
  });
}

export function escapeHtml(value: string | number | boolean | null | undefined): string {
  const text = value == null ? '' : String(value);
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function filterValuesEqual(
  left: WorkbenchFilterValue | undefined,
  right: WorkbenchFilterValue,
): boolean {
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false;
    }
    return left.every((value, index) => value === right[index]);
  }

  return left === right;
}

export function filterValueIncludes(
  current: WorkbenchFilterValue | undefined,
  expected: WorkbenchFilterValue,
): boolean {
  if (Array.isArray(current) && !Array.isArray(expected)) {
    return current.includes(expected);
  }

  return filterValuesEqual(current, expected);
}

export function toggleFilterValue(
  current: WorkbenchFilterValue | undefined,
  next: WorkbenchFilterValue,
  multi: boolean,
): WorkbenchFilterValue | undefined {
  if (!multi) {
    return filterValuesEqual(current, next) ? undefined : next;
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

export function timeWindowsEqual(
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

export function renderSelectionMarkup(selection: WorkbenchSelection | null): string {
  if (!selection) {
    return '';
  }

  const entries: Array<[string, string | number | boolean | null | undefined]> = [
    ['Panel', selection.panelId],
    ['Entity', selection.entityId],
    ['Series', selection.seriesId],
    ['Point', selection.pointId],
    ['Label', selection.label],
  ];

  for (const [key, value] of Object.entries(selection.meta ?? {})) {
    entries.push([
      key,
      typeof value === 'object'
        ? JSON.stringify(value)
        : (value as string | number | boolean | null | undefined),
    ]);
  }

  const rows = entries
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim().length > 0)
    .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`)
    .join('');

  return rows ? `<dl class="rlwb-selection-list">${rows}</dl>` : '';
}
