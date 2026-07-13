import { defineComponent, h, computed, type PropType, type CSSProperties } from 'vue';

export const UiPagination = defineComponent({
  name: 'UiPagination',
  props: {
    modelValue: { type: Number, required: true },
    count: { type: Number, required: true },
    siblingCount: { type: Number, default: 1 },
    boundaryCount: { type: Number, default: 1 },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
    color: { type: String as PropType<'primary' | 'secondary'>, default: 'primary' },
    disabled: { type: Boolean, default: false },
    showFirstButton: { type: Boolean, default: false },
    showLastButton: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    /* build range like component library pagination */
    const range = computed(() => {
      const { count, siblingCount, boundaryCount, modelValue: page } = props;
      if (count <= 0) return [];

      const startPages = rangeOf(1, Math.min(boundaryCount, count));
      const endPages = rangeOf(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

      const siblingsStart = Math.max(
        Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
        boundaryCount + 2,
      );
      const siblingsEnd = Math.min(
        Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
        endPages.length > 0 ? endPages[0] - 2 : count - 1,
      );

      const items: (number | 'ellipsis')[] = [
        ...startPages,
        ...(siblingsStart > boundaryCount + 2
          ? ['ellipsis' as const]
          : boundaryCount + 1 < count - boundaryCount
            ? [boundaryCount + 1]
            : []),
        ...rangeOf(siblingsStart, siblingsEnd),
        ...(siblingsEnd < count - boundaryCount - 1
          ? ['ellipsis' as const]
          : count - boundaryCount > boundaryCount
            ? [count - boundaryCount]
            : []),
        ...endPages,
      ];

      return items;
    });

    function rangeOf(start: number, end: number): number[] {
      const len = end - start + 1;
      return len > 0 ? Array.from({ length: len }, (_, i) => start + i) : [];
    }

    function setPage(p: number) {
      if (p >= 1 && p <= props.count && p !== props.modelValue && !props.disabled) {
        emit('update:modelValue', p);
      }
    }

    return () => {
      const sizeMap: Record<string, CSSProperties> = {
        sm: { minWidth: '28px', height: '28px', fontSize: 'var(--ui-font-size-xs, 0.75rem)' },
        md: { minWidth: '32px', height: '32px', fontSize: 'var(--ui-font-size-sm, 0.875rem)' },
        lg: { minWidth: '40px', height: '40px', fontSize: 'var(--ui-font-size-md, 1rem)' },
      };

      const btnBase: CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--ui-color-border, #e0e0e0)',
        borderRadius: 'var(--ui-radius-sm, 6px)',
        background: 'transparent',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--ui-font-family, inherit)',
        transition: 'background 0.15s, color 0.15s',
        ...sizeMap[props.size] || sizeMap.md,
      };

      const activeStyle: CSSProperties = {
        ...btnBase,
        background: `var(--ui-color-${props.color}, #1976d2)`,
        color: `var(--ui-color-${props.color}-contrast, #fff)`,
        borderColor: `var(--ui-color-${props.color}, #1976d2)`,
        fontWeight: '600',
      };

      const items: ReturnType<typeof h>[] = [];

      // First button
      if (props.showFirstButton) {
        items.push(navBtn('«', 1, props.modelValue === 1, btnBase));
      }
      // Prev
      items.push(navBtn('‹', props.modelValue - 1, props.modelValue === 1, btnBase));

      // Pages
      range.value.forEach((item, idx) => {
        if (item === 'ellipsis') {
          items.push(h('span', {
            key: `ell-${idx}`,
            style: { ...btnBase, border: 'none', cursor: 'default' } as CSSProperties,
          }, '…'));
        } else {
          const isActive = item === props.modelValue;
          items.push(h('button', {
            key: item,
            type: 'button',
            class: 'ui-pagination__page',
            'data-active': isActive ? '' : undefined,
            disabled: props.disabled || undefined,
            'aria-current': isActive ? 'page' : undefined,
            style: isActive ? activeStyle : btnBase,
            onClick: () => setPage(item),
          }, String(item)));
        }
      });

      // Next
      items.push(navBtn('›', props.modelValue + 1, props.modelValue === props.count, btnBase));
      // Last button
      if (props.showLastButton) {
        items.push(navBtn('»', props.count, props.modelValue === props.count, btnBase));
      }

      const navStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexWrap: 'wrap',
      };

      return h('nav', {
        'aria-label': 'pagination',
        class: 'ui-pagination',
        'data-size': props.size,
        'data-color': props.color,
      }, [h('ul', {
        style: { ...navStyle, listStyle: 'none', margin: 0, padding: 0 } as CSSProperties,
      }, items.map((it, i) => h('li', { key: i }, [it])))]);

      function navBtn(label: string, target: number, isDisabled: boolean, style: CSSProperties) {
        return h('button', {
          type: 'button',
          'aria-label': label === '‹' ? 'Previous' : label === '›' ? 'Next' : label === '«' ? 'First' : 'Last',
          disabled: (props.disabled || isDisabled) || undefined,
          class: 'ui-pagination__nav',
          style: {
            ...style,
            opacity: isDisabled ? 0.4 : 1,
          } as CSSProperties,
          onClick: () => setPage(target),
        }, label);
      }
    };
  },
});
