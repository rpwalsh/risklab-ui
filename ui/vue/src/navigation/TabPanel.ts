import { defineComponent, h, inject, type PropType, type CSSProperties } from 'vue';
import { TabsKey } from './Tabs';

export const UiTabPanel = defineComponent({
  name: 'UiTabPanel',
  props: {
    value: { type: [String, Number] as PropType<string | number>, required: true },
    keepMounted: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const ctx = inject(TabsKey);

    if (!ctx) {
      throw new Error('[UiTabPanel] Must be used inside <UiTabs>');
    }

    return () => {
      const isActive = ctx.activeValue.value === props.value;

      if (!isActive && !props.keepMounted) return null;

      const style: CSSProperties = {};
      if (!isActive && props.keepMounted) {
        style.display = 'none';
      }

      return h('div', {
        role: 'tabpanel',
        class: 'ui-tab-panel',
        'data-active': isActive ? '' : undefined,
        'aria-hidden': !isActive,
        style,
      }, slots.default?.());
    };
  },
});
