/**
 * @risklab/ui-vanilla
 *
 * Framework-agnostic UI component library built on Custom Elements v1.
 * Zero runtime dependencies. Same design token system as @risklab/charts
 * and @risklab/ui-react.
 *
 * Usage:
 * ```html
 * <script type="module">
 *   import '@risklab/ui-vanilla';        // registers all components
 *   import '@risklab/ui-vanilla/css';     // base design tokens
 * </script>
 *
 * <ui-button variant="filled" color="primary">Click me</ui-button>
 * <ui-text-field label="Name" placeholder="Enter name…"></ui-text-field>
 * ```
 *
 * Or import individual categories:
 * ```ts
 * import { UIButton } from '@risklab/ui-vanilla/inputs';
 * import { UIDataGrid } from '@risklab/ui-vanilla/data-display';
 * ```
 */

// --- Core ─────────────────────────────────────────────────────────────
import './inputs/Button';
import './inputs/TextField';
import './inputs/Select';
import './inputs/Checkbox';
import './inputs/Switch';
import './inputs/Slider';
import './data-display/Chip';
import './data-display/Badge';
import './data-display/Avatar';
import './data-display/Tooltip';
import './data-display/Card';
import './data-display/DataGrid';
import './feedback/Alert';
import './feedback/Dialog';
import './feedback/Progress';
import './feedback/Skeleton';
import './feedback/Toast';
import './navigation/Tabs';
import './navigation/Drawer';
import './navigation/Breadcrumbs';
import './navigation/Pagination';
import './surfaces/Accordion';
import './surfaces/Paper';
import './layout/Box';
import './layout/Stack';
import './layout/Grid';
import './layout/Divider';
import './theme/ThemeProvider';

export { UIElement, register, registerAll } from './core';
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
export { UIThemeProvider } from './theme';

// --- Layout ───────────────────────────────────────────────────────────
export { UIBox, UIStack, UIGrid, UIDivider } from './layout';

// --- Inputs ───────────────────────────────────────────────────────────
export {
  UIButton,
  UITextField,
  UISelect,
  UICheckbox,
  UISwitch,
  UISlider,
} from './inputs';

// --- Data Display ─────────────────────────────────────────────────────
export {
  UIChip,
  UIBadge,
  UIAvatar,
  UITooltip,
  UICard,
  UIDataGrid,
} from './data-display';

// --- Feedback ─────────────────────────────────────────────────────────
export {
  UIAlert,
  UIDialog,
  UIProgress,
  UISkeleton,
  UIToast,
} from './feedback';

// --- Navigation ───────────────────────────────────────────────────────
export {
  UITabs,
  UITab,
  UITabPanel,
  UIDrawer,
  UIBreadcrumbs,
  UIPagination,
} from './navigation';

// --- Surfaces ─────────────────────────────────────────────────────────
export { UIAccordion, UIAccordionItem, UIPaper } from './surfaces';

// --- Utils ────────────────────────────────────────────────────────────
export { onMediaQuery, debounce, onClickOutside } from './utils';
