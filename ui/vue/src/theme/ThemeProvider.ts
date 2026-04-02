import {
  defineComponent,
  h,
  provide,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  type PropType,
  type InjectionKey,
  type Ref,
} from 'vue';
import type { ThemeMode, ThemeTokens } from '../core/types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ThemeContext {
  mode: Ref<ThemeMode>;
  isDark: Ref<boolean>;
  tokens: Ref<Partial<ThemeTokens>>;
  toggleMode: () => void;
}

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('ui-theme');

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const defaultDark: Partial<ThemeTokens> = {
  colorSurface: '#1e293b',
  colorSurfaceVariant: '#0f172a',
  colorText: '#f8fafc',
  colorTextSecondary: '#94a3b8',
  colorTextDisabled: '#64748b',
  colorBorder: '#334155',
};

export const UiThemeProvider = defineComponent({
  name: 'UiThemeProvider',
  props: {
    mode: { type: String as PropType<ThemeMode>, default: 'light' },
    tokens: { type: Object as PropType<Partial<ThemeTokens>>, default: () => ({}) },
  },
  setup(props, { slots }) {
    const modeRef = ref<ThemeMode>(props.mode);
    const systemDark = ref(false);
    let mql: MediaQueryList | undefined;

    onMounted(() => {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      systemDark.value = mql.matches;
      const handler = (e: MediaQueryListEvent) => { systemDark.value = e.matches; };
      mql.addEventListener('change', handler);
      onBeforeUnmount(() => mql?.removeEventListener('change', handler));
    });

    watch(() => props.mode, (newMode) => { modeRef.value = newMode; });

    const isDark = computed(() =>
      modeRef.value === 'system' ? systemDark.value : modeRef.value === 'dark',
    );

    const tokensRef = computed(() =>
      isDark.value ? { ...defaultDark, ...props.tokens } : props.tokens,
    );

    const toggleMode = () => { modeRef.value = isDark.value ? 'light' : 'dark'; };

    provide(ThemeKey, { mode: modeRef, isDark, tokens: tokensRef, toggleMode });

    return () => {
      const cssVars: Record<string, string> = {};
      const t = tokensRef.value;
      if (t.colorPrimary) cssVars['--ui-color-primary'] = t.colorPrimary;
      if (t.colorPrimaryHover) cssVars['--ui-color-primary-hover'] = t.colorPrimaryHover;
      if (t.colorSecondary) cssVars['--ui-color-secondary'] = t.colorSecondary;
      if (t.colorSurface) cssVars['--ui-color-surface'] = t.colorSurface;
      if (t.colorSurfaceVariant) cssVars['--ui-color-surface-variant'] = t.colorSurfaceVariant;
      if (t.colorText) cssVars['--ui-color-text'] = t.colorText;
      if (t.colorTextSecondary) cssVars['--ui-color-text-secondary'] = t.colorTextSecondary;
      if (t.colorTextDisabled) cssVars['--ui-color-text-disabled'] = t.colorTextDisabled;
      if (t.colorBorder) cssVars['--ui-color-border'] = t.colorBorder;
      if (t.colorSuccess) cssVars['--ui-color-success'] = t.colorSuccess;
      if (t.colorWarning) cssVars['--ui-color-warning'] = t.colorWarning;
      if (t.colorError) cssVars['--ui-color-error'] = t.colorError;
      if (t.colorInfo) cssVars['--ui-color-info'] = t.colorInfo;
      if (t.fontFamily) cssVars['--ui-font-family'] = t.fontFamily;
      if (t.fontMono) cssVars['--ui-font-mono'] = t.fontMono;
      if (t.radiusSm) cssVars['--ui-radius-sm'] = t.radiusSm;
      if (t.radiusMd) cssVars['--ui-radius-md'] = t.radiusMd;
      if (t.radiusLg) cssVars['--ui-radius-lg'] = t.radiusLg;

      return h(
        'div',
        {
          class: ['ui-root', isDark.value && 'ui-dark'].filter(Boolean).join(' '),
          'data-ui-theme': isDark.value ? 'dark' : 'light',
          style: cssVars,
        },
        slots.default?.(),
      );
    };
  },
});
