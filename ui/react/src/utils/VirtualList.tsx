import React, { forwardRef, useRef, useState, useLayoutEffect, useCallback, useMemo } from 'react';

export interface VirtualListProps<T = unknown> {
  items: T[];
  rowHeight: number | ((item: T, index: number) => number);
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  height: number | string;
  overscan?: number;
  getItemKey?: (item: T, index: number) => React.Key;
  onScrollEnd?: () => void;
  scrollToIndex?: number;
  scrollAlignment?: 'start' | 'center' | 'end' | 'auto';
  className?: string;
  style?: React.CSSProperties;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VirtualList = forwardRef<HTMLDivElement, VirtualListProps<any>>(function VirtualList<T = unknown>(
  {
    items,
    rowHeight,
    renderItem,
    height,
    overscan = 5,
    getItemKey,
    onScrollEnd,
    scrollToIndex,
    scrollAlignment = 'auto',
    className,
    style,
    xstyle,
    testId,
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const endNotifiedRef = useRef(false);

  // Compute heights and offsets
  const isFixed = typeof rowHeight === 'number';
  const measurements = useMemo(() => {
    if (isFixed) return { heights: null, offsets: null, totalHeight: items.length * (rowHeight as number) };
    const heights = items.map((item, index) => Math.max(0, (rowHeight as (item: T, index: number) => number)(item, index)));
    let runningOffset = 0;
    const offsets = heights.map((heightValue) => {
      const offset = runningOffset;
      runningOffset += heightValue;
      return offset;
    });
    return { heights, offsets, totalHeight: runningOffset };
  }, [isFixed, items, rowHeight]);
  const { heights, offsets, totalHeight } = measurements;

  const getOffset = useCallback((idx: number) => isFixed ? idx * (rowHeight as number) : offsets![idx] ?? 0, [isFixed, rowHeight, offsets]);
  const getHeight = useCallback((idx: number) => isFixed ? rowHeight as number : heights![idx], [isFixed, rowHeight, heights]);

  // Find visible range
  const findStart = useCallback(() => {
    if (isFixed) return Math.max(0, Math.floor(scrollTop / (rowHeight as number)) - overscan);
    let lo = 0, hi = items.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (offsets![mid]! + heights![mid]! <= scrollTop) lo = mid + 1; else hi = mid;
    }
    return Math.max(0, lo - overscan);
  }, [isFixed, rowHeight, scrollTop, overscan, offsets, items.length]);

  const findEnd = useCallback((start: number) => {
    if (isFixed) return Math.min(items.length, Math.ceil((scrollTop + containerHeight) / (rowHeight as number)) + overscan);
    let end = start;
    while (end < items.length && getOffset(end) < scrollTop + containerHeight) end++;
    return Math.min(items.length, end + overscan);
  }, [isFixed, rowHeight, scrollTop, containerHeight, overscan, getOffset, items.length]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof ResizeObserver === 'undefined') {
      setContainerHeight(el.clientHeight);
      return;
    }
    const ro = new ResizeObserver(() => setContainerHeight(el.clientHeight));
    ro.observe(el);
    setContainerHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (scrollToIndex == null || !containerRef.current) return;
    const index = Math.max(0, Math.min(items.length - 1, scrollToIndex));
    const start = getOffset(index);
    const end = start + getHeight(index);
    const viewportStart = containerRef.current.scrollTop;
    const viewportEnd = viewportStart + containerRef.current.clientHeight;
    if (scrollAlignment === 'auto' && start >= viewportStart && end <= viewportEnd) return;
    const target = scrollAlignment === 'center'
      ? start - (containerRef.current.clientHeight - getHeight(index)) / 2
      : scrollAlignment === 'end'
        ? end - containerRef.current.clientHeight
        : start;
    containerRef.current.scrollTop = Math.max(0, target);
  }, [scrollToIndex, scrollAlignment, items.length, getOffset, getHeight]);

  const start = findStart();
  const end = findEnd(start);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setScrollTop(el.scrollTop);
    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    if (atEnd && !endNotifiedRef.current) onScrollEnd?.();
    endNotifiedRef.current = atEnd;
  }, [onScrollEnd]);

  return (
    <div
      ref={(node) => {
        if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      role="list"
      className={['ui-virtual-list', className].filter(Boolean).join(' ')}
      data-testid={testId}
      onScroll={handleScroll}
      style={{
        height,
        overflowY: 'auto',
        position: 'relative',
        willChange: 'transform',
        ...style,
        ...(xstyle && !Array.isArray(xstyle) ? xstyle as React.CSSProperties : {}),
      }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative', width: '100%' }}>
        {items.slice(start, end).map((item, relIdx) => {
          const absIdx = start + relIdx;
          const itemStyle: React.CSSProperties = {
            position: 'absolute',
            top: `${getOffset(absIdx)}px`,
            height: `${getHeight(absIdx)}px`,
            width: '100%',
            overflow: 'hidden',
          };
          return (
            <div role="listitem" key={getItemKey ? getItemKey(item, absIdx) : absIdx}>
              {renderItem(item, absIdx, itemStyle)}
            </div>
          );
        })}
      </div>
    </div>
  );
}) as <T = unknown>(props: VirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) => React.ReactElement;
