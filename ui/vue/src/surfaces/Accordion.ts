import {
  defineComponent,
  h,
  ref,
  provide,
  watch,
  type PropType,
  type InjectionKey,
} from 'vue';

/* ─── accordion context ─── */
export interface AccordionContext {
  isExpanded: (value: string) => boolean;
  toggle: (value: string) => void;
}

export const AccordionKey: InjectionKey<AccordionContext> = Symbol('UiAccordion');

export const UiAccordion = defineComponent({
  name: 'UiAccordion',
  props: {
    modelValue: { type: [String, Array] as PropType<string | string[]>, default: () => [] },
    multiple: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const expanded = ref<string[]>(
      Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : [],
    );

    watch(() => props.modelValue, (v) => {
      expanded.value = Array.isArray(v) ? v : v ? [v] : [];
    });

    function toggle(value: string) {
      const idx = expanded.value.indexOf(value);
      let next: string[];
      if (idx !== -1) {
        next = expanded.value.filter((v) => v !== value);
      } else {
        next = props.multiple ? [...expanded.value, value] : [value];
      }
      expanded.value = next;
      emit('update:modelValue', props.multiple ? next : (next[0] ?? ''));
    }

    const ctx: AccordionContext = {
      isExpanded: (v) => expanded.value.includes(v),
      toggle,
    };
    provide(AccordionKey, ctx);

    return () => h('div', {
      class: 'ui-accordion',
      role: 'presentation',
    }, slots.default?.());
  },
});
