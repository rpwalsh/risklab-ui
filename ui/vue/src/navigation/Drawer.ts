import {
  defineComponent,
  h,
  ref,
  watch,
  onUnmounted,
  Teleport,
  type PropType,
  type CSSProperties,
} from 'vue';

export const UiDrawer = defineComponent({
  name: 'UiDrawer',
  props: {
    modelValue: { type: Boolean, default: false },
    anchor: { type: String as PropType<'left' | 'right' | 'top' | 'bottom'>, default: 'left' },
    width: { type: String, default: '300px' },
    height: { type: String, default: '300px' },
    persistent: { type: Boolean, default: false },
    hideBackdrop: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const open = ref(props.modelValue);
    watch(() => props.modelValue, (v) => { open.value = v; });

    function close() {
      if (props.persistent) return;
      open.value = false;
      emit('update:modelValue', false);
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }

    watch(
      () => props.modelValue,
      (v) => {
        if (v) {
          document.addEventListener('keydown', onKeydown);
        } else {
          document.removeEventListener('keydown', onKeydown);
        }
      },
      { immediate: true },
    );

    onUnmounted(() => { document.removeEventListener('keydown', onKeydown); });

    return () => {
      if (!open.value) return null;

      const isHoriz = props.anchor === 'left' || props.anchor === 'right';

      const drawerStyle: CSSProperties = {
        position: 'fixed',
        zIndex: 'var(--ui-z-drawer, 1200)' as any,
        background: 'var(--ui-color-surface, #fff)',
        boxShadow: 'var(--ui-shadow-xl, 0 12px 32px rgba(0,0,0,.18))',
        overflow: 'auto',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
      };

      if (isHoriz) {
        drawerStyle.top = '0';
        drawerStyle.bottom = '0';
        drawerStyle.width = props.width;
        if (props.anchor === 'left') drawerStyle.left = '0';
        else drawerStyle.right = '0';
      } else {
        drawerStyle.left = '0';
        drawerStyle.right = '0';
        drawerStyle.height = props.height;
        if (props.anchor === 'top') drawerStyle.top = '0';
        else drawerStyle.bottom = '0';
      }

      const backdropStyle: CSSProperties = {
        position: 'fixed',
        inset: '0',
        zIndex: 'var(--ui-z-drawer, 1200)' as any,
        background: 'rgba(0,0,0,0.5)',
        transition: 'opacity 0.25s',
      };

      const children: ReturnType<typeof h>[] = [];

      if (!props.hideBackdrop) {
        children.push(h('div', {
          class: 'ui-drawer__backdrop',
          style: backdropStyle,
          onClick: close,
          'aria-hidden': 'true',
        }));
      }

      children.push(h('div', {
        class: 'ui-drawer',
        role: 'dialog',
        'aria-modal': 'true',
        'data-anchor': props.anchor,
        style: { ...drawerStyle, zIndex: 'calc(var(--ui-z-drawer, 1200) + 1)' as any },
      }, slots.default?.()));

      return h(Teleport as any, { to: 'body' }, children);
    };
  },
});
