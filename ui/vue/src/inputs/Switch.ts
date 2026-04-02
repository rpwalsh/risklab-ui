import { defineComponent, h, type PropType } from 'vue';
import type { SizeVariant, ColorVariant } from '../core/types';

export const UiSwitch = defineComponent({
  name: 'UiSwitch',
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    color: { type: String as PropType<ColorVariant>, default: 'primary' },
    label: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () => {
      return h('label', {
        class: 'ui-switch',
        'data-size': props.size,
        'data-color': props.color,
        'data-disabled': props.disabled || undefined,
      }, [
        h('span', { class: 'ui-switch__track', 'data-checked': String(props.modelValue) }, [
          h('input', {
            type: 'checkbox',
            class: 'ui-switch__input',
            role: 'switch',
            checked: props.modelValue,
            disabled: props.disabled,
            'aria-checked': props.modelValue,
            onChange: (e: Event) => {
              if (props.disabled) return;
              const val = (e.target as HTMLInputElement).checked;
              emit('update:modelValue', val);
              emit('change', val);
            },
          }),
          h('span', {
            class: 'ui-switch__thumb',
            'data-checked': String(props.modelValue),
          }),
        ]),
        props.label ? h('span', { class: 'ui-switch__label' }, props.label) : null,
      ]);
    };
  },
});
