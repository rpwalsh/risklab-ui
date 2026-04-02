import { defineComponent, h, type PropType, type CSSProperties } from 'vue';

export const UiGrid = defineComponent({
  name: 'UiGrid',
  props: {
    columns: { type: [Number, String], default: 12 },
    rows: { type: [Number, String], default: undefined },
    gap: { type: [String, Number], default: 16 },
    rowGap: { type: [String, Number], default: undefined },
    columnGap: { type: [String, Number], default: undefined },
    templateColumns: { type: String, default: undefined },
    templateRows: { type: String, default: undefined },
    autoFlow: { type: String as PropType<'row' | 'column' | 'dense' | 'row dense' | 'column dense'>, default: undefined },
    alignItems: { type: String, default: undefined },
    justifyItems: { type: String, default: undefined },
    minChildWidth: { type: String, default: undefined },
    as: { type: String, default: 'div' },
  },
  setup(props, { slots }) {
    return () => {
      const toUnit = (v: string | number | undefined): string | undefined => {
        if (v === undefined) return undefined;
        return typeof v === 'number' ? `${v}px` : v;
      };

      const style: CSSProperties = {
        display: 'grid',
        gap: toUnit(props.gap),
      };

      if (props.rowGap !== undefined) style.rowGap = toUnit(props.rowGap);
      if (props.columnGap !== undefined) style.columnGap = toUnit(props.columnGap);

      // Template columns
      if (props.templateColumns) {
        style.gridTemplateColumns = props.templateColumns;
      } else if (props.minChildWidth) {
        style.gridTemplateColumns = `repeat(auto-fill, minmax(${props.minChildWidth}, 1fr))`;
      } else {
        const cols = typeof props.columns === 'number' ? `repeat(${props.columns}, 1fr)` : props.columns;
        style.gridTemplateColumns = cols;
      }

      if (props.templateRows) {
        style.gridTemplateRows = props.templateRows;
      } else if (props.rows !== undefined) {
        const r = typeof props.rows === 'number' ? `repeat(${props.rows}, 1fr)` : props.rows;
        style.gridTemplateRows = r;
      }

      if (props.autoFlow) style.gridAutoFlow = props.autoFlow;
      if (props.alignItems) style.alignItems = props.alignItems;
      if (props.justifyItems) style.justifyItems = props.justifyItems as any;

      return h(props.as, {
        class: 'ui-grid',
        style,
      }, slots.default?.());
    };
  },
});
