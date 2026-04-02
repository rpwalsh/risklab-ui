import {
  defineComponent,
  h,
  ref,
  computed,
  provide,
  watch,
  type PropType,
  type CSSProperties,
  type InjectionKey,
  type Ref,
  type ComputedRef,
} from 'vue';

/* ─── tab context ─── */
export interface TabContext {
  activeValue: Ref<string | number>;
  activate: (value: string | number) => void;
  variant: ComputedRef<string>;
  size: ComputedRef<string>;
}

export const TabsKey: InjectionKey<TabContext> = Symbol('UiTabs');

export const UiTabs = defineComponent({
  name: 'UiTabs',
  props: {
    modelValue: { type: [String, Number] as PropType<string | number>, default: '' },
    variant: { type: String as PropType<'standard' | 'contained' | 'pills'>, default: 'standard' },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    fullWidth: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const current = ref(props.modelValue);

    watch(() => props.modelValue, (v) => { current.value = v; });

    const variantRef = computed(() => props.variant);
    const sizeRef = computed(() => props.size);
    const ctx: TabContext = {
      activeValue: current,
      activate: (v) => { current.value = v; emit('update:modelValue', v); },
      variant: variantRef,
      size: sizeRef,
    };
    provide(TabsKey, ctx);

    return () => {
      const isVert = props.orientation === 'vertical';
      const style: CSSProperties = {
        display: 'flex',
        flexDirection: isVert ? 'row' : 'column',
        width: '100%',
      };

      const tabListStyle: CSSProperties = {
        display: 'flex',
        flexDirection: isVert ? 'column' : 'row',
        gap: props.variant === 'pills' ? '4px' : '0',
        borderBottom: !isVert && props.variant === 'standard' ? '2px solid var(--ui-color-border, #e0e0e0)' : undefined,
        borderRight: isVert && props.variant === 'standard' ? '2px solid var(--ui-color-border, #e0e0e0)' : undefined,
        padding: props.variant === 'contained' ? '4px' : undefined,
        background: props.variant === 'contained' ? 'var(--ui-color-surface-variant, #f5f5f5)' : undefined,
        borderRadius: props.variant === 'contained' ? 'var(--ui-radius-md, 8px)' : undefined,
      };

      if (props.fullWidth && !isVert) {
        tabListStyle.width = '100%';
      }

      // Gather tab and panel children from default slot
      const children = slots.default?.() ?? [];

      // We wrap the tab triggers in a role="tablist"
      const tabs: ReturnType<typeof h>[] = [];
      const panels: ReturnType<typeof h>[] = [];

      children.forEach((child) => {
        if (child.type && (child.type as any).name === 'UiTab') {
          tabs.push(child);
        } else if (child.type && (child.type as any).name === 'UiTabPanel') {
          panels.push(child);
        } else {
          // Unknown children go to panels area
          panels.push(child);
        }
      });

      const tabList = h('div', {
        role: 'tablist',
        class: 'ui-tabs',
        'data-variant': props.variant,
        'data-size': props.size,
        'data-orientation': props.orientation,
        'aria-orientation': props.orientation,
        style: tabListStyle,
      }, tabs);

      const panelContainer = h('div', { class: 'ui-tabs__panels', style: { flex: 1 } as CSSProperties }, panels);

      return h('div', { class: 'ui-tabs-root', style }, [tabList, panelContainer]);
    };
  },
});
