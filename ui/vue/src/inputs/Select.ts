import { defineComponent, h, type PropType } from 'vue';
import type { SizeVariant, SelectOptionData } from '../core/types';

export const UiSelect = defineComponent({
  name: 'UiSelect',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<'outlined' | 'filled' | 'underlined'>, default: 'outlined' },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    modelValue: { type: [String, Array] as PropType<string | string[]>, default: '' },
    options: { type: Array as PropType<SelectOptionData[]>, default: () => [] },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    helperText: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const uid = `ui-sel-${Math.random().toString(36).slice(2, 8)}`;

    return () => {
      const children: ReturnType<typeof h>[] = [];

      if (props.label) {
        children.push(h('label', { class: 'ui-select__label', for: uid }, props.label));
      }

      const selectChildren: ReturnType<typeof h>[] = [];
      if (props.placeholder) {
        selectChildren.push(h('option', { value: '', disabled: true, selected: !props.modelValue }, props.placeholder));
      }
      props.options.forEach(opt => {
        selectChildren.push(
          h('option', {
            value: opt.value,
            disabled: opt.disabled,
            selected: props.multiple
              ? Array.isArray(props.modelValue) && props.modelValue.includes(opt.value)
              : props.modelValue === opt.value,
          }, opt.label),
        );
      });

      const selectCls = [
        'ui-select__native',
        props.multiple && 'ui-select__native--multiple',
      ].filter(Boolean).join(' ');

      children.push(
        h('select', {
          id: uid,
          class: selectCls,
          disabled: props.disabled,
          multiple: props.multiple,
          value: props.modelValue,
          'aria-invalid': props.error || undefined,
          onChange: (e: Event) => {
            const sel = e.target as HTMLSelectElement;
            const val = props.multiple
              ? Array.from(sel.selectedOptions).map(o => o.value)
              : sel.value;
            emit('update:modelValue', val);
            emit('change', val);
          },
        }, selectChildren),
      );

      if (props.helperText) {
        const cls = props.error
          ? 'ui-select__helper ui-select__helper--error'
          : 'ui-select__helper ui-select__helper--normal';
        children.push(h('p', { class: cls }, props.helperText));
      }

      return h('div', {
        class: 'ui-select',
        'data-variant': props.variant,
        'data-size': props.size,
        'data-error': props.error || undefined,
      }, children);
    };
  },
});
