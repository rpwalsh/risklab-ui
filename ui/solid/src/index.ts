/**
 * @risklab/ui-solid
 *
 * SolidJS component library with fine-grained reactivity.
 * Same design token system as @risklab/charts and sibling UI packages.
 *
 * Usage:
 * ```tsx
 * import { Button, ThemeProvider } from '@risklab/ui-solid';
 * import '@risklab/ui-solid/css';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <Button variant="filled" color="primary">Click me</Button>
 *     </ThemeProvider>
 *   );
 * }
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
  CardProps,
  DataGridColumn,
  DataGridProps,
  AlertProps,
  DialogProps,
  ProgressProps,
  SkeletonProps,
  TabsProps,
  TabProps,
  TabPanelProps,
  DrawerProps,
  BreadcrumbsProps,
  PaginationProps,
  AccordionProps,
  AccordionItemProps,
  PaperProps,
  BoxProps,
  StackProps,
  GridProps,
  DividerProps,
  ToastOptions,
  ToastEntry,
} from './core';
export { colorVar, colorSubtleVar, sizeMap, avatarSizeMap } from './core';

// --- Theme ────────────────────────────────────────────────────────────
export { ThemeProvider, ThemeContext, useTheme } from './theme';
export type { ThemeContextValue, ThemeProviderProps } from './theme';

// --- Layout ───────────────────────────────────────────────────────────
export { Box, Stack, Grid, Divider } from './layout';

// --- Inputs ───────────────────────────────────────────────────────────
export { Button, TextField, Select, Checkbox, Switch, Slider } from './inputs';

// --- Data Display ─────────────────────────────────────────────────────
export { Chip, Badge, Avatar, Tooltip, Card, DataGrid } from './data-display';

// --- Feedback ─────────────────────────────────────────────────────────
export { Alert, Dialog, Progress, Skeleton, ToastProvider, useToast } from './feedback';
export type { ToastAPI, ToastProviderProps } from './feedback';

// --- Navigation ───────────────────────────────────────────────────────
export { Tabs, Tab, TabPanel, Drawer, Breadcrumbs, Pagination } from './navigation';
export type { TabsContextValue } from './navigation';

// --- Surfaces ─────────────────────────────────────────────────────────
export { Accordion, AccordionItem, Paper } from './surfaces';
export type { AccordionContextValue } from './surfaces';

// --- Utils ────────────────────────────────────────────────────────────
export { createMediaQuery, clickOutside, debounce } from './utils';
export * from './workbench';
