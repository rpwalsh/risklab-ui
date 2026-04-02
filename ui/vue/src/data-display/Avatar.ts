import { defineComponent, h, ref, watch, type PropType } from 'vue';
import type { SizeVariant, ColorVariant } from '../core/types';

export const UiAvatar = defineComponent({
  name: 'UiAvatar',
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    size: { type: String as PropType<SizeVariant>, default: 'md' },
    variant: { type: String as PropType<'circular' | 'rounded' | 'square'>, default: 'circular' },
    color: { type: String as PropType<ColorVariant>, default: 'primary' },
    initials: { type: String, default: '' },
  },
  setup(props) {
    const imgError = ref(false);

    watch(() => props.src, () => { imgError.value = false; });

    return () => {
      const showImage = !!(props.src && !imgError.value);
      const cls = [
        'ui-avatar',
        `ui-avatar--${props.variant}`,
      ].join(' ');

      let content: ReturnType<typeof h>;
      if (showImage) {
        content = h('img', {
          src: props.src,
          alt: props.alt,
          class: 'ui-avatar__img',
          onError: () => { imgError.value = true; },
        });
      } else if (props.initials) {
        content = h('span', { 'aria-hidden': 'true' }, props.initials);
      } else {
        // Fallback: person icon
        content = h('svg', {
          'aria-hidden': 'true',
          width: '60%',
          height: '60%',
          viewBox: '0 0 24 24',
          fill: 'currentColor',
        }, [
          h('path', { d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }),
        ]);
      }

      return h('span', {
        class: cls,
        'data-size': props.size,
        'data-color': props.color,
        'data-show-image': showImage ? 'true' : undefined,
        role: 'img',
        'aria-label': props.alt || props.initials || 'avatar',
      }, [content]);
    };
  },
});
