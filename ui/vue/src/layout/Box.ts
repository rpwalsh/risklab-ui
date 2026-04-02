import { defineComponent, h, type PropType, type CSSProperties } from 'vue';

export const UiBox = defineComponent({
  name: 'UiBox',
  props: {
    as: { type: String, default: 'div' },
    p: { type: [String, Number], default: undefined },
    px: { type: [String, Number], default: undefined },
    py: { type: [String, Number], default: undefined },
    pt: { type: [String, Number], default: undefined },
    pb: { type: [String, Number], default: undefined },
    pl: { type: [String, Number], default: undefined },
    pr: { type: [String, Number], default: undefined },
    m: { type: [String, Number], default: undefined },
    mx: { type: [String, Number], default: undefined },
    my: { type: [String, Number], default: undefined },
    mt: { type: [String, Number], default: undefined },
    mb: { type: [String, Number], default: undefined },
    ml: { type: [String, Number], default: undefined },
    mr: { type: [String, Number], default: undefined },
    display: { type: String, default: undefined },
    flex: { type: [String, Number], default: undefined },
    width: { type: String, default: undefined },
    height: { type: String, default: undefined },
    minWidth: { type: String, default: undefined },
    maxWidth: { type: String, default: undefined },
    minHeight: { type: String, default: undefined },
    maxHeight: { type: String, default: undefined },
    overflow: { type: String, default: undefined },
    bg: { type: String, default: undefined },
    color: { type: String, default: undefined },
    borderRadius: { type: String, default: undefined },
    border: { type: String, default: undefined },
    boxShadow: { type: String, default: undefined },
    position: { type: String, default: undefined },
    textAlign: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const toUnit = (v: string | number | undefined): string | undefined => {
        if (v === undefined) return undefined;
        return typeof v === 'number' ? `${v}px` : v;
      };

      const style: CSSProperties = {};

      // Padding
      if (props.p !== undefined) style.padding = toUnit(props.p);
      if (props.px !== undefined) { style.paddingLeft = toUnit(props.px); style.paddingRight = toUnit(props.px); }
      if (props.py !== undefined) { style.paddingTop = toUnit(props.py); style.paddingBottom = toUnit(props.py); }
      if (props.pt !== undefined) style.paddingTop = toUnit(props.pt);
      if (props.pb !== undefined) style.paddingBottom = toUnit(props.pb);
      if (props.pl !== undefined) style.paddingLeft = toUnit(props.pl);
      if (props.pr !== undefined) style.paddingRight = toUnit(props.pr);

      // Margin
      if (props.m !== undefined) style.margin = toUnit(props.m);
      if (props.mx !== undefined) { style.marginLeft = toUnit(props.mx); style.marginRight = toUnit(props.mx); }
      if (props.my !== undefined) { style.marginTop = toUnit(props.my); style.marginBottom = toUnit(props.my); }
      if (props.mt !== undefined) style.marginTop = toUnit(props.mt);
      if (props.mb !== undefined) style.marginBottom = toUnit(props.mb);
      if (props.ml !== undefined) style.marginLeft = toUnit(props.ml);
      if (props.mr !== undefined) style.marginRight = toUnit(props.mr);

      // Layout
      if (props.display) style.display = props.display;
      if (props.flex !== undefined) style.flex = props.flex as any;
      if (props.width) style.width = props.width;
      if (props.height) style.height = props.height;
      if (props.minWidth) style.minWidth = props.minWidth;
      if (props.maxWidth) style.maxWidth = props.maxWidth;
      if (props.minHeight) style.minHeight = props.minHeight;
      if (props.maxHeight) style.maxHeight = props.maxHeight;
      if (props.overflow) style.overflow = props.overflow;
      if (props.bg) style.background = props.bg;
      if (props.color) style.color = props.color;
      if (props.borderRadius) style.borderRadius = props.borderRadius;
      if (props.border) style.border = props.border;
      if (props.boxShadow) style.boxShadow = props.boxShadow;
      if (props.position) style.position = props.position as any;
      if (props.textAlign) style.textAlign = props.textAlign as any;

      const { style: attrsStyle, ...restAttrs } = attrs as Record<string, unknown>;
      const mergedStyle = attrsStyle
        ? typeof attrsStyle === 'string'
          ? `${Object.entries(style).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';')};${attrsStyle}`
          : { ...style, ...(attrsStyle as Record<string, unknown>) }
        : style;

      return h(props.as, { class: 'ui-box', style: mergedStyle, ...restAttrs }, slots.default?.());
    };
  },
});
