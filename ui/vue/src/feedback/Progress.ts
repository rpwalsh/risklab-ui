import { defineComponent, h, computed, type PropType, type CSSProperties } from 'vue';
import type { SizeVariant, ColorVariant } from '../core/types';

const LINEAR_SIZES: Record<SizeVariant, string> = {
  xs: '2px', sm: '3px', md: '4px', lg: '6px', xl: '8px',
};

const CIRCULAR_SIZES: Record<SizeVariant, number> = {
  xs: 24, sm: 32, md: 40, lg: 48, xl: 64,
};

export const UiProgress = defineComponent({
  name: 'UiProgress',
  props: {
    value: { type: Number, default: 0 },
    variant: { type: String as PropType<'determinate' | 'indeterminate'>, default: 'determinate' },
    type: { type: String as PropType<'linear' | 'circular'>, default: 'linear' },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    color: { type: String as PropType<ColorVariant>, default: 'primary' },
  },
  setup(props) {
    const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)));
    const colorRef = computed(() => `var(--ui-color-${props.color})`);

    return () => {
      if (props.type === 'circular') {
        const svgSize = CIRCULAR_SIZES[props.size];
        const strokeWidth = Math.max(2, svgSize / 10);
        const r = (svgSize - strokeWidth) / 2;
        const c = 2 * Math.PI * r;
        const center = svgSize / 2;

        const trackCircle = h('circle', {
          cx: center, cy: center, r,
          fill: 'none',
          stroke: 'var(--ui-progress-track-color, rgba(0,0,0,0.08))',
          'stroke-width': strokeWidth,
        });

        const barAttrs: Record<string, unknown> = {
          cx: center, cy: center, r,
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': strokeWidth,
          'stroke-linecap': 'round',
          'stroke-dasharray': c,
          transform: `rotate(-90 ${center} ${center})`,
        };

        if (props.variant === 'determinate') {
          barAttrs['stroke-dashoffset'] = c - (clampedValue.value / 100) * c;
          barAttrs.class = 'ui-circular-progress__circle ui-circular-progress__circle--determinate';
        } else {
          barAttrs.class = 'ui-circular-progress__circle ui-circular-progress__circle--indeterminate';
        }

        return h('svg', {
          class: [
            'ui-circular-progress',
            props.variant === 'indeterminate' && 'ui-circular-progress--indeterminate',
          ].filter(Boolean).join(' '),
          style: { '--ui-circular-size': `${svgSize}px`, color: colorRef.value } as CSSProperties,
          viewBox: `0 0 ${svgSize} ${svgSize}`,
          role: 'progressbar',
          'aria-valuenow': props.variant === 'determinate' ? clampedValue.value : undefined,
          'aria-valuemin': 0,
          'aria-valuemax': 100,
        }, [trackCircle, h('circle', barAttrs)]);
      }

      // Linear progress
      const barChildren: ReturnType<typeof h>[] = [];
      if (props.variant === 'determinate') {
        barChildren.push(h('div', {
          class: 'ui-linear-progress__bar ui-linear-progress__bar--determinate',
          style: { '--ui-progress-bar-width': `${clampedValue.value}%`, '--ui-progress-bar-color': colorRef.value } as CSSProperties,
        }));
      } else {
        barChildren.push(
          h('div', {
            class: 'ui-linear-progress__bar ui-linear-progress__bar--indeterminate-1',
            style: { '--ui-progress-bar-color': colorRef.value } as CSSProperties,
          }),
          h('div', {
            class: 'ui-linear-progress__bar ui-linear-progress__bar--indeterminate-2',
            style: { '--ui-progress-bar-color': colorRef.value } as CSSProperties,
          }),
        );
      }

      return h('div', {
        class: 'ui-linear-progress',
        'data-size': props.size,
        role: 'progressbar',
        'aria-valuenow': props.variant === 'determinate' ? clampedValue.value : undefined,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
      }, barChildren);
    };
  },
});
