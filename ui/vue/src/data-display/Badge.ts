import { defineComponent, h, computed, type PropType } from 'vue';
import type { ColorVariant } from '../core/types';

export const UiBadge = defineComponent({
  name: 'UiBadge',
  props: {
    content: { type: [String, Number], default: undefined },
    variant: { type: String as PropType<'standard' | 'dot'>, default: 'standard' },
    color: { type: String as PropType<ColorVariant>, default: 'error' },
    max: { type: Number, default: 99 },
    invisible: { type: Boolean, default: false },
    anchor: { type: String as PropType<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>, default: 'top-right' },
    overlap: { type: String as PropType<'rectangular' | 'circular'>, default: 'rectangular' },
  },
  setup(props, { slots }) {
    const displayText = computed(() => {
      if (props.variant === 'dot') return '';
      if (props.content == null) return '';
      if (typeof props.content === 'number' && props.content > props.max) return `${props.max}+`;
      return String(props.content);
    });

    return () => {
      const indicatorCls = [
        'ui-badge__indicator',
        props.variant === 'dot' && 'ui-badge__indicator--dot',
        props.invisible && 'ui-badge__indicator--invisible',
      ].filter(Boolean).join(' ');

      return h('span', {
        class: 'ui-badge',
        'data-color': props.color,
        'data-anchor': props.anchor,
        'data-overlap': props.overlap,
      }, [
        slots.default?.(),
        h('span', { class: indicatorCls }, displayText.value),
      ]);
    };
  },
});
