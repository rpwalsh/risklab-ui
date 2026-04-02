import { defineComponent, h, type PropType } from 'vue';

const SEVERITY_ICON_PATHS: Record<string, string> = {
  success: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  error: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z',
};

function severityIcon(severity: string) {
  return h('svg', { width: '1.25em', height: '1.25em', viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: SEVERITY_ICON_PATHS[severity] ?? SEVERITY_ICON_PATHS.info }),
  ]);
}

export const UiAlert = defineComponent({
  name: 'UiAlert',
  props: {
    severity: { type: String as PropType<'success' | 'info' | 'warning' | 'error'>, default: 'info' },
    variant: { type: String as PropType<'filled' | 'outlined' | 'standard'>, default: 'standard' },
    closable: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: true },
    title: { type: String, default: '' },
  },
  emits: ['close', 'update:modelValue'],
  setup(props, { slots, emit }) {
    return () => {
      if (!props.modelValue) return null;

      const children: ReturnType<typeof h>[] = [];

      // Icon
      children.push(
        h('div', { class: 'ui-alert__icon', 'aria-hidden': 'true' }, [
          severityIcon(props.severity),
        ]),
      );

      // Content
      const contentChildren: ReturnType<typeof h>[] = [];
      if (props.title) {
        contentChildren.push(h('div', { class: 'ui-alert__title' }, props.title));
      }
      contentChildren.push(...(slots.default?.() ?? []));
      children.push(h('div', { class: 'ui-alert__content' }, contentChildren));

      // Actions slot
      if (slots.action) {
        children.push(h('div', { class: 'ui-alert__actions' }, slots.action()));
      }

      // Close button
      if (props.closable) {
        children.push(
          h('button', {
            type: 'button',
            class: 'ui-alert__close',
            'aria-label': 'Close',
            onClick: () => {
              emit('update:modelValue', false);
              emit('close');
            },
          }, [
            h('svg', { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'currentColor' }, [
              h('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' }),
            ]),
          ]),
        );
      }

      return h('div', {
        class: 'ui-alert',
        role: 'alert',
        'data-variant': props.variant,
        'data-severity': props.severity,
      }, children);
    };
  },
});
