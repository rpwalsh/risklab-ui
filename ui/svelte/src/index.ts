// @risklab/ui-svelte — main barrel export
// All Svelte 5 components, utilities, and types

// Theme
export { default as ThemeProvider } from './theme/ThemeProvider.svelte';
export { getThemeContext } from './theme/useTheme';

// Inputs
export { default as Button } from './inputs/Button.svelte';
export { default as TextField } from './inputs/TextField.svelte';
export { default as Select } from './inputs/Select.svelte';
export { default as Checkbox } from './inputs/Checkbox.svelte';
export { default as Switch } from './inputs/Switch.svelte';
export { default as Slider } from './inputs/Slider.svelte';

// Data Display
export { default as Chip } from './data-display/Chip.svelte';
export { default as Badge } from './data-display/Badge.svelte';
export { default as Avatar } from './data-display/Avatar.svelte';
export { default as Tooltip } from './data-display/Tooltip.svelte';
export { default as Card } from './data-display/Card.svelte';
export { default as DataGrid } from './data-display/DataGrid.svelte';

// Feedback
export { default as Alert } from './feedback/Alert.svelte';
export { default as Dialog } from './feedback/Dialog.svelte';
export { default as Progress } from './feedback/Progress.svelte';
export { default as Skeleton } from './feedback/Skeleton.svelte';
export { default as Toast } from './feedback/Toast.svelte';
export { default as ToastContainer } from './feedback/Toast.svelte';
export { toast, toastStore } from './feedback/toast';

// Navigation
export { default as Tabs } from './navigation/Tabs.svelte';
export { default as Tab } from './navigation/Tab.svelte';
export { default as TabPanel } from './navigation/TabPanel.svelte';
export { default as Drawer } from './navigation/Drawer.svelte';
export { default as Breadcrumbs } from './navigation/Breadcrumbs.svelte';
export { default as Pagination } from './navigation/Pagination.svelte';

// Surfaces
export { default as Accordion } from './surfaces/Accordion.svelte';
export { default as AccordionItem } from './surfaces/AccordionItem.svelte';
export { default as Paper } from './surfaces/Paper.svelte';

// Layout
export { default as Box } from './layout/Box.svelte';
export { default as Stack } from './layout/Stack.svelte';
export { default as Grid } from './layout/Grid.svelte';
export { default as Divider } from './layout/Divider.svelte';

// Utilities
export { mediaQuery, clickOutside, debounce, clamp } from './utils/index';

// Types
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
} from './core/types';
