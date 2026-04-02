import { defineComponent, h, inject, type PropType, type CSSProperties } from 'vue';
import { TabsKey } from './Tabs';

export const UiTab = defineComponent({
  name: 'UiTab',
  props: {
    value: { type: [String, Number] as PropType<string | number>, required: true },
    disabled: { type: Boolean, default: false },
    icon: { type: null, default: undefined },
  },
  setup(props, { slots }) {
    const ctx = inject(TabsKey);

    if (!ctx) {
      throw new Error('[UiTab] Must be used inside <UiTabs>');
    }

    return () => {
      const isActive = ctx.activeValue.value === props.value;
      const variant = ctx.variant.value;
      const size = ctx.size.value;

      const sizeMap: Record<string, CSSProperties> = {
        sm: { padding: '6px 12px', fontSize: 'var(--ui-font-size-xs, 0.75rem)' },
        md: { padding: '8px 16px', fontSize: 'var(--ui-font-size-sm, 0.875rem)' },
        lg: { padding: '12px 24px', fontSize: 'var(--ui-font-size-md, 1rem)' },
      };

      const baseStyle: CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        border: 'none',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        background: 'transparent',
        fontFamily: 'var(--ui-font-family, inherit)',
        fontWeight: isActive ? '600' : '500',
        color: props.disabled
          ? 'var(--ui-color-text-disabled, #bdbdbd)'
          : isActive
            ? 'var(--ui-color-primary, #1976d2)'
            : 'var(--ui-color-text-secondary, #666)',
        opacity: props.disabled ? 0.5 : 1,
        transition: 'color 0.15s, background 0.15s, box-shadow 0.15s',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        position: 'relative',
        ...sizeMap[size] || sizeMap.md,
      };

      if (variant === 'standard' && isActive) {
        baseStyle.boxShadow = 'inset 0 -2px 0 var(--ui-color-primary, #1976d2)';
      } else if (variant === 'contained' && isActive) {
        baseStyle.background = 'var(--ui-color-surface, #fff)';
        baseStyle.borderRadius = 'var(--ui-radius-sm, 6px)';
        baseStyle.boxShadow = 'var(--ui-shadow-sm, 0 1px 3px rgba(0,0,0,.1))';
      } else if (variant === 'pills' && isActive) {
        baseStyle.background = 'var(--ui-color-primary, #1976d2)';
        baseStyle.color = 'var(--ui-color-primary-contrast, #fff)';
        baseStyle.borderRadius = 'var(--ui-radius-full, 9999px)';
      }

      return h('button', {
        role: 'tab',
        type: 'button',
        class: 'ui-tab',
        'data-active': isActive ? '' : undefined,
        'data-size': size,
        'aria-selected': isActive,
        'aria-disabled': props.disabled || undefined,
        tabindex: isActive ? 0 : -1,
        disabled: props.disabled || undefined,
        style: baseStyle,
        onClick: () => { if (!props.disabled) ctx.activate(props.value); },
      }, [
        props.icon ? h('span', { class: 'ui-tab__icon', 'aria-hidden': 'true' }, [props.icon as any]) : null,
        h('span', null, slots.default?.()),
      ]);
    };
  },
});
