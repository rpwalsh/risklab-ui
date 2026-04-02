import { defineComponent, h, type CSSProperties, type PropType } from 'vue';
import type { SizeVariant, ColorVariant } from '../core/types';
import { COLOR_VARS } from '../core/tokens';

// ---------------------------------------------------------------------------
// Sizing → CSS custom properties
// ---------------------------------------------------------------------------

type ButtonVariant = 'filled' | 'outlined' | 'ghost' | 'soft' | 'link';

const SIZE_VARS: Record<SizeVariant, CSSProperties> = {
  xs: { '--ui-btn-height': '1.5rem', '--ui-btn-padding': '0 0.375rem', '--ui-btn-font-size': '0.75rem', '--ui-btn-radius': '0.25rem', '--ui-btn-icon-size': '0.875rem' } as CSSProperties,
  sm: { '--ui-btn-height': '2rem', '--ui-btn-padding': '0 0.625rem', '--ui-btn-font-size': '0.8125rem', '--ui-btn-radius': '0.3125rem', '--ui-btn-icon-size': '1rem' } as CSSProperties,
  md: { '--ui-btn-height': '2.5rem', '--ui-btn-padding': '0 1rem', '--ui-btn-font-size': '0.875rem', '--ui-btn-radius': '0.375rem', '--ui-btn-icon-size': '1.125rem' } as CSSProperties,
  lg: { '--ui-btn-height': '3rem', '--ui-btn-padding': '0 1.5rem', '--ui-btn-font-size': '1rem', '--ui-btn-radius': '0.5rem', '--ui-btn-icon-size': '1.25rem' } as CSSProperties,
  xl: { '--ui-btn-height': '3.5rem', '--ui-btn-padding': '0 2rem', '--ui-btn-font-size': '1.125rem', '--ui-btn-radius': '0.625rem', '--ui-btn-icon-size': '1.5rem' } as CSSProperties,
};

function variantStyles(variant: ButtonVariant, color: ColorVariant): CSSProperties {
  const c = COLOR_VARS[color];
  switch (variant) {
    case 'filled':
      return { '--ui-btn-bg': c.base, '--ui-btn-color': c.contrast, '--ui-btn-border': 'transparent' } as CSSProperties;
    case 'outlined':
      return { '--ui-btn-bg': 'transparent', '--ui-btn-color': c.base, '--ui-btn-border': c.base } as CSSProperties;
    case 'ghost':
      return { '--ui-btn-bg': 'transparent', '--ui-btn-color': c.base, '--ui-btn-border': 'transparent' } as CSSProperties;
    case 'soft':
      return { '--ui-btn-bg': c.soft, '--ui-btn-color': c.softFg, '--ui-btn-border': 'transparent' } as CSSProperties;
    case 'link':
      return { '--ui-btn-bg': 'transparent', '--ui-btn-color': c.base, '--ui-btn-border': 'transparent', '--ui-btn-padding': '0', '--ui-btn-height': 'auto', textDecoration: 'underline' } as CSSProperties;
  }
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5em',
  height: 'var(--ui-btn-height)',
  padding: 'var(--ui-btn-padding)',
  fontSize: 'var(--ui-btn-font-size)',
  fontFamily: 'inherit',
  fontWeight: 600,
  lineHeight: 1,
  borderRadius: 'var(--ui-btn-radius)',
  border: '1px solid var(--ui-btn-border, transparent)',
  backgroundColor: 'var(--ui-btn-bg)',
  color: 'var(--ui-btn-color)',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'background-color 150ms, color 150ms, border-color 150ms, opacity 150ms',
  outline: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
};

const disabledStyle: CSSProperties = { opacity: 0.5, pointerEvents: 'none' };

export const UiButton = defineComponent({
  name: 'UiButton',
  props: {
    variant: { type: String as PropType<ButtonVariant>, default: 'filled' },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    color: { type: String as PropType<ColorVariant>, default: 'primary' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    fullWidth: { type: Boolean, default: false },
    type: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
    href: { type: String, default: undefined },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => {
      const isDisabled = props.disabled || props.loading;
      const tag = props.href ? 'a' : 'button';
      const style: CSSProperties = {
        ...baseStyle,
        ...SIZE_VARS[props.size],
        ...variantStyles(props.variant, props.color),
        ...(props.fullWidth ? { width: '100%' } : undefined),
        ...(isDisabled ? disabledStyle : undefined),
      };

      const attrs: Record<string, unknown> = {
        class: 'ui-btn',
        style,
        'data-variant': props.variant,
        'data-size': props.size,
        'data-color': props.color,
        'aria-busy': props.loading || undefined,
        'aria-disabled': isDisabled || undefined,
        onClick: (e: Event) => { if (!isDisabled) emit('click', e); },
      };

      if (tag === 'button') {
        attrs.type = props.type;
        attrs.disabled = isDisabled;
      } else {
        attrs.href = props.href;
        attrs.role = 'button';
        if (isDisabled) attrs.tabindex = -1;
      }

      const spinner = h('svg', {
        'aria-hidden': 'true',
        width: '1em',
        height: '1em',
        viewBox: '0 0 24 24',
        fill: 'none',
        class: 'ui-btn__spinner',
      }, [
        h('circle', { cx: 12, cy: 12, r: 10, stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '50 100' }),
      ]);

      return h(tag, attrs, [
        props.loading ? spinner : (slots.startIcon ? h('span', { 'aria-hidden': 'true', class: 'ui-btn__icon' }, slots.startIcon()) : null),
        slots.default?.(),
        !props.loading && slots.endIcon ? h('span', { 'aria-hidden': 'true', class: 'ui-btn__icon' }, slots.endIcon()) : null,
      ]);
    };
  },
});
