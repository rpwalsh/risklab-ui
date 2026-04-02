import React, { forwardRef, useRef, useState, useCallback } from 'react';

export type ResizableDirection = 'horizontal' | 'vertical';

export interface ResizablePanelProps {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  size?: number;
  onResize?: (size: number) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export interface SplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ResizableDirection;
  defaultSizes?: [number, number];
  minSizes?: [number, number];
  sizes?: [number, number];
  onResize?: (sizes: [number, number]) => void;
  resizerSize?: number;
  resizerStyle?: React.CSSProperties;
  resizerClassName?: string;
  collapsible?: boolean;
  collapseThreshold?: number;
  children?: [React.ReactNode, React.ReactNode];
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

export const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(function SplitPane(
  {
    direction = 'horizontal',
    defaultSizes = [50, 50],
    minSizes = [10, 10],
    sizes: controlledSizes,
    onResize,
    resizerSize = 5,
    resizerStyle,
    resizerClassName,
    collapsible = false,
    collapseThreshold = 5,
    children,
    xstyle,
    testId,
    className,
    style,
    ...rest
  },
  ref
) {
  const [internalSizes, setInternalSizes] = useState<[number, number]>(defaultSizes);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startPos = useRef(0);
  const startSizes = useRef<[number, number]>([50, 50]);

  const sizes = controlledSizes !== undefined ? controlledSizes : internalSizes;
  const isHorizontal = direction === 'horizontal';

  const setSizes = useCallback((next: [number, number]) => {
    if (controlledSizes === undefined) setInternalSizes(next);
    onResize?.(next);
  }, [controlledSizes, onResize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startPos.current = isHorizontal ? e.clientX : e.clientY;
    startSizes.current = [...sizes] as [number, number];

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const container = containerRef.current;
      const totalPx = isHorizontal ? container.clientWidth : container.clientHeight;
      const delta = (isHorizontal ? ev.clientX : ev.clientY) - startPos.current;
      const deltaPct = (delta / totalPx) * 100;
      let a = startSizes.current[0] + deltaPct;
      let b = startSizes.current[1] - deltaPct;

      // Clamp
      const minA = minSizes[0], minB = minSizes[1];
      if (a < minA) { b += a - minA; a = minA; }
      if (b < minB) { a += b - minB; b = minB; }
      if (a + b > 100) { const excess = a + b - 100; a -= excess / 2; b -= excess / 2; }

      // Collapsible snapping
      if (collapsible) {
        if (a < collapseThreshold) {
          a = 0;
          b = 100;
        }
        if (b < collapseThreshold) {
          b = 0;
          a = 100;
        }
      }

      setSizes([Math.max(0, a), Math.max(0, b)]);
    };

    const onUp = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [isHorizontal, sizes, minSizes, collapsible, collapseThreshold, setSizes]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragging.current = true;
    startPos.current = isHorizontal ? touch.clientX : touch.clientY;
    startSizes.current = [...sizes] as [number, number];

    const onMove = (ev: TouchEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const t = ev.touches[0];
      const container = containerRef.current;
      const totalPx = isHorizontal ? container.clientWidth : container.clientHeight;
      const delta = (isHorizontal ? t.clientX : t.clientY) - startPos.current;
      const deltaPct = (delta / totalPx) * 100;
      const a = Math.max(minSizes[0], startSizes.current[0] + deltaPct);
      const b = Math.max(minSizes[1], startSizes.current[1] - deltaPct);
      setSizes([a, b]);
    };
    const onEnd = () => {
      dragging.current = false;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  }, [isHorizontal, sizes, minSizes, setSizes]);

  const userStyle = (() => {
    let s: Record<string, unknown> = {};
    if (style) { s = { ...s, ...style }; }
    if (xstyle && !Array.isArray(xstyle)) { s = { ...s, ...xstyle }; }
    return Object.keys(s).length > 0 ? s : undefined;
  })();

  return (
    <div
      ref={(node) => {
        if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={['ui-split-pane', `ui-split-pane--${direction}`, className].filter(Boolean).join(' ')}
      data-testid={testId}
      {...(userStyle ? { style: userStyle as React.CSSProperties } : undefined)}
      {...rest}
    >
      {/* First pane */}
      <div
        className="ui-split-pane__panel"
        style={isHorizontal ? { width: `${sizes[0]}%`, minWidth: `${minSizes[0]}%` } : { height: `${sizes[0]}%`, minHeight: `${minSizes[0]}%` }}
      >
        {children?.[0]}
      </div>

      {/* Resizer */}
      <div
        role="separator"
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={sizes[0]}
        aria-valuemin={minSizes[0]}
        aria-valuemax={100 - minSizes[1]}
        tabIndex={0}
        className={['ui-split-pane__resizer', resizerClassName].filter(Boolean).join(' ')}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={(e) => {
          const step = 2;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setSizes([Math.max(minSizes[0], sizes[0] - step), Math.min(100 - minSizes[1], sizes[1] + step)]); }
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setSizes([Math.min(100 - minSizes[1], sizes[0] + step), Math.max(minSizes[1], sizes[1] - step)]); }
        }}
        style={{
          ...(isHorizontal ? { width: `${resizerSize}px` } : { height: `${resizerSize}px` }),
          ...resizerStyle,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ui-color-primary-light, #bfdbfe)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ui-color-border, #e2e8f0)'; }}
        onFocus={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ui-color-primary, #3b82f6)'; }}
        onBlur={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ui-color-border, #e2e8f0)'; }}
      >
        {/* Drag handle dots */}
        <span
          aria-hidden="true"
          className="ui-split-pane__dots"
        >
          {[0, 1, 2].map(i => (
            <span key={i} className="ui-split-pane__dot" />
          ))}
        </span>
      </div>

      {/* Second pane */}
      <div
        className="ui-split-pane__panel ui-split-pane__panel--second"
        style={isHorizontal ? { minWidth: `${minSizes[1]}%` } : { minHeight: `${minSizes[1]}%` }}
      >
        {children?.[1]}
      </div>
    </div>
  );
});
