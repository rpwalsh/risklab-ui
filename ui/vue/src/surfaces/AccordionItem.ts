import { defineComponent, h, inject, ref, type CSSProperties } from 'vue';
import { AccordionKey } from './Accordion';

export const UiAccordionItem = defineComponent({
  name: 'UiAccordionItem',
  props: {
    value: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const ctx = inject(AccordionKey);

    if (!ctx) {
      throw new Error('[UiAccordionItem] Must be used inside <UiAccordion>');
    }

    return () => {

      const isOpen = ctx.isExpanded(props.value);

      const headerStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 16px',
        border: 'none',
        borderBottom: '1px solid var(--ui-color-border, #e0e0e0)',
        background: 'transparent',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--ui-font-family, inherit)',
        fontSize: 'var(--ui-font-size-md, 1rem)',
        fontWeight: '500',
        color: props.disabled ? 'var(--ui-color-text-disabled, #bdbdbd)' : 'var(--ui-color-text, #212121)',
        opacity: props.disabled ? 0.5 : 1,
        textAlign: 'left',
        transition: 'background 0.15s',
      };

      const chevronStyle: CSSProperties = {
        transition: 'transform 0.25s',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      };

      const contentStyle: CSSProperties = {
        overflow: 'hidden',
        maxHeight: isOpen ? '2000px' : '0',
        transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
      };

      const innerStyle: CSSProperties = {
        padding: '16px',
      };

      const chevron = h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '20',
        height: '20',
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        style: chevronStyle,
        'aria-hidden': 'true',
      }, [h('path', { d: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z' })]);

      return h('div', {
        class: 'ui-accordion-item',
        'data-expanded': isOpen ? '' : undefined,
        'data-disabled': props.disabled ? '' : undefined,
      }, [
        h('button', {
          type: 'button',
          role: 'button',
          class: 'ui-accordion-item__header',
          'aria-expanded': isOpen,
          disabled: props.disabled || undefined,
          style: headerStyle,
          onClick: () => { if (!props.disabled) ctx.toggle(props.value); },
        }, [
          h('span', null, slots.header?.() ?? props.value),
          chevron,
        ]),
        h('div', {
          class: 'ui-accordion-item__content',
          role: 'region',
          style: contentStyle,
        }, [
          h('div', { style: innerStyle }, slots.default?.()),
        ]),
      ]);
    };
  },
});
