/**
 * @risklab/ui-solid — Slider
 * SolidJS range slider with size, color, min/max/step.
 */

import { mergeProps, splitProps, type Component, type JSX } from 'solid-js';
import type { SliderProps } from '../core/types';
import { colorVar } from '../core/tokens';

export const Slider: Component<SliderProps> = (rawProps) => {
  const props = mergeProps(
    {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      size: 'md' as const,
      color: 'primary' as const,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'value',
    'onInput',
    'min',
    'max',
    'step',
    'disabled',
    'size',
    'color',
    'class',
    'style',
  ]);

  const thumbSize = (): string => {
    const m: Record<string, string> = { xs: '12px', sm: '14px', md: '16px', lg: '20px', xl: '24px' };
    return m[local.size] ?? '16px';
  };

  const trackH = (): string => {
    const m: Record<string, string> = { xs: '2px', sm: '3px', md: '4px', lg: '6px', xl: '8px' };
    return m[local.size] ?? '4px';
  };

  const handleInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (e) => {
    local.onInput?.(Number((e.currentTarget as HTMLInputElement).value));
  };

  return (
    <div
      class={local.class}
      style={{
        display: 'flex',
        'flex-direction': 'column',
        gap: '0.25rem',
        'font-family': 'var(--ui-font-family, inherit)',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      <input
        type="range"
        min={local.min}
        max={local.max}
        step={local.step}
        value={local.value}
        disabled={local.disabled}
        onInput={handleInput}
        style={{
          width: '100%',
          height: thumbSize(),
          appearance: 'none',
          background: 'transparent',
          cursor: local.disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          margin: '0',
          padding: '0',
          opacity: local.disabled ? '0.5' : '1',
          'accent-color': colorVar(local.color),
        }}
      />
    </div>
  );
};
