<script lang="ts">
  import type { SizeVariant } from '../core/types.js';

  let {
    count = 1,
    page = $bindable(1),
    siblingCount = 1,
    boundaryCount = 1,
    size = 'md' as SizeVariant,
    onpage,
  }: {
    count?: number;
    page?: number;
    siblingCount?: number;
    boundaryCount?: number;
    size?: SizeVariant;
    onpage?: (page: number) => void;
  } = $props();

  /**
   * Build a list of page numbers to display, with ellipsis as null.
   */
  let pages = $derived.by(() => {
    const total = Math.max(1, count);
    const result: (number | null)[] = [];

    const startBoundary = range(1, Math.min(boundaryCount, total));
    const endBoundary = range(Math.max(total - boundaryCount + 1, boundaryCount + 1), total);
    const siblingStart = Math.max(Math.min(page - siblingCount, total - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);
    const siblingEnd = Math.min(Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2), endBoundary.length > 0 ? endBoundary[0] - 2 : total - 1);

    result.push(...startBoundary);

    if (siblingStart > boundaryCount + 2) {
      result.push(null); // left ellipsis
    } else if (boundaryCount + 1 < total - boundaryCount) {
      // bridge single gap
      for (let i = boundaryCount + 1; i < siblingStart; i++) result.push(i);
    }

    result.push(...range(siblingStart, siblingEnd));

    if (siblingEnd < total - boundaryCount - 1) {
      result.push(null); // right ellipsis
    } else if (total - boundaryCount > boundaryCount) {
      for (let i = siblingEnd + 1; i <= total - boundaryCount; i++) result.push(i);
    }

    result.push(...endBoundary);

    // Deduplicate
    const seen = new Set<string>();
    return result.filter((p) => {
      const key = p === null ? `null-${seen.size}` : String(p);
      if (p !== null && seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });

  function range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  }

  function goTo(p: number) {
    page = p;
    onpage?.(p);
  }
</script>

<nav class="ui-pagination ui-pagination--rounded" data-size={size} aria-label="Pagination">
  <button
    class="ui-pagination__btn"
    type="button"
    class:ui-pagination__btn--disabled={page <= 1}
    disabled={page <= 1}
    aria-label="Previous page"
    onclick={() => goTo(page - 1)}
  >
    ‹
  </button>

  {#each pages as p}
    {#if p === null}
      <span class="ui-pagination__ellipsis">…</span>
    {:else}
      <button
        class="ui-pagination__btn"
        type="button"
        class:ui-pagination__btn--active={p === page}
        aria-label="Page {p}"
        aria-current={p === page ? 'page' : undefined}
        onclick={() => goTo(p)}
      >
        {p}
      </button>
    {/if}
  {/each}

  <button
    class="ui-pagination__btn"
    type="button"
    class:ui-pagination__btn--disabled={page >= count}
    disabled={page >= count}
    aria-label="Next page"
    onclick={() => goTo(page + 1)}
  >
    ›
  </button>
</nav>

<style>
  .ui-pagination {
    display: flex;
    align-items: center;
    gap: var(--ui-space-1, 4px);
    font-family: var(--ui-font-family, inherit);
  }
  .ui-pagination__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--ui-color-border, #e2e8f0);
    cursor: pointer;
    font-weight: 400;
    background: transparent;
    color: var(--ui-color-text, #0f172a);
    width: var(--ui-pagination-btn-size, 36px);
    height: var(--ui-pagination-btn-size, 36px);
    font-size: var(--ui-pagination-font-size, 14px);
    border-radius: var(--ui-radius-md, 8px);
    transition: background-color 150ms;
  }
  .ui-pagination__btn:hover:not(:disabled):not(.ui-pagination__btn--active) {
    background: rgba(0, 0, 0, 0.04);
  }
  .ui-pagination__btn--active {
    border: none;
    color: #fff;
    font-weight: 600;
    background: var(--ui-color-primary, #4f46e5);
  }
  .ui-pagination__btn--disabled { cursor: not-allowed; opacity: 0.4; }
  .ui-pagination__ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ui-pagination-btn-size, 36px);
    height: var(--ui-pagination-btn-size, 36px);
    font-size: var(--ui-pagination-font-size, 14px);
    border: none;
    cursor: default;
    color: var(--ui-color-text, #0f172a);
    background: transparent;
  }

  .ui-pagination[data-size="sm"] { --ui-pagination-btn-size: 28px; --ui-pagination-font-size: 12px; }
  .ui-pagination[data-size="md"] { --ui-pagination-btn-size: 36px; --ui-pagination-font-size: 14px; }
  .ui-pagination[data-size="lg"] { --ui-pagination-btn-size: 44px; --ui-pagination-font-size: 16px; }
</style>
