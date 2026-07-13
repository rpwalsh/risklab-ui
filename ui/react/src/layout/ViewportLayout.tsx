import {
  createContext,
  forwardRef,
  useContext,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../styling/cx';
import { Grid, GridItem, type GridProps, type GridItemProps } from './Grid';
import {
  getViewportLayoutPreset,
  type ViewportLayoutAreaDefinition,
  type ViewportLayoutPreset,
  type ViewportLayoutPresetId,
} from './layoutPresets';

const ViewportLayoutContext = createContext<ViewportLayoutPreset | null>(null);

function resolveViewportLayoutPreset(
  preset: ViewportLayoutPresetId | ViewportLayoutPreset,
): ViewportLayoutPreset {
  return typeof preset === 'string'
    ? getViewportLayoutPreset(preset)
    : preset;
}

function sizeValue(value: string | number | undefined): string | number | undefined {
  if (typeof value === 'number') return `${value}px`;
  return value;
}

function areaStyle(area: ViewportLayoutAreaDefinition): CSSProperties {
  return {
    gridColumn: area.column,
    gridRow: area.row,
    overflow: area.overflow ?? 'hidden',
    minHeight: sizeValue(area.minHeight) ?? 0,
  };
}

function parsePlacement(
  value: string | undefined,
): { start?: string; end?: string; span?: string } {
  if (!value) return {};
  const [startRaw, endRaw] = value.split('/').map((part) => part.trim());
  const start = startRaw || undefined;
  if (!endRaw) return { start };
  if (endRaw.startsWith('span ')) {
    return { start, span: endRaw.slice(5).trim() };
  }
  return { start, end: endRaw };
}

export interface ViewportLayoutProps extends Omit<GridProps, 'templateColumns' | 'templateRows' | 'gap'> {
  preset: ViewportLayoutPresetId | ViewportLayoutPreset;
  viewportHeight?: string | number;
  gap?: GridProps['gap'];
}

export const ViewportLayout = forwardRef<HTMLDivElement, ViewportLayoutProps>(
  function ViewportLayout(
    {
      preset,
      viewportHeight = '100%',
      gap,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const resolvedPreset = resolveViewportLayoutPreset(preset);

    return (
      <ViewportLayoutContext.Provider value={resolvedPreset}>
        <Grid
          ref={ref}
          {...rest}
          className={cx('ui-viewport-layout', className)}
          templateColumns={resolvedPreset.columns}
          templateRows={resolvedPreset.rows}
          gap={gap ?? resolvedPreset.gap}
          style={{
            height: sizeValue(viewportHeight),
            minHeight: sizeValue(resolvedPreset.minHeight) ?? 0,
            ...style,
          }}
        >
          {children}
        </Grid>
      </ViewportLayoutContext.Provider>
    );
  },
);

export interface ViewportLayoutAreaProps
  extends Omit<GridItemProps, 'style' | 'gridColumn' | 'gridRow'> {
  area: string;
  preset?: ViewportLayoutPresetId | ViewportLayoutPreset;
  scroll?: 'hidden' | 'auto' | 'visible';
  style?: CSSProperties;
  children?: ReactNode;
}

export const ViewportLayoutArea = forwardRef<HTMLDivElement, ViewportLayoutAreaProps>(
  function ViewportLayoutArea(
    {
      area,
      preset,
      scroll,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const contextPreset = useContext(ViewportLayoutContext);
    const resolvedPreset = preset
      ? resolveViewportLayoutPreset(preset)
      : contextPreset;

    const areaDefinition = resolvedPreset?.areas[area];
    const columnPlacement = parsePlacement(areaDefinition?.column);
    const rowPlacement = parsePlacement(areaDefinition?.row);

    return (
      <GridItem
        ref={ref}
        {...rest}
        className={cx('ui-viewport-layout__area', className)}
        colStart={columnPlacement.start}
        colEnd={columnPlacement.end}
        colSpan={columnPlacement.span}
        rowStart={rowPlacement.start}
        rowEnd={rowPlacement.end}
        rowSpan={rowPlacement.span}
        style={{
          ...(areaDefinition ? areaStyle(areaDefinition) : undefined),
          overflow: scroll ?? areaDefinition?.overflow ?? 'hidden',
          minHeight: 0,
          ...style,
        }}
        data-viewport-area={area}
        data-viewport-preset={resolvedPreset?.id}
      >
        {children}
      </GridItem>
    );
  },
);
