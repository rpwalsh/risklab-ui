import { defineComponent, h, type PropType, type CSSProperties } from 'vue';

export const UiStack = defineComponent({
  name: 'UiStack',
  props: {
    direction: { type: String as PropType<'row' | 'column' | 'row-reverse' | 'column-reverse'>, default: 'column' },
    spacing: { type: [String, Number], default: 8 },
    align: { type: String as PropType<'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline'>, default: 'stretch' },
    justify: { type: String as PropType<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>, default: 'flex-start' },
    wrap: { type: Boolean, default: false },
    divider: { type: Boolean, default: false },
    as: { type: String, default: 'div' },
  },
  setup(props, { slots }) {
    return () => {
      const gap = typeof props.spacing === 'number' ? `${props.spacing}px` : props.spacing;

      const style: CSSProperties = {
        display: 'flex',
        flexDirection: props.direction,
        gap: props.divider ? '0' : gap,
        alignItems: props.align,
        justifyContent: props.justify,
        flexWrap: props.wrap ? 'wrap' : 'nowrap',
      };

      let children = slots.default?.() ?? [];

      if (props.divider) {
        const isHoriz = props.direction === 'row' || props.direction === 'row-reverse';
        const dividerStyle: CSSProperties = isHoriz
          ? {
            width: '1px',
            alignSelf: 'stretch',
            background: 'var(--ui-color-border, #e0e0e0)',
            margin: `0 ${gap}`,
            flexShrink: 0,
          }
          : {
            height: '1px',
            alignSelf: 'stretch',
            background: 'var(--ui-color-border, #e0e0e0)',
            margin: `${gap} 0`,
            flexShrink: 0,
          };

        const withDividers: ReturnType<typeof h>[] = [];
        const flat = children.flat().filter((c) => typeof c.type !== 'symbol' || typeof c.children === 'string');
        flat.forEach((child, i) => {
          withDividers.push(child as any);
          if (i < flat.length - 1) {
            withDividers.push(h('div', {
              key: `divider-${i}`,
              class: 'ui-stack__divider',
              'aria-hidden': 'true',
              style: dividerStyle,
            }));
          }
        });
        children = withDividers;
      }

      return h(props.as, {
        class: 'ui-stack',
        'data-direction': props.direction,
        style,
      }, children);
    };
  },
});
