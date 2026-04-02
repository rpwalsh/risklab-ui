import React, { forwardRef, type CSSProperties } from 'react';

type XStyle =
  | Record<string, string | number>
  | Array<Record<string, string | number> | false | null | undefined>;

/* -------------------------------------------------------------------------- */
/*  Shared                                                                    */
/* -------------------------------------------------------------------------- */

function resolveXStyle(xstyle: XStyle | undefined): CSSProperties {
  if (!xstyle) return {};
  if (Array.isArray(xstyle)) {
    return Object.assign(
      {},
      ...xstyle.filter((s): s is Record<string, string | number> => !!s),
    ) as CSSProperties;
  }
  return xstyle as CSSProperties;
}

const keyframesId = 'ui-progress-keyframes';

function ensureKeyframes(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(keyframesId)) return;
  const styleEl = document.createElement('style');
  styleEl.id = keyframesId;
  styleEl.textContent = `
@keyframes ui-linear-indeterminate-1 {
  0%   { left: -35%; right: 100%; }
  60%  { left: 100%; right: -90%; }
  100% { left: 100%; right: -90%; }
}
@keyframes ui-linear-indeterminate-2 {
  0%   { left: -200%; right: 100%; }
  60%  { left: 107%; right: -8%; }
  100% { left: 107%; right: -8%; }
}
@keyframes ui-circular-rotate {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes ui-circular-dash {
  0%   { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
  50%  { stroke-dasharray: 100, 200; stroke-dashoffset: -15; }
  100% { stroke-dasharray: 100, 200; stroke-dashoffset: -125; }
}
`;
  document.head.appendChild(styleEl);
}

/* -------------------------------------------------------------------------- */
/*  LinearProgress                                                            */
/* -------------------------------------------------------------------------- */

type LinearSize = 'sm' | 'md' | 'lg';
type LinearVariant = 'determinate' | 'indeterminate' | 'buffer';

export interface LinearProgressProps {
  value?: number;
  variant?: LinearVariant;
  color?: string;
  size?: LinearSize;
  valueBuffer?: number;
  className?: string;
  style?: CSSProperties;
  xstyle?: XStyle;
  testId?: string;
}

// Size tokens now in CSS: .ui-linear-progress[data-size]

export const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(
  function LinearProgress(
    {
      value = 0,
      variant = 'indeterminate',
      color,
      size = 'md',
      valueBuffer,
      className,
      style,
      xstyle,
      testId,
    },
    ref,
  ) {
    React.useEffect(() => {
      ensureKeyframes();
    }, []);

    const clampedValue = Math.min(100, Math.max(0, value));
    const resolvedColor = color ?? 'var(--ui-progress-color, #1976d2)';

    const userStyle: CSSProperties | undefined = (xstyle || style)
      ? { ...resolveXStyle(xstyle), ...style }
      : undefined;

    // Merge user style with color custom property
    const mergedStyle: CSSProperties = {
      '--ui-progress-bar-color': resolvedColor,
      ...(variant === 'determinate' || variant === 'buffer' ? { '--ui-progress-bar-width': `${clampedValue}%` } : undefined),
      ...(variant === 'buffer' && valueBuffer !== undefined ? { '--ui-progress-bar-buffer-width': `${Math.min(100, Math.max(0, valueBuffer))}%` } : undefined),
      ...userStyle,
    } as CSSProperties;

    const ariaProps: Record<string, string | number | undefined> = {
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    };

    if (variant === 'determinate' || variant === 'buffer') {
      ariaProps['aria-valuenow'] = Math.round(clampedValue);
    }

    return (
      <div
        ref={ref}
        className={['ui-linear-progress', className].filter(Boolean).join(' ')}
        style={mergedStyle}
        data-size={size}
        data-testid={testId}
        {...ariaProps}
      >
        {variant === 'buffer' && (
          <div
            className="ui-linear-progress__bar ui-linear-progress__bar--buffer"
          />
        )}

        {variant === 'determinate' || variant === 'buffer' ? (
          <div
            className="ui-linear-progress__bar ui-linear-progress__bar--determinate"
          />
        ) : (
          <>
            <div className="ui-linear-progress__bar ui-linear-progress__bar--indeterminate-1" />
            <div className="ui-linear-progress__bar ui-linear-progress__bar--indeterminate-2" />
          </>
        )}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  CircularProgress                                                          */
/* -------------------------------------------------------------------------- */

type CircularVariant = 'determinate' | 'indeterminate';

export interface CircularProgressProps {
  value?: number;
  variant?: CircularVariant;
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  xstyle?: XStyle;
  testId?: string;
}

export const CircularProgress = forwardRef<SVGSVGElement, CircularProgressProps>(
  function CircularProgress(
    {
      value = 0,
      variant = 'indeterminate',
      size = 40,
      thickness = 3.6,
      color,
      className,
      style,
      xstyle,
      testId,
    },
    ref,
  ) {
    React.useEffect(() => {
      ensureKeyframes();
    }, []);

    const clampedValue = Math.min(100, Math.max(0, value));
    const resolvedColor = color ?? 'var(--ui-progress-color, #1976d2)';
    const viewBoxSize = 44;
    const radius = (viewBoxSize - thickness) / 2;
    const circumference = 2 * Math.PI * radius;

    const isDeterminate = variant === 'determinate';
    const strokeDasharray = isDeterminate ? circumference.toFixed(3) : undefined;
    const strokeDashoffset = isDeterminate
      ? (((100 - clampedValue) / 100) * circumference).toFixed(3)
      : undefined;

    const svgStyle: CSSProperties = {
      '--ui-circular-size': `${size}px`,
      '--ui-progress-bar-color': resolvedColor,
      ...resolveXStyle(xstyle),
      ...style,
    } as CSSProperties;

    const ariaProps: Record<string, string | number | undefined> = {
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    };

    if (isDeterminate) {
      ariaProps['aria-valuenow'] = Math.round(clampedValue);
    }

    return (
      <svg
        ref={ref}
        className={['ui-circular-progress', !isDeterminate && 'ui-circular-progress--indeterminate', className].filter(Boolean).join(' ')}
        style={svgStyle}
        viewBox={`${viewBoxSize / 2} ${viewBoxSize / 2} ${viewBoxSize} ${viewBoxSize}`}
        data-testid={testId}
        {...ariaProps}
      >
        <circle
          className={isDeterminate ? 'ui-circular-progress__circle ui-circular-progress__circle--determinate' : 'ui-circular-progress__circle ui-circular-progress__circle--indeterminate'}
          cx={viewBoxSize}
          cy={viewBoxSize}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    );
  },
);
