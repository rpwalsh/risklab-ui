import React, { forwardRef, useRef } from 'react';
import { cx, sx } from '../styling';

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of masonry columns. */
  columns?: number;
  gap?: number;
  sequential?: boolean;
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  testId?: string;
}

export const Masonry = forwardRef<HTMLDivElement, MasonryProps>(function Masonry(
  {
    children,
    columns = 3,
    gap = 16,
    sequential = false,
    xstyle,
    testId,
    className,
    style,
    ...rest
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cols = columns;
  const mergedExternalStyles = Array.isArray(xstyle)
    ? xstyle.reduce<Record<string, string | number>>((acc, entry) => (entry ? { ...acc, ...entry } : acc), {})
    : xstyle;

  // CSS columns-based masonry
  const containerStyle: Record<string, string | number | null> = {
    columnCount: sequential ? null : cols,
    columnGap: sequential ? null : `${gap}px`,
    ...(style as Record<string, string | number> | undefined),
    ...(mergedExternalStyles as Record<string, string | number> | undefined),
  };

  if (sequential) {
    // Flexbox column-fill approach — distributes items across N columns sequentially
    const childArr = React.Children.toArray(children);
    const colArrays: React.ReactNode[][] = Array.from({ length: cols }, () => []);
    childArr.forEach((child, i) => colArrays[i % cols].push(child));

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cx('ui-masonry', 'ui-masonry--sequential', className, sx({
          display: 'flex',
          gap: `${gap}px`,
          alignItems: 'flex-start',
          ...(style as Record<string, string | number> | undefined),
          ...(mergedExternalStyles as Record<string, string | number> | undefined),
        }).className)}
        data-testid={testId}
        {...rest}
      >
        {colArrays.map((col, ci) => (
          <div key={ci} className={sx({ flex: 1, display: 'flex', flexDirection: 'column', gap: `${gap}px` }).className}>
            {col}
          </div>
        ))}
      </div>
    );
  }

  // CSS columns masonry — preserves item aspect ratios, items fill top-to-bottom
  return (
    <div
      ref={(node) => {
        if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cx('ui-masonry', className, sx(containerStyle).className)}
      data-testid={testId}
      {...rest}
    >
      {React.Children.map(children, (child) => (
        <div className={sx({ breakInside: 'avoid', marginBottom: `${gap}px`, display: 'block' }).className}>
          {child}
        </div>
      ))}
    </div>
  );
});
