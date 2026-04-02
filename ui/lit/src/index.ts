/**
 * @risklab/ui-lit
 *
 * Lit 3 Web Component library — same design token system as
 * @risklab/charts, @risklab/ui-vanilla, and @risklab/ui-react.
 *
 * Usage:
 * ```html
 * <script type="module">
 *   import '@risklab/ui-lit';            // registers all components
 *   import '@risklab/ui-lit/css';        // base design tokens
 * </script>
 *
 * <ui-button variant="filled" color="primary">Click me</ui-button>
 * <ui-text-field label="Name" placeholder="Enter name…"></ui-text-field>
 * ```
 *
 * Or import individual categories:
 * ```ts
 * import { UiButton } from '@risklab/ui-lit/inputs';
 * import { UiDataGrid } from '@risklab/ui-lit/data-display';
 * ```
 */

// --- Core ─────────────────────────────────────────────────────────────
export type {
  SizeVariant,
  ColorVariant,
  ThemeMode,
  ThemeTokens,
  ButtonProps,
  TextFieldProps,
  SelectProps,
  SelectOptionData,
  CheckboxProps,
  SwitchProps,
  SliderProps,
  ChipProps,
  BadgeProps,
  AvatarProps,
  TooltipProps,
  AlertProps,
  DialogProps,
  ProgressProps,
  SkeletonProps,
  TabsProps,
  DrawerProps,
  AccordionProps,
  PaginationProps,
  DataGridColumn,
  DataGridProps,
  ToastOptions,
} from './core';

// --- Theme ────────────────────────────────────────────────────────────
export { UiThemeProvider } from './theme';

// --- Layout ───────────────────────────────────────────────────────────
export { UiBox, UiStack, UiGrid, UiDivider } from './layout';

// --- Inputs ───────────────────────────────────────────────────────────
export {
  UiButton,
  UiTextField,
  UiSelect,
  UiCheckbox,
  UiSwitch,
  UiSlider,
} from './inputs';

// --- Data Display ─────────────────────────────────────────────────────
export {
  UiChip,
  UiBadge,
  UiAvatar,
  UiTooltip,
  UiCard,
  UiDataGrid,
} from './data-display';

// --- Feedback ─────────────────────────────────────────────────────────
export {
  UiAlert,
  UiDialog,
  UiProgress,
  UiSkeleton,
  UiToast,
} from './feedback';

// --- Navigation ───────────────────────────────────────────────────────
export {
  UiTabs,
  UiTab,
  UiTabPanel,
  UiDrawer,
  UiBreadcrumbs,
  UiPagination,
} from './navigation';

// --- Surfaces ─────────────────────────────────────────────────────────
export { UiAccordion, UiAccordionItem, UiPaper } from './surfaces';

// --- Utils ────────────────────────────────────────────────────────────
export { onMediaQuery, debounce, onClickOutside } from './utils';
