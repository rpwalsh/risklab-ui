import React, { forwardRef, useCallback, useMemo } from 'react';
import type { ColorVariant } from '../styling/types';
import { cx, sx } from '../styling';

export interface TreeItemData {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: TreeItemData[];
  disabled?: boolean;
  href?: string;
}

export interface TreeViewProps {
  data: TreeItemData[];
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selected?: string | string[];
  defaultSelected?: string | string[];
  onSelectedChange?: (ids: string | string[]) => void;
  multiSelect?: boolean;
  checkboxSelection?: boolean;
  disableSelection?: boolean;
  dense?: boolean;
  color?: ColorVariant;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  defaultExpansionDepth?: number;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

interface TreeItemProps {
  item: TreeItemData;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string, e: React.MouseEvent) => void;
  dense: boolean;
  color: string;
  expandIcon: React.ReactNode;
  collapseIcon: React.ReactNode;
  disableSelection: boolean;
  checkboxSelection: boolean;
  expandedIds: Set<string>;
  selectedIds: Set<string>;
}

function TreeItemNode({
  item, level, isExpanded, isSelected, onToggle, onSelect,
  dense, color, expandIcon, collapseIcon, disableSelection, checkboxSelection,
  expandedIds, selectedIds,
}: TreeItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const indent = level * 20;
  const rowH = dense ? 28 : 36;
  const labelText = typeof item.label === 'string' ? item.label : `Tree item ${item.id}`;
  const itemSx = sx({ listStyle: 'none' });
  const rowSx = sx({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    paddingLeft: `${indent + 4}px`,
    paddingRight: '8px',
    height: `${rowH}px`,
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--ui-radius-sm, 4px)',
    background: isSelected ? `color-mix(in srgb, var(--ui-color-${color}, var(--ui-color-primary)) 10%, transparent)` : 'transparent',
    color: item.disabled ? 'var(--ui-color-text-disabled)' : 'var(--ui-color-text)',
    fontSize: dense ? 'var(--ui-text-xs, 12px)' : 'var(--ui-text-sm, 14px)',
    fontWeight: isSelected ? 500 : 400,
    outline: 'none',
    userSelect: 'none',
    transition: 'background var(--ui-transition-fast)',
    opacity: item.disabled ? 0.5 : 1,
  });
  const expanderSx = sx({ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--ui-color-text-secondary)', fontSize: '10px' });
  const checkboxSx = sx({ margin: 0, accentColor: `var(--ui-color-${color}, var(--ui-color-primary))` });
  const iconSx = sx({ fontSize: dense ? '14px' : '16px', flexShrink: 0, color: isSelected ? `var(--ui-color-${color}, var(--ui-color-primary))` : 'var(--ui-color-text-secondary)' });
  const labelSx = sx({ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
  const linkSx = sx({ color: 'inherit', textDecoration: 'none' });
  const endIconSx = sx({ flexShrink: 0, color: 'var(--ui-color-text-secondary)', fontSize: '14px' });
  const groupSx = sx({ margin: 0, padding: 0, overflow: 'hidden', animation: 'ui-slide-down 0.15s ease' });

  const content = (
    <>
      <span className={cx('ui-tree-view__expander', expanderSx.className)}>
        {hasChildren ? (isExpanded ? (collapseIcon ?? '▾') : (expandIcon ?? '▸')) : null}
      </span>
      {checkboxSelection && (
        <input
          type="checkbox"
          checked={isSelected}
          disabled={item.disabled}
          aria-label={`Select ${labelText}`}
          onChange={() => {}}
          onClick={(e) => e.stopPropagation()}
          className={cx('ui-tree-view__checkbox', checkboxSx.className)}
        />
      )}
      {item.icon && (
        <span className={cx('ui-tree-view__icon', iconSx.className)}>
          {item.icon}
        </span>
      )}
      <span className={cx('ui-tree-view__label', labelSx.className)}>
        {item.href ? (
          <a href={item.href} className={cx('ui-tree-view__link', linkSx.className)} onClick={(e) => e.stopPropagation()}>
            {item.label}
          </a>
        ) : item.label}
      </span>
      {item.endIcon && <span className={cx('ui-tree-view__end-icon', endIconSx.className)}>{item.endIcon}</span>}
    </>
  );

  const interactiveRow = hasChildren ? (
    <div
      onClick={(e) => { if (item.disabled) return; onToggle(item.id); onSelect(item.id, e); }}
      onKeyDown={(e) => {
        if (item.disabled) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(item.id); onSelect(item.id, e as unknown as React.MouseEvent); }
        if (e.key === 'ArrowRight' && !isExpanded) onToggle(item.id);
        if (e.key === 'ArrowLeft' && isExpanded) onToggle(item.id);
      }}
      tabIndex={item.disabled ? -1 : 0}
      className={cx('ui-tree-view__item', rowSx.className)}
    >
      {content}
    </div>
  ) : (
    <div
      onClick={(e) => { if (item.disabled) return; onSelect(item.id, e); }}
      onKeyDown={(e) => {
        if (item.disabled) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(item.id, e as unknown as React.MouseEvent); }
      }}
      tabIndex={item.disabled ? -1 : 0}
      className={cx('ui-tree-view__item', rowSx.className)}
    >
      {content}
    </div>
  );

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? (isExpanded ? 'true' : 'false') : undefined}
      aria-selected={isSelected ? 'true' : 'false'}
      className={cx('ui-tree-view__item-wrap', itemSx.className)}
    >
      {interactiveRow}
      {hasChildren && isExpanded && (
        <ul role="group" className={cx('ui-tree-view__group', groupSx.className)}>
          {item.children!.map(child => (
            <TreeItemNode
              key={child.id}
              item={child}
              level={level + 1}
              isExpanded={expandedIds.has(child.id)}
              isSelected={selectedIds.has(child.id)}
              onToggle={onToggle}
              onSelect={onSelect}
              dense={dense}
              color={color}
              expandIcon={expandIcon}
              collapseIcon={collapseIcon}
              disableSelection={disableSelection}
              checkboxSelection={checkboxSelection}
              expandedIds={expandedIds}
              selectedIds={selectedIds}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function getIds(items: TreeItemData[], depth: number, current = 0): string[] {
  if (current >= depth) return [];
  const ids: string[] = [];
  for (const item of items) {
    if (item.children?.length) {
      ids.push(item.id);
      ids.push(...getIds(item.children, depth, current + 1));
    }
  }
  return ids;
}

export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  {
    data,
    expanded: controlledExpanded,
    defaultExpanded,
    onExpandedChange,
    selected: controlledSelected,
    defaultSelected,
    onSelectedChange,
    multiSelect = false,
    checkboxSelection = false,
    disableSelection = false,
    dense = false,
    color = 'primary',
    expandIcon,
    collapseIcon,
    defaultExpansionDepth = 0,
    xstyle,
    className,
    style,
    testId,
  },
  ref
) {
  const defaultExpandedIds = defaultExpanded ?? (defaultExpansionDepth > 0 ? getIds(data, defaultExpansionDepth) : []);
  const [internalExpanded, setInternalExpanded] = React.useState<string[]>(defaultExpandedIds);
  const [internalSelected, setInternalSelected] = React.useState<string[]>(
    defaultSelected ? (Array.isArray(defaultSelected) ? defaultSelected : [defaultSelected]) : []
  );

  const expandedArr = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const selectedArr = useMemo(
    () => (controlledSelected !== undefined
      ? (Array.isArray(controlledSelected) ? controlledSelected : [controlledSelected])
      : internalSelected),
    [controlledSelected, internalSelected]
  );
  const expandedIds = useMemo(() => new Set(expandedArr), [expandedArr]);
  const selectedIds = useMemo(() => new Set(selectedArr), [selectedArr]);
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;
  const rootSx = sx({
    margin: 0,
    padding: '4px',
    listStyle: 'none',
    ...(style as Record<string, string | number> | undefined),
    ...(mergedExternalStyles as Record<string, string | number> | undefined),
  });

  const handleToggle = useCallback((id: string) => {
    const next = expandedIds.has(id)
      ? expandedArr.filter(e => e !== id)
      : [...expandedArr, id];
    if (controlledExpanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  }, [expandedArr, expandedIds, controlledExpanded, onExpandedChange]);

  const handleSelect = useCallback((id: string, e: React.MouseEvent) => {
    if (disableSelection) return;
    let next: string[];
    if (multiSelect || checkboxSelection) {
      next = selectedIds.has(id)
        ? selectedArr.filter(s => s !== id)
        : e.shiftKey || checkboxSelection ? [...selectedArr, id] : [id];
    } else {
      next = selectedIds.has(id) ? [] : [id];
    }
    if (controlledSelected === undefined) setInternalSelected(next);
    onSelectedChange?.(multiSelect || checkboxSelection ? next : (next[0] ?? ''));
  }, [disableSelection, multiSelect, checkboxSelection, selectedArr, selectedIds, controlledSelected, onSelectedChange]);

  const treeChildren = data.map(item => (
    <TreeItemNode
      key={item.id}
      item={item}
      level={0}
      isExpanded={expandedIds.has(item.id)}
      isSelected={selectedIds.has(item.id)}
      onToggle={handleToggle}
      onSelect={handleSelect}
      dense={dense}
      color={color}
      expandIcon={expandIcon}
      collapseIcon={collapseIcon}
      disableSelection={disableSelection}
      checkboxSelection={checkboxSelection}
      expandedIds={expandedIds}
      selectedIds={selectedIds}
    />
  ));

  return multiSelect ? (
    <ul
      ref={ref}
      role="tree"
      aria-multiselectable="true"
      className={cx('ui-tree-view', className, rootSx.className)}
      data-testid={testId}
    >
      {treeChildren}
    </ul>
  ) : (
    <ul
      ref={ref}
      role="tree"
      className={cx('ui-tree-view', className, rootSx.className)}
      data-testid={testId}
    >
      {treeChildren}
    </ul>
  );
});
