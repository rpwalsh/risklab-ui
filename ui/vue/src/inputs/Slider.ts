import { defineComponent, h, computed, type PropType, type CSSProperties } from 'vue';
import type { SizeVariant, ColorVariant } from '../core/types';

export const UiSlider = defineComponent({
  name: 'UiSlider',
  props: {
    modelValue: { type: Number, default: 50 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    color: { type: String as PropType<ColorVariant>, default: 'primary' },
    label: { type: String, default: '' },
    showValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const percent = computed(() => {
      const range = props.max - props.min;
      return range > 0 ? ((props.modelValue - props.min) / range) * 100 : 0;
    });

    return () => {
      const children: ReturnType<typeof h>[] = [];

      if (props.label) {
        children.push(
          h('label', { class: 'ui-slider__label' }, [
            props.label,
            props.showValue ? h('span', { class: 'ui-slider__value-inline' }, String(props.modelValue)) : null,
          ]),
        );
      }

      // Background gradient for filled track
      const trackBg = `linear-gradient(to right, var(--ui-slider-color, var(--ui-color-primary)) ${percent.value}%, var(--ui-color-border, #e2e8f0) ${percent.value}%)`;

      children.push(
        h('input', {
          type: 'range',
          class: ['ui-slider__input', props.disabled && 'ui-slider__input--disabled'].filter(Boolean).join(' '),
          min: props.min,
          max: props.max,
          step: props.step,
          value: props.modelValue,
          disabled: props.disabled,
          'aria-valuenow': props.modelValue,
          'aria-valuemin': props.min,
          'aria-valuemax': props.max,
          style: { background: trackBg } as CSSProperties,
          onInput: (e: Event) => {
            const val = Number((e.target as HTMLInputElement).value);
            emit('update:modelValue', val);
          },
          onChange: (e: Event) => {
            emit('change', Number((e.target as HTMLInputElement).value));
          },
        }),
      );

      return h('div', {
        class: 'ui-slider',
        'data-size': props.size,
        'data-color': props.color,
      }, children);
    };
  },
});
