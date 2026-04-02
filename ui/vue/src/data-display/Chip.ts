import { defineComponent, h, type PropType } from 'vue';
import type { SizeVariant, ColorVariant } from '../core/types';

export const UiChip = defineComponent({
  name: 'UiChip',
  props: {
    variant: { type: String as PropType<'solid' | 'outlined' | 'soft'>, default: 'solid' },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    color: { type: String as PropType<ColorVariant>, default: 'neutral' },
    deletable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
  },
  emits: ['delete', 'click'],
  setup(props, { slots, emit }) {
    return () => {
      const cls = [
        'ui-chip',
        `ui-chip--${props.variant}`,
        `ui-chip--${props.size}`,
        props.disabled && 'ui-chip--disabled',
        props.clickable && 'ui-chip--clickable',
      ].filter(Boolean).join(' ');

      const children: ReturnType<typeof h>[] = [];

      if (slots.icon) {
        children.push(h('span', { class: 'ui-chip__icon', 'aria-hidden': 'true' }, slots.icon()));
      }

      children.push(h('span', { class: 'ui-chip__label' }, slots.default?.()));

      if (props.deletable && !props.disabled) {
        children.push(
          h('button', {
            type: 'button',
            class: 'ui-chip__delete',
            'aria-label': 'Remove',
            onClick: (e: Event) => { e.stopPropagation(); emit('delete'); },
          }, [
            h('svg', { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
              h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
              h('line', { x1: 6, y1: 6, x2: 18, y2: 18 }),
            ]),
          ]),
        );
      }

      return h('span', {
        class: cls,
        'data-color': props.color,
        role: props.clickable ? 'button' : undefined,
        tabindex: props.clickable && !props.disabled ? 0 : undefined,
        onClick: props.clickable ? () => emit('click') : undefined,
      }, children);
    };
  },
});
