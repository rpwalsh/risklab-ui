import { defineComponent, h, Teleport, watch, onBeforeUnmount, type PropType, type CSSProperties } from 'vue';
import type { SizeVariant } from '../core/types';

const SIZE_MAP: Record<SizeVariant, string> = {
  xs: '320px', sm: '400px', md: '520px', lg: '680px', xl: '860px',
};

export const UiDialog = defineComponent({
  name: 'UiDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    modal: { type: Boolean, default: true },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    persistent: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit }) {
    const close = () => {
      emit('update:modelValue', false);
      emit('close');
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.modelValue && !props.persistent) {
        close();
      }
    };

    watch(
      () => props.modelValue,
      (open) => {
        if (open) {
          document.addEventListener('keydown', onKeydown);
        } else {
          document.removeEventListener('keydown', onKeydown);
        }
      },
      { immediate: true },
    );

    onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));

    return () => {
      if (!props.modelValue) return null;

      const backdropStyle: CSSProperties = {
        position: 'fixed',
        inset: '0',
        zIndex: 'var(--ui-z-modal, 1300)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      };

      const dialogStyle: CSSProperties = {
        backgroundColor: 'var(--ui-color-surface, #fff)',
        borderRadius: 'var(--ui-radius-lg, 12px)',
        boxShadow: 'var(--ui-shadow-xl)',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '90%',
        maxWidth: SIZE_MAP[props.size],
        display: 'flex',
        flexDirection: 'column',
      };

      const children: ReturnType<typeof h>[] = [];

      if (slots.header) {
        children.push(h('div', {
          style: {
            padding: 'var(--ui-space-4, 16px) var(--ui-space-6, 24px)',
            borderBottom: '1px solid var(--ui-color-border, #e2e8f0)',
            fontWeight: 600,
            fontSize: 'var(--ui-text-lg, 1.125rem)',
          } as CSSProperties,
        }, slots.header()));
      }

      children.push(h('div', {
        style: { padding: 'var(--ui-space-6, 24px)', flex: 1 } as CSSProperties,
      }, slots.default?.()));

      if (slots.footer) {
        children.push(h('div', {
          style: {
            padding: 'var(--ui-space-3, 12px) var(--ui-space-6, 24px)',
            borderTop: '1px solid var(--ui-color-border, #e2e8f0)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--ui-space-2, 8px)',
          } as CSSProperties,
        }, slots.footer()));
      }

      const backdrop = h('div', {
        style: backdropStyle,
        onClick: (e: Event) => {
          if (!props.persistent && (e.target as HTMLElement) === e.currentTarget) {
            close();
          }
        },
      }, [
        h('div', {
          class: 'ui-dialog',
          style: dialogStyle,
          role: 'dialog',
          'aria-modal': props.modal,
          onClick: (e: Event) => e.stopPropagation(),
        }, children),
      ]);

      return h(Teleport, { to: 'body' }, [backdrop]);
    };
  },
});
