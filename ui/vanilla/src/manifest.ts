export type UIComponentFamily = 'core' | 'theme' | 'layout' | 'inputs' | 'data-display' | 'feedback' | 'navigation' | 'surfaces' | 'workbench';

export interface UIComponentDefinition {
  tag: `ui-${string}`;
  family: UIComponentFamily;
  status: 'stable';
  version: '1.0';
}

const define = (family: UIComponentFamily, tags: Array<`ui-${string}`>): UIComponentDefinition[] => tags.map((tag) => ({ tag, family, status: 'stable', version: '1.0' }));

export const UI_COMPONENT_MANIFEST: readonly UIComponentDefinition[] = [
  ...define('theme', ['ui-theme-provider']),
  ...define('layout', ['ui-box', 'ui-stack', 'ui-grid', 'ui-divider', 'ui-container', 'ui-flex', 'ui-center', 'ui-spacer', 'ui-aspect-ratio', 'ui-scroll-area', 'ui-masonry', 'ui-split-pane', 'ui-viewport-layout']),
  ...define('inputs', ['ui-button', 'ui-icon-button', 'ui-button-group', 'ui-text-field', 'ui-textarea', 'ui-select', 'ui-checkbox', 'ui-switch', 'ui-slider', 'ui-radio', 'ui-radio-group', 'ui-autocomplete', 'ui-toggle-button', 'ui-toggle-button-group', 'ui-number-input', 'ui-rating', 'ui-tag-input', 'ui-otp-input', 'ui-drop-zone', 'ui-date-picker', 'ui-time-picker', 'ui-form-control', 'ui-form-label', 'ui-form-helper', 'ui-form-error', 'ui-search-input', 'ui-password-input', 'ui-color-input']),
  ...define('data-display', ['ui-chip', 'ui-badge', 'ui-avatar', 'ui-avatar-group', 'ui-tooltip', 'ui-card', 'ui-data-grid', 'ui-data-grid-advanced', 'ui-pivot-grid', 'ui-tree-grid', 'ui-list', 'ui-list-item', 'ui-table', 'ui-timeline', 'ui-timeline-item', 'ui-tree-view', 'ui-tree-item', 'ui-typography', 'ui-callout', 'ui-image-list', 'ui-virtual-list', 'ui-stat', 'ui-kbd', 'ui-code-block', 'ui-description-list', 'ui-description-item']),
  ...define('feedback', ['ui-alert', 'ui-dialog', 'ui-progress', 'ui-skeleton', 'ui-toast-container', 'ui-backdrop', 'ui-empty-state', 'ui-snackbar']),
  ...define('navigation', ['ui-tabs', 'ui-tab', 'ui-tab-panel', 'ui-drawer', 'ui-breadcrumbs', 'ui-pagination', 'ui-app-bar', 'ui-toolbar', 'ui-menu', 'ui-menu-item', 'ui-popover', 'ui-stepper', 'ui-step', 'ui-command-palette', 'ui-context-menu', 'ui-side-navigation', 'ui-side-nav-item', 'ui-bottom-navigation', 'ui-link']),
  ...define('surfaces', ['ui-accordion', 'ui-accordion-item', 'ui-paper', 'ui-collapse']),
  ...define('workbench', ['ui-workbench-shell', 'ui-workbench-panel-layout', 'ui-workbench-panel', 'ui-workbench-query-bar', 'ui-workbench-filter-bar', 'ui-workbench-time-range-control', 'ui-workbench-entity-inspector']),
] as const;

export const UI_COMPONENT_TAGS = UI_COMPONENT_MANIFEST.map((component) => component.tag) as readonly `ui-${string}`[];

export function getUIComponentDefinition(tag: string): UIComponentDefinition | undefined {
  return UI_COMPONENT_MANIFEST.find((component) => component.tag === tag);
}

export function listUIComponents(family?: UIComponentFamily): readonly UIComponentDefinition[] {
  return family ? UI_COMPONENT_MANIFEST.filter((component) => component.family === family) : UI_COMPONENT_MANIFEST;
}
