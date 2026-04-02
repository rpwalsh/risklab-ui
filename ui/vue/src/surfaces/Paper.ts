import { defineComponent, h, type PropType, type CSSProperties } from 'vue';
import { ELEVATION_SHADOWS } from '../core/tokens';

export const UiPaper = defineComponent({
  name: 'UiPaper',
  props: {
    elevation: { type: Number as PropType<0 | 1 | 2 | 3 | 4 | 5>, default: 1 },
    variant: { type: String as PropType<'elevation' | 'outlined'>, default: 'elevation' },
    square: { type: Boolean, default: false },
    as: { type: String, default: 'div' },
  },
  setup(props, { slots }) {
    return () => {
      const style: CSSProperties = {
        background: 'var(--ui-color-surface, #fff)',
        color: 'var(--ui-color-text, #212121)',
        borderRadius: props.square ? '0' : 'var(--ui-radius-md, 8px)',
        transition: 'box-shadow 0.2s',
      };

      if (props.variant === 'outlined') {
        style.border = '1px solid var(--ui-color-border, #e0e0e0)';
        style.boxShadow = 'none';
      } else {
        style.boxShadow = ELEVATION_SHADOWS[props.elevation] ?? ELEVATION_SHADOWS[1];
      }

      return h(props.as, {
        class: 'ui-paper',
        'data-variant': props.variant,
        'data-elevation': props.elevation,
        style,
      }, slots.default?.());
    };
  },
});
