/**
 * @risklab/ui-solid — Progress
 * SolidJS progress (linear & circular) with Show for type switching.
 */

import { mergeProps, splitProps, Show, type Component } from 'solid-js';
import type { ProgressProps } from '../core/types';
import { colorVar } from '../core/tokens';

export const Progress: Component<ProgressProps> = (rawProps) => {
  const props = mergeProps(
    {
      value: 0,
      variant: 'determinate' as const,
      type: 'linear' as const,
      size: 'md' as const,
      color: 'primary' as const,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'value',
    'variant',
    'type',
    'size',
    'color',
    'class',
    'style',
  ]);

  const trackHeight = (): string => {
    const m: Record<string, string> = { xs: '2px', sm: '3px', md: '4px', lg: '6px', xl: '8px' };
    return m[local.size] ?? '4px';
  };

  const circularSize = (): string => {
    const m: Record<string, string> = { xs: '24px', sm: '32px', md: '40px', lg: '56px', xl: '72px' };
    return m[local.size] ?? '40px';
  };

  const clampedValue = () => Math.min(100, Math.max(0, local.value));

  const cv = () => colorVar(local.color);

  // Circular SVG calculations
  const strokeWidth = 4;
  const radius = () => {
    const sz = parseInt(circularSize(), 10);
    return (sz - strokeWidth) / 2;
  };
  const circumference = () => 2 * Math.PI * radius();
  const dashOffset = () =>
    local.variant === 'indeterminate'
      ? circumference() * 0.75
      : circumference() * (1 - clampedValue() / 100);

  return (
    <Show
      when={local.type === 'linear'}
      fallback={
        /* Circular progress */
        <svg
          class={local.class}
          width={circularSize()}
          height={circularSize()}
          viewBox={`0 0 ${parseInt(circularSize(), 10)} ${parseInt(circularSize(), 10)}`}
          style={{
            display: 'inline-block',
            color: cv(),
            ...(local.variant === 'indeterminate'
              ? { animation: 'ui-spin 1.4s linear infinite' }
              : {}),
            ...(local.style as Record<string, string> | undefined),
          }}
          role="progressbar"
          aria-valuenow={local.variant === 'determinate' ? clampedValue() : undefined}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Background track */}
          <circle
            cx={parseInt(circularSize(), 10) / 2}
            cy={parseInt(circularSize(), 10) / 2}
            r={radius()}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            stroke-width={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={parseInt(circularSize(), 10) / 2}
            cy={parseInt(circularSize(), 10) / 2}
            r={radius()}
            fill="none"
            stroke="currentColor"
            stroke-width={strokeWidth}
            stroke-dasharray={`${circumference()}`}
            stroke-dashoffset={dashOffset()}
            stroke-linecap="round"
            style={{
              transition: local.variant === 'determinate' ? 'stroke-dashoffset 0.3s ease' : 'none',
              'transform-origin': 'center',
              transform: 'rotate(-90deg)',
            }}
          />
        </svg>
      }
    >
      {/* Linear progress */}
      <div
        class={local.class}
        role="progressbar"
        aria-valuenow={local.variant === 'determinate' ? clampedValue() : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'block',
          width: '100%',
          'background-color': 'rgba(0,0,0,0.08)',
          'border-radius': '4px',
          height: trackHeight(),
          ...(local.style as Record<string, string> | undefined),
        }}
      >
        <Show
          when={local.variant === 'determinate'}
          fallback={
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '0',
                bottom: '0',
                width: '40%',
                'background-color': cv(),
                'border-radius': 'inherit',
                animation: 'ui-progress-indeterminate 2.1s cubic-bezier(0.65,0.815,0.735,0.395) infinite',
              }}
            />
          }
        >
          <div
            style={{
              position: 'absolute',
              left: '0',
              top: '0',
              bottom: '0',
              width: `${clampedValue()}%`,
              'background-color': cv(),
              'border-radius': 'inherit',
              transition: 'width 0.4s linear',
            }}
          />
        </Show>
      </div>
    </Show>
  );
};
