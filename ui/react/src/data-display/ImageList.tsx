import React, { forwardRef } from 'react';

export interface ImageListItemData {
  img: string;
  title?: string;
  subtitle?: string;
  cols?: number;
  rows?: number;
  featured?: boolean;
  href?: string;
  overlay?: React.ReactNode;
}

export interface ImageListProps {
  items: ImageListItemData[];
  variant?: 'standard' | 'quilted' | 'masonry' | 'woven';
  cols?: number;
  gap?: number;
  rowHeight?: number | 'auto';
  showTitle?: boolean;
  titlePosition?: 'below' | 'top' | 'bottom';
  renderItem?: (item: ImageListItemData, index: number) => React.ReactNode;
  onItemClick?: (item: ImageListItemData, index: number) => void;
  loading?: 'eager' | 'lazy';
  xstyle?: Record<string, string | number> | Array<Record<string, string | number> | false | null | undefined>;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

export const ImageList = forwardRef<HTMLDivElement, ImageListProps>(function ImageList(
  {
    items,
    variant = 'standard',
    cols = 3,
    gap = 8,
    rowHeight = 160,
    showTitle = false,
    titlePosition = 'below',
    renderItem,
    onItemClick,
    loading = 'lazy',
    xstyle,
    className,
    style,
    testId,
  },
  ref
) {
  const isMasonry = variant === 'masonry';

  // Grid layout properties are inherently dynamic (cols, gap)
  const containerStyle: React.CSSProperties = {
    ...(isMasonry
      ? { columnCount: cols, columnGap: `${gap}px` }
      : { gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${gap}px` }
    ),
    ...style,
    ...(xstyle && !Array.isArray(xstyle) ? xstyle as React.CSSProperties : {}),
  };

  return (
    <div
      ref={ref}
      className={['ui-image-list', `ui-image-list--${variant}`, className].filter(Boolean).join(' ')}
      data-testid={testId}
      style={containerStyle}
    >
      {items.map((item, idx) => {
        if (renderItem) return <React.Fragment key={idx}>{renderItem(item, idx)}</React.Fragment>;

        const colSpan = variant === 'quilted' && item.cols ? item.cols : 1;
        const rowSpan = variant === 'quilted' && item.rows ? item.rows : 1;
        const h = rowHeight === 'auto' ? 'auto' : `${(rowHeight as number) * rowSpan + gap * (rowSpan - 1)}px`;
        const isWoven = variant === 'woven';
        const wovenH = isWoven ? (idx % 2 === 0 ? `${(rowHeight as number) * 1.3}px` : `${rowHeight}px`) : h;

        // Dynamic grid span + height must be inline
        const itemDynamic: React.CSSProperties | undefined = isMasonry
          ? { marginBottom: `${gap}px` }
          : { gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}`, height: wovenH };

        const itemCls = [
          'ui-image-list-item',
          isMasonry && 'ui-image-list-item--masonry',
          onItemClick && 'ui-image-list-item--clickable',
        ].filter(Boolean).join(' ');

        const imgCls = ['ui-image-list-item__img', isMasonry && 'ui-image-list-item__img--masonry'].filter(Boolean).join(' ');

        const titleBarCls = [
          'ui-image-list-item__title-bar',
          isMasonry
            ? 'ui-image-list-item__title-bar--masonry'
            : [
                'ui-image-list-item__title-bar--overlay',
                titlePosition === 'top' ? 'ui-image-list-item__title-bar--overlay-top' : 'ui-image-list-item__title-bar--overlay-bottom',
              ].join(' '),
        ].filter(Boolean).join(' ');

        const el = (
          <div
            key={idx}
            className={itemCls}
            style={itemDynamic}
            onClick={() => onItemClick?.(item, idx)}
          >
            <img
              src={item.img}
              alt={item.title ?? `Image ${idx + 1}`}
              loading={loading}
              className={imgCls}
            />
            {item.overlay && (
              <div className="ui-image-list-item__overlay">
                {item.overlay}
              </div>
            )}
            {showTitle && item.title && (
              <div className={titleBarCls}>
                <p className="ui-image-list-item__title">{item.title}</p>
                {item.subtitle && (
                  <p className="ui-image-list-item__subtitle">{item.subtitle}</p>
                )}
              </div>
            )}
          </div>
        );

        return item.href ? (
          <a key={idx} href={item.href} className={['ui-image-list-item__link', isMasonry ? 'ui-image-list-item__link--masonry' : 'ui-image-list-item__link--grid'].filter(Boolean).join(' ')}>
            {el}
          </a>
        ) : el;
      })}
    </div>
  );
});
