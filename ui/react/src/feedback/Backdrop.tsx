import React, { forwardRef, type ReactNode, type CSSProperties, type MouseEvent } from 'react';

type XStyle =
  | Record<string, string | number>
  | Array<Record<string, string | number> | false | null | undefined>;

export interface BackdropProps {
  open: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  invisible?: boolean;
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

const keyframesId = 'ui-backdrop-keyframes';

function ensureKeyframes(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(keyframesId)) return;
  const styleEl = document.createElement('style');
  styleEl.id = keyframesId;
  styleEl.textContent = `
@keyframes ui-backdrop-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;
  document.head.appendChild(styleEl);
}

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(function Backdrop(
  { open, onClick, invisible = false, children, className, style, xstyle, testId },
  ref,
) {
  React.useEffect(() => {
    ensureKeyframes();
  }, []);

  if (!open) return null;

  const resolvedStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 'var(--ui-backdrop-z-index, 1200)' as never,
    backgroundColor: invisible
      ? 'transparent'
      : 'var(--ui-backdrop-bg, rgba(0, 0, 0, 0.5))',
    WebkitTapHighlightColor: 'transparent',
    animation: 'ui-backdrop-fade-in var(--ui-backdrop-transition-duration, 0.3s) ease',
    ...resolveXStyle(xstyle),
    ...style,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={resolvedStyle}
      data-testid={testId}
      onClick={onClick}
      aria-hidden="true"
    >
      {children}
    </div>
  );
});

export default Backdrop;
