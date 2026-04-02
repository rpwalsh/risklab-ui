import { defineComponent, h, type PropType, type CSSProperties } from 'vue';

export const UiDivider = defineComponent({
  name: 'UiDivider',
  props: {
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    variant: { type: String as PropType<'fullWidth' | 'inset' | 'middle'>, default: 'fullWidth' },
    color: { type: String, default: undefined },
    thickness: { type: String, default: '1px' },
    spacing: { type: [String, Number], default: 0 },
  },
  setup(props, { slots }) {
    return () => {
      const isVert = props.orientation === 'vertical';
      const gap = typeof props.spacing === 'number' ? `${props.spacing}px` : props.spacing;
      const borderColor = props.color ?? 'var(--ui-color-border, #e0e0e0)';

      const style: CSSProperties = {};

      if (isVert) {
        style.display = 'inline-flex';
        style.alignSelf = 'stretch';
        style.width = props.thickness;
        style.minHeight = '100%';
        style.background = borderColor;
        if (props.variant === 'inset') {
          style.marginTop = '8px';
          style.marginBottom = '8px';
        } else if (props.variant === 'middle') {
          style.marginTop = '16px';
          style.marginBottom = '16px';
        }
        if (gap !== '0' && gap !== '0px') {
          style.marginLeft = gap;
          style.marginRight = gap;
        }
      } else {
        style.width = '100%';
        style.height = props.thickness;
        style.background = borderColor;
        if (props.variant === 'inset') {
          style.marginLeft = '72px';
        } else if (props.variant === 'middle') {
          style.marginLeft = '16px';
          style.marginRight = '16px';
        }
        if (gap !== '0' && gap !== '0px') {
          style.marginTop = gap;
          style.marginBottom = gap;
        }
      }

      const hasChildren = slots.default;
      if (hasChildren) {
        const wrapStyle: CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          width: isVert ? undefined : '100%',
          height: isVert ? '100%' : undefined,
          flexDirection: isVert ? 'column' : 'row',
        };
        const lineStyle: CSSProperties = isVert
          ? { flex: 1, width: props.thickness, background: borderColor }
          : { flex: 1, height: props.thickness, background: borderColor };
        const labelStyle: CSSProperties = {
          padding: isVert ? '8px 0' : '0 16px',
          fontSize: 'var(--ui-font-size-xs, 0.75rem)',
          color: 'var(--ui-color-text-secondary, #666)',
          whiteSpace: 'nowrap',
        };

        return h('div', {
          class: 'ui-divider',
          role: 'separator',
          'data-orientation': props.orientation,
          'data-variant': props.variant,
          style: wrapStyle,
        }, [
          h('span', { style: lineStyle, 'aria-hidden': 'true' }),
          h('span', { style: labelStyle }, slots.default?.()),
          h('span', { style: lineStyle, 'aria-hidden': 'true' }),
        ]);
      }

      return h('hr', {
        class: 'ui-divider',
        role: 'separator',
        'aria-orientation': props.orientation,
        'data-orientation': props.orientation,
        'data-variant': props.variant,
        style: { ...style, border: 'none', margin: style.marginTop ? undefined : 0 },
      });
    };
  },
});
