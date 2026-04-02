import React, { forwardRef, type ReactNode, type CSSProperties } from 'react';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
type SkeletonAnimation = 'pulse' | 'wave' | false;
type XStyle =
  | Record<string, string | number>
  | Array<Record<string, string | number> | false | null | undefined>;

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation?: SkeletonAnimation;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: XStyle;
  testId?: string;
}

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

const keyframesId = 'ui-skeleton-keyframes';

function ensureKeyframes(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(keyframesId)) return;
  const styleEl = document.createElement('style');
  styleEl.id = keyframesId;
  styleEl.textContent = `
@keyframes ui-skeleton-pulse {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}
@keyframes ui-skeleton-wave {
  0%   { transform: translateX(-100%); }
  50%  { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}
`;
  document.head.appendChild(styleEl);
}

const variantClassMap: Record<SkeletonVariant, string> = {
  text: 'ui-skeleton--text',
  circular: 'ui-skeleton--circular',
  rectangular: 'ui-skeleton--rectangular',
  rounded: 'ui-skeleton--rounded',
};

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  {
    variant = 'text',
    width,
    height,
    animation = 'pulse',
    children,
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

  // Only dynamic width/height + user overrides go inline
  const dynamicStyle: CSSProperties = {
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
    // When text variant has explicit height, remove the scale transform
    ...(variant === 'text' && height != null ? { transform: 'none', transformOrigin: undefined } : {}),
    ...resolveXStyle(xstyle),
    ...style,
  };

  const classes = [
    'ui-skeleton',
    variantClassMap[variant],
    animation === 'pulse' && 'ui-skeleton--pulse',
    animation === 'wave' && 'ui-skeleton--wave',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      ref={ref}
      className={classes}
      {...(Object.keys(dynamicStyle).length > 0 ? { style: dynamicStyle } : {})}
      data-testid={testId}
      aria-busy="true"
      aria-live="polite"
    >
      {children}
      {animation === 'wave' && (
        <span className="ui-skeleton__inner" />
      )}
    </span>
  );
});

export default Skeleton;
