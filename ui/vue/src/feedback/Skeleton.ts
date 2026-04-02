import { defineComponent, h, type PropType, type CSSProperties } from 'vue';

export const UiSkeleton = defineComponent({
  name: 'UiSkeleton',
  props: {
    variant: { type: String as PropType<'text' | 'circular' | 'rectangular' | 'rounded'>, default: 'text' },
    width: { type: String, default: undefined },
    height: { type: String, default: undefined },
    animation: { type: String as PropType<'pulse' | 'wave' | 'none'>, default: 'pulse' },
  },
  setup(props) {
    return () => {
      const cls = [
        'ui-skeleton',
        `ui-skeleton--${props.variant}`,
        props.animation !== 'none' && `ui-skeleton--${props.animation}`,
      ].filter(Boolean).join(' ');

      const style: CSSProperties = {};
      if (props.width) style.width = props.width;
      if (props.height) style.height = props.height;

      // Circular: if height not set, match width for a perfect circle
      if (props.variant === 'circular') {
        if (!props.height && props.width) style.height = props.width;
        if (!props.width && !props.height) { style.width = '40px'; style.height = '40px'; }
      }

      // Rectangular/Rounded: default height if not provided
      if ((props.variant === 'rectangular' || props.variant === 'rounded') && !props.height) {
        style.height = '100px';
      }

      const children: ReturnType<typeof h>[] = [];
      if (props.animation === 'wave') {
        children.push(h('span', { class: 'ui-skeleton__inner' }));
      }

      return h('div', { class: cls, style, 'aria-hidden': 'true' }, children);
    };
  },
});
