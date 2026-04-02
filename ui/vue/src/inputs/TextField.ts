import { defineComponent, h, type PropType } from 'vue';
import type { SizeVariant } from '../core/types';

export const UiTextField = defineComponent({
  name: 'UiTextField',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<'outlined' | 'filled' | 'underlined'>, default: 'outlined' },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    type: { type: String, default: 'text' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    helperText: { type: String, default: '' },
    multiline: { type: Boolean, default: false },
    rows: { type: Number, default: 3 },
  },
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur'],
  setup(props, { emit, slots }) {
    const uid = `ui-tf-${Math.random().toString(36).slice(2, 8)}`;

    return () => {
      const children: ReturnType<typeof h>[] = [];

      // Label
      if (props.label) {
        children.push(
          h('label', { class: 'ui-textfield__label', for: uid }, props.label),
        );
      }

      // Input wrapper
      const wrapperCls = [
        'ui-textfield__wrapper',
        props.multiline && 'ui-textfield__wrapper--multiline',
        props.disabled && 'ui-textfield__wrapper--disabled',
      ].filter(Boolean).join(' ');

      const inputAttrs: Record<string, unknown> = {
        id: uid,
        class: props.multiline ? 'ui-textfield__input ui-textfield__input--multiline' : 'ui-textfield__input',
        value: props.modelValue,
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readonly,
        required: props.required,
        'aria-invalid': props.error || undefined,
        onInput: (e: Event) => {
          const val = (e.target as HTMLInputElement).value;
          emit('update:modelValue', val);
          emit('input', val);
        },
        onChange: (e: Event) => emit('change', (e.target as HTMLInputElement).value),
        onFocus: (e: Event) => emit('focus', e),
        onBlur: (e: Event) => emit('blur', e),
      };

      const wrapperChildren: ReturnType<typeof h>[] = [];
      if (slots.startAdornment) {
        wrapperChildren.push(h('span', { class: 'ui-textfield__adornment' }, slots.startAdornment()));
      }

      if (props.multiline) {
        inputAttrs.rows = props.rows;
        wrapperChildren.push(h('textarea', inputAttrs as Record<string, unknown>));
      } else {
        inputAttrs.type = props.type;
        wrapperChildren.push(h('input', inputAttrs as Record<string, unknown>));
      }

      if (slots.endAdornment) {
        wrapperChildren.push(h('span', { class: 'ui-textfield__adornment' }, slots.endAdornment()));
      }

      children.push(h('div', { class: wrapperCls }, wrapperChildren));

      // Helper text
      if (props.helperText) {
        const helperCls = props.error ? 'ui-textfield__helper ui-textfield__helper--error' : 'ui-textfield__helper ui-textfield__helper--normal';
        children.push(h('p', { class: helperCls }, props.helperText));
      }

      return h('div', {
        class: 'ui-textfield',
        'data-variant': props.variant,
        'data-size': props.size,
        'data-error': props.error || undefined,
      }, children);
    };
  },
});
