import { defineComponent, h, ref, onBeforeUnmount, Teleport, type PropType, type CSSProperties } from 'vue';

const PLACEMENT_STYLES: Record<string, CSSProperties> = {
  top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
  left:   { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
  right:  { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' },
};

export const UiTooltip = defineComponent({
  name: 'UiTooltip',
  props: {
    content: { type: String, default: '' },
    placement: { type: String as PropType<'top' | 'bottom' | 'left' | 'right'>, default: 'top' },
    delay: { type: Number, default: 200 },
    theme: { type: String as PropType<'dark' | 'light'>, default: 'dark' },
  },
  setup(props, { slots }) {
    const visible = ref(false);
    let timer: ReturnType<typeof setTimeout>;

    const show = () => {
      timer = setTimeout(() => { visible.value = true; }, props.delay);
    };
    const hide = () => {
      clearTimeout(timer);
      visible.value = false;
    };

    onBeforeUnmount(() => {
      clearTimeout(timer);
    });

    return () => {
      const tooltipEl = visible.value && props.content
        ? h('span', {
            class: `ui-tooltip ui-tooltip--${props.theme}`,
            role: 'tooltip',
            style: {
              ...PLACEMENT_STYLES[props.placement],
              opacity: 1,
              visibility: 'visible',
            } as CSSProperties,
          }, props.content)
        : null;

      return h('span', {
        class: 'ui-tooltip-wrapper',
        onMouseenter: show,
        onMouseleave: hide,
        onFocusin: show,
        onFocusout: hide,
      }, [
        slots.default?.(),
        tooltipEl,
      ]);
    };
  },
});
