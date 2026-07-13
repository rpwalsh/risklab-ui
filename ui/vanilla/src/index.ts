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
import './inputs/Radio';
import './inputs/Textarea';
import './inputs/Autocomplete';
import './inputs/ToggleButton';
import './inputs/IconButton';
import './inputs/NumberInput';
import './inputs/Rating';
import './inputs/ButtonGroup';
import './inputs/TagInput';
import './inputs/OTPInput';
import './inputs/DropZone';
import './inputs/DateTimePicker';
import './inputs/FormControl';
import './inputs/SearchInput';
import './inputs/PasswordInput';
import './inputs/ColorInput';
import './data-display/Chip';
import './data-display/Badge';
import './data-display/Avatar';
import './data-display/Tooltip';
import './data-display/Card';
import './data-display/DataGrid';
import './data-display/List';
import './data-display/Table';
import './data-display/Timeline';
import './data-display/TreeView';
import './data-display/Typography';
import './data-display/AvatarGroup';
import './data-display/Callout';
import './data-display/ImageList';
import './data-display/VirtualList';
import './data-display/Stat';
import './data-display/Kbd';
import './data-display/DescriptionList';
import './data-display/DataGridAdvanced';
import './data-display/PivotGrid';
import './data-display/TreeGrid';
import './feedback/Alert';
import './feedback/Dialog';
import './feedback/Progress';
import './feedback/Skeleton';
import './feedback/Toast';
import './feedback/Backdrop';
import './feedback/EmptyState';
import './feedback/Snackbar';
import './navigation/Tabs';
import './navigation/Drawer';
import './navigation/Breadcrumbs';
import './navigation/Pagination';
import './navigation/AppBar';
import './navigation/Menu';
import './navigation/Popover';
import './navigation/Stepper';
import './navigation/CommandPalette';
import './navigation/ContextMenu';
import './navigation/SideNavigation';
import './navigation/BottomNavigation';
import './surfaces/Accordion';
import './surfaces/Paper';
import './surfaces/Collapse';
import './layout/Box';
import './layout/Stack';
import './layout/Grid';
import './layout/Divider';
import './layout/Container';
import './layout/Flex';
import './layout/Center';
import './layout/AspectRatio';
import './layout/ScrollArea';
import './layout/Masonry';
import './layout/SplitPane';
import './layout/ViewportLayout';
import './theme/ThemeProvider';
import './workbench/WorkbenchShell';
import './workbench/PanelLayout';
import './workbench/WorkbenchPanel';
import './workbench/QueryBar';
import './workbench/FilterBar';
import './workbench/TimeRangeControl';
import './workbench/EntityInspector';

export { UIElement, register, registerAll } from './core';
export { UI_COMPONENT_MANIFEST, UI_COMPONENT_TAGS, getUIComponentDefinition, listUIComponents } from './manifest';
export type { UIComponentDefinition, UIComponentFamily } from './manifest';
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
export type {
  SavedWorkbenchView,
  TimeWindow,
  WorkbenchAction,
  WorkbenchCompareState,
  WorkbenchFilterValue,
  WorkbenchPanelState,
  WorkbenchSelection,
  WorkbenchState,
  WorkbenchStore,
  WorkbenchThemeTokens,
  WorkbenchTone,
} from './workbench';

// --- Theme ────────────────────────────────────────────────────────────
export { UIThemeProvider } from './theme';
export {
  createInitialWorkbenchState,
  createSavedWorkbenchView,
  createWorkbenchStore,
  createWorkbenchThemeVars,
  darkWorkbenchTheme,
  highContrastWorkbenchTheme,
  lightWorkbenchTheme,
  parseSavedWorkbenchView,
  reduceWorkbenchState,
  resolveWorkbenchTheme,
  serializeSavedWorkbenchView,
} from './workbench';

// --- Layout ───────────────────────────────────────────────────────────
export { UIBox, UIStack, UIGrid, UIDivider, UIContainer, UIFlex, UICenter, UISpacer, UIAspectRatio, UIScrollArea, UIMasonry, UISplitPane, UIViewportLayout } from './layout';

// --- Inputs ───────────────────────────────────────────────────────────
export {
  UIButton,
  UITextField,
  UISelect,
  UICheckbox,
  UISwitch,
  UISlider,
  UIRadio,
  UIRadioGroup,
  UITextarea,
  UIAutocomplete,
  UIToggleButton,
  UIToggleButtonGroup,
  UIIconButton,
  UINumberInput,
  UIRating,
  UIButtonGroup,
  UITagInput,
  UIOTPInput,
  UIDropZone,
  UIDatePicker,
  UITimePicker,
  UIFormControl,
  UIFormLabel,
  UIFormHelper,
  UIFormError,
  UISearchInput,
  UIPasswordInput,
  UIColorInput,
} from './inputs';

// --- Data Display ─────────────────────────────────────────────────────
export {
  UIChip,
  UIBadge,
  UIAvatar,
  UITooltip,
  UICard,
  UIDataGrid,
  UIList,
  UIListItem,
  UITable,
  UITimeline,
  UITimelineItem,
  UITreeView,
  UITreeItem,
  UITypography,
  UIAvatarGroup,
  UICallout,
  UIImageList,
  UIVirtualList,
  UIStat,
  UIKbd,
  UICodeBlock,
  UIDescriptionList,
  UIDescriptionItem,
  UIDataGridAdvanced,
  UIPivotGrid,
  UITreeGrid,
} from './data-display';
export type { PivotGridConfig, PivotValueDefinition, TreeGridColumn, TreeGridRow } from './data-display';

// --- Feedback ─────────────────────────────────────────────────────────
export {
  UIAlert,
  UIDialog,
  UIProgress,
  UISkeleton,
  UIToast,
  UIBackdrop,
  UIEmptyState,
  UISnackbar,
} from './feedback';

// --- Navigation ───────────────────────────────────────────────────────
export {
  UITabs,
  UITab,
  UITabPanel,
  UIDrawer,
  UIBreadcrumbs,
  UIPagination,
  UIAppBar,
  UIToolbar,
  UIMenu,
  UIMenuItem,
  UIPopover,
  UIStepper,
  UIStep,
  UICommandPalette,
  UIContextMenu,
  UISideNavigation,
  UISideNavItem,
  UIBottomNavigation,
  UILink,
} from './navigation';

// --- Surfaces ─────────────────────────────────────────────────────────
export { UIAccordion, UIAccordionItem, UIPaper, UICollapse } from './surfaces';

// --- Utils ────────────────────────────────────────────────────────────
export { onMediaQuery, debounce, onClickOutside } from './utils';
