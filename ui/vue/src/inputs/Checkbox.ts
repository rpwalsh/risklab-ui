import { defineComponent, h, ref, watchEffect, type PropType } from 'vue';
import type { SizeVariant, ColorVariant } from '../core/types';

const SIZE_MAP: Record<SizeVariant, { box: string; fontSize: string }> = {
  xs: { box: '0.875rem', fontSize: '0.75rem' },
  sm: { box: '1rem', fontSize: '0.8125rem' },
  md: { box: '1.25rem', fontSize: '0.875rem' },
  lg: { box: '1.5rem', fontSize: '1rem' },
  xl: { box: '1.75rem', fontSize: '1.125rem' },
};

export const UiCheckbox = defineComponent({
  name: 'UiCheckbox',
  props: {
    modelValue: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    color: { type: String as PropType<ColorVariant>, default: 'primary' },
    label: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null);

    watchEffect(() => {
      if (inputRef.value) {
        inputRef.value.indeterminate = props.indeterminate;
      }
    });

    return () => {
      const sz = SIZE_MAP[props.size];
      const accentColor = `var(--ui-color-${props.color})`;

      const input = h('input', {
        ref: (el: unknown) => { inputRef.value = el as HTMLInputElement; },
        type: 'checkbox',
        checked: props.modelValue,
        disabled: props.disabled,
        'aria-checked': props.indeterminate ? 'mixed' : props.modelValue,
        style: {
          width: sz.box,
          height: sz.box,
          accentColor,
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          margin: '0',
          flexShrink: 0,
        } as Record<string, string | number>,
        onChange: (e: Event) => {
          const val = (e.target as HTMLInputElement).checked;
          emit('update:modelValue', val);
          emit('change', val);
        },
      });

      return h('label', {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5em',
          fontSize: sz.fontSize,
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          opacity: props.disabled ? '0.5' : '1',
          userSelect: 'none',
          fontFamily: 'inherit',
        } as Record<string, string>,
        'data-size': props.size,
        'data-color': props.color,
      }, [
        input,
        props.label ? h('span', null, props.label) : null,
      ]);
    };
  },
});
