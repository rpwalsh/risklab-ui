import { defineComponent, h, type PropType, type CSSProperties } from 'vue';

export const UiBreadcrumbs = defineComponent({
  name: 'UiBreadcrumbs',
  props: {
    separator: { type: String, default: '/' },
    maxItems: { type: Number, default: 0 },
  },
  setup(props, { slots }) {
    return () => {
      const children = (slots.default?.() ?? []).filter(
        (c) => typeof c.type !== 'symbol', // filter out text/comment nodes
      );

      let items = children;
      const collapsed = props.maxItems > 0 && items.length > props.maxItems;
      if (collapsed && props.maxItems >= 2) {
        const first = items.slice(0, 1);
        const last = items.slice(-(props.maxItems - 1));
        const ellipsis = h('li', {
          class: 'ui-breadcrumbs__ellipsis',
          style: { display: 'flex', alignItems: 'center' } as CSSProperties,
        }, '…');
        items = [...first, ellipsis as any, ...last];
      }

      const separatorStyle: CSSProperties = {
        margin: '0 8px',
        color: 'var(--ui-color-text-secondary, #666)',
        userSelect: 'none',
      };

      const navStyle: CSSProperties = {
        fontFamily: 'var(--ui-font-family, inherit)',
        fontSize: 'var(--ui-font-size-sm, 0.875rem)',
      };

      const olStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        margin: '0',
        padding: '0',
      };

      const listed: ReturnType<typeof h>[] = [];
      items.forEach((child, i) => {
        listed.push(h('li', {
          class: 'ui-breadcrumbs__item',
          style: { display: 'flex', alignItems: 'center' } as CSSProperties,
        }, [child]));
        if (i < items.length - 1) {
          listed.push(h('li', {
            'aria-hidden': 'true',
            class: 'ui-breadcrumbs__separator',
            style: separatorStyle,
          }, props.separator));
        }
      });

      return h('nav', {
        'aria-label': 'breadcrumb',
        class: 'ui-breadcrumbs',
        style: navStyle,
      }, [h('ol', { style: olStyle }, listed)]);
    };
  },
});
