/**
 * @risklab/ui-solid — Pagination
 * SolidJS pagination with smart page range, sibling/boundary counts.
 */

import { mergeProps, splitProps, createMemo, For, type Component } from 'solid-js';
import type { PaginationProps } from '../core/types';

export const Pagination: Component<PaginationProps> = (rawProps) => {
  const props = mergeProps(
    {
      count: 1,
      page: 1,
      siblingCount: 1,
      boundaryCount: 1,
      size: 'md' as const,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'count',
    'page',
    'onChange',
    'siblingCount',
    'boundaryCount',
    'size',
    'class',
    'style',
  ]);

  const btnSize = (): string => {
    const m: Record<string, string> = { xs: '24px', sm: '28px', md: '36px', lg: '44px', xl: '52px' };
    return m[local.size] ?? '36px';
  };

  const fontSize = (): string => {
    const m: Record<string, string> = { xs: '11px', sm: '12px', md: '14px', lg: '16px', xl: '18px' };
    return m[local.size] ?? '14px';
  };

  /** Build the page range with ellipses */
  const range = createMemo(() => {
    const total = local.count;
    const current = local.page;
    const sibs = local.siblingCount;
    const boundary = local.boundaryCount;

    const items: (number | 'ellipsis')[] = [];

    // Start boundary
    for (let i = 1; i <= Math.min(boundary, total); i++) items.push(i);

    const sibStart = Math.max(boundary + 1, current - sibs);
    const sibEnd = Math.min(total - boundary, current + sibs);

    if (sibStart > boundary + 1) items.push('ellipsis');

    for (let i = sibStart; i <= sibEnd; i++) {
      if (!items.includes(i)) items.push(i);
    }

    if (sibEnd < total - boundary) items.push('ellipsis');

    // End boundary
    for (let i = Math.max(total - boundary + 1, 1); i <= total; i++) {
      if (!items.includes(i)) items.push(i);
    }

    return items;
  });

  const baseBtnStyle = (): Record<string, string> => ({
    display: 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    width: btnSize(),
    height: btnSize(),
    'font-size': fontSize(),
    'font-family': 'inherit',
    'border-radius': 'var(--ui-radius-md, 8px)',
    border: '1px solid var(--ui-color-border, #e2e8f0)',
    cursor: 'pointer',
    background: 'transparent',
    color: 'var(--ui-color-text, #0f172a)',
    'font-weight': '400',
    'box-sizing': 'border-box',
  });

  const activeBtnStyle = (): Record<string, string> => ({
    ...baseBtnStyle(),
    'background-color': 'var(--ui-color-primary, #4f46e5)',
    color: '#fff',
    border: 'none',
    'font-weight': '600',
  });

  return (
    <nav
      aria-label="Pagination"
      class={local.class}
      style={{
        display: 'flex',
        'align-items': 'center',
        gap: 'var(--ui-space-1, 4px)',
        'font-family': 'var(--ui-font-family, inherit)',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      {/* Prev */}
      <button
        type="button"
        disabled={local.page <= 1}
        onClick={() => local.onChange?.(local.page - 1)}
        style={{
          ...baseBtnStyle(),
          cursor: local.page <= 1 ? 'not-allowed' : 'pointer',
          opacity: local.page <= 1 ? '0.4' : '1',
        }}
        aria-label="Previous page"
      >
        ‹
      </button>
      <For each={range()}>
        {(item) =>
          item === 'ellipsis' ? (
            <span
              style={{
                display: 'inline-flex',
                'align-items': 'center',
                'justify-content': 'center',
                width: btnSize(),
                height: btnSize(),
                'font-size': fontSize(),
              }}
            >
              …
            </span>
          ) : (
            <button
              type="button"
              onClick={() => local.onChange?.(item as number)}
              style={local.page === item ? activeBtnStyle() : baseBtnStyle()}
              aria-current={local.page === item ? 'page' : undefined}
            >
              {item}
            </button>
          )
        }
      </For>
      {/* Next */}
      <button
        type="button"
        disabled={local.page >= local.count}
        onClick={() => local.onChange?.(local.page + 1)}
        style={{
          ...baseBtnStyle(),
          cursor: local.page >= local.count ? 'not-allowed' : 'pointer',
          opacity: local.page >= local.count ? '0.4' : '1',
        }}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
};
