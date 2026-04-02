import { defineComponent, h, type PropType, type CSSProperties } from 'vue';

export const UiCard = defineComponent({
  name: 'UiCard',
  props: {
    variant: { type: String as PropType<'elevated' | 'outlined' | 'flat'>, default: 'elevated' },
    interactive: { type: Boolean, default: false },
    padding: { type: String, default: undefined },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => {
      const cls = [
        'ui-card',
        props.variant === 'elevated' && 'ui-card--elevated',
        props.variant === 'outlined' && 'ui-card--outlined',
        props.variant === 'flat' && 'ui-card--filled',
        props.interactive && 'ui-card--interactive',
      ].filter(Boolean).join(' ');

      const style: CSSProperties | undefined = props.padding
        ? { padding: props.padding }
        : undefined;

      const children: ReturnType<typeof h>[] = [];

      if (slots.header) {
        children.push(h('div', { class: 'ui-card-header' }, slots.header()));
      }

      children.push(h('div', { class: 'ui-card-content' }, slots.default?.()));

      if (slots.footer) {
        children.push(h('div', { class: 'ui-card-actions' }, slots.footer()));
      }

      return h('div', {
        class: cls,
        style,
        tabindex: props.interactive ? 0 : undefined,
        role: props.interactive ? 'button' : undefined,
        onClick: props.interactive ? (e: Event) => emit('click', e) : undefined,
        onKeydown: props.interactive
          ? (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); emit('click', e); } }
          : undefined,
      }, children);
    };
  },
});
