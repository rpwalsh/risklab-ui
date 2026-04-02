import React, { forwardRef, useRef, useCallback, useEffect, useState } from 'react';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number | string;
  maxWidth?: number | string;
  scrollbars?: 'both' | 'vertical' | 'horizontal' | 'none';
  hideDelay?: number;
  scrollbarSize?: number;
  thumbColor?: string;
  trackColor?: string;
  always?: boolean;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  {
    children,
    maxHeight,
    maxWidth,
    scrollbars = 'vertical',
    hideDelay = 1200,
    scrollbarSize = 6,
    thumbColor = 'var(--ui-color-text-secondary, rgba(0,0,0,0.3))',
    trackColor = 'transparent',
    always = false,
    xstyle,
    testId,
    className,
    style,
    ...rest
  },
  ref
) {
  const [showX, setShowX] = useState(always);
  const [showY, setShowY] = useState(always);
  const [thumbY, setThumbY] = useState({ top: 0, height: 0 });
  const [thumbX, setThumbX] = useState({ left: 0, width: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggingY = useRef(false);
  const draggingX = useRef(false);
  const dragStart = useRef({ y: 0, x: 0, scrollTop: 0, scrollLeft: 0 });

  const canScrollY = scrollbars === 'both' || scrollbars === 'vertical';
  const canScrollX = scrollbars === 'both' || scrollbars === 'horizontal';

  const updateThumbs = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    if (canScrollY) {
      const ratio = el.clientHeight / el.scrollHeight;
      setThumbY({ top: (el.scrollTop / el.scrollHeight) * el.clientHeight, height: Math.max(28, ratio * el.clientHeight) });
      setShowY(always || el.scrollHeight > el.clientHeight + 2);
    }
    if (canScrollX) {
      const ratio = el.clientWidth / el.scrollWidth;
      setThumbX({ left: (el.scrollLeft / el.scrollWidth) * el.clientWidth, width: Math.max(28, ratio * el.clientWidth) });
      setShowX(always || el.scrollWidth > el.clientWidth + 2);
    }
  }, [canScrollY, canScrollX, always]);

  useEffect(() => { updateThumbs(); }, [updateThumbs, children]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateThumbs);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateThumbs]);

  const handleScroll = useCallback(() => {
    updateThumbs();
    if (!always) {
      setShowY(true);
      setShowX(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        const el = viewportRef.current;
        if (!el) return;
        setShowY(el.scrollHeight > el.clientHeight + 2);
        setShowX(el.scrollWidth > el.clientWidth + 2);
      }, hideDelay);
    }
  }, [updateThumbs, always, hideDelay]);

  // Cleanup hide timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Track active listeners for cleanup on unmount
  const cleanupFnsRef = useRef<Array<() => void>>([]);
  useEffect(() => {
    return () => { cleanupFnsRef.current.forEach(fn => fn()); };
  }, []);

  // Drag Y
  const startDragY = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = viewportRef.current!;
    draggingY.current = true;
    dragStart.current = { y: e.clientY, x: 0, scrollTop: el.scrollTop, scrollLeft: 0 };
    const onMove = (ev: MouseEvent) => {
      if (!draggingY.current) return;
      const dy = ev.clientY - dragStart.current.y;
      const ratio = el.scrollHeight / el.clientHeight;
      el.scrollTop = dragStart.current.scrollTop + dy * ratio;
    };
    const onUp = () => {
      draggingY.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      cleanupFnsRef.current = cleanupFnsRef.current.filter(fn => fn !== cleanup);
    };
    const cleanup = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    cleanupFnsRef.current.push(cleanup);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  // Drag X
  const startDragX = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = viewportRef.current!;
    draggingX.current = true;
    dragStart.current = { x: e.clientX, y: 0, scrollTop: 0, scrollLeft: el.scrollLeft };
    const onMove = (ev: MouseEvent) => {
      if (!draggingX.current) return;
      const dx = ev.clientX - dragStart.current.x;
      const ratio = el.scrollWidth / el.clientWidth;
      el.scrollLeft = dragStart.current.scrollLeft + dx * ratio;
    };
    const onUp = () => {
      draggingX.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      cleanupFnsRef.current = cleanupFnsRef.current.filter(fn => fn !== cleanup);
    };
    const cleanup = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    cleanupFnsRef.current.push(cleanup);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  const outerStyle: React.CSSProperties | undefined = (maxHeight !== undefined || maxWidth !== undefined || style || (xstyle && !Array.isArray(xstyle)))
    ? {
        ...(maxHeight !== undefined ? { maxHeight } : undefined),
        ...(maxWidth !== undefined ? { maxWidth } : undefined),
        ...style,
        ...(xstyle && !Array.isArray(xstyle) ? xstyle as React.CSSProperties : {}),
      }
    : undefined;

  return (
    <div
      ref={ref}
      className={['ui-scroll-area', className].filter(Boolean).join(' ')}
      data-testid={testId}
      {...(outerStyle ? { style: outerStyle } : undefined)}
      {...rest}
    >
      <div
        ref={viewportRef}
        className="ui-scroll-area__viewport"
        onScroll={handleScroll}
        data-scroll-y={canScrollY ? 'scroll' : 'hidden'}
        data-scroll-x={canScrollX ? 'scroll' : 'hidden'}
      >
        {children}
      </div>

      {/* Vertical scrollbar */}
      {canScrollY && showY && (
        <div
          aria-hidden="true"
          className="ui-scroll-area__track"
          style={{
            top: 0,
            right: 0,
            width: `${scrollbarSize + 4}px`,
            height: '100%',
            background: trackColor,
            borderRadius: `${scrollbarSize}px`,
            opacity: showY ? 1 : 0,
          }}
        >
          <div
            className="ui-scroll-area__thumb"
            onMouseDown={startDragY}
            style={{
              right: 0,
              top: `${thumbY.top}px`,
              width: `${scrollbarSize}px`,
              height: `${thumbY.height}px`,
              background: thumbColor,
              borderRadius: `${scrollbarSize}px`,
            }}
          />
        </div>
      )}

      {/* Horizontal scrollbar */}
      {canScrollX && showX && (
        <div
          aria-hidden="true"
          className="ui-scroll-area__track"
          style={{
            bottom: 0,
            left: 0,
            height: `${scrollbarSize + 4}px`,
            width: '100%',
            background: trackColor,
            borderRadius: `${scrollbarSize}px`,
            opacity: showX ? 1 : 0,
          }}
        >
          <div
            className="ui-scroll-area__thumb"
            onMouseDown={startDragX}
            style={{
              bottom: 0,
              left: `${thumbX.left}px`,
              height: `${scrollbarSize}px`,
              width: `${thumbX.width}px`,
              background: thumbColor,
              borderRadius: `${scrollbarSize}px`,
            }}
          />
        </div>
      )}
    </div>
  );
});
