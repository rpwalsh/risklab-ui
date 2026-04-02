import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';

type XStyle =
  | Record<string, string | number>
  | Array<Record<string, string | number> | false | null | undefined>;

export interface SnackbarAnchorOrigin {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface SnackbarProps {
  open: boolean;
  autoHideDuration?: number;
  onClose?: (event: unknown, reason: 'timeout' | 'clickaway' | 'escapeKeyDown') => void;
  anchorOrigin?: SnackbarAnchorOrigin;
  message?: ReactNode;
  action?: ReactNode;
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

const keyframesId = 'ui-snackbar-keyframes';

function ensureKeyframes(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(keyframesId)) return;
  const styleEl = document.createElement('style');
  styleEl.id = keyframesId;
  styleEl.textContent = `
@keyframes ui-snackbar-slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
@keyframes ui-snackbar-slide-down {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
`;
  document.head.appendChild(styleEl);
}

function getPositionStyle(anchor: SnackbarAnchorOrigin): CSSProperties {
  const pos: CSSProperties = {
    position: 'fixed',
    zIndex: 'var(--ui-snackbar-z-index, 1400)' as never,
    display: 'flex',
    justifyContent: 'center',
  };

  if (anchor.vertical === 'top') {
    pos.top = 'var(--ui-snackbar-inset, 24px)';
  } else {
    pos.bottom = 'var(--ui-snackbar-inset, 24px)';
  }

  if (anchor.horizontal === 'left') {
    pos.left = 'var(--ui-snackbar-inset, 24px)';
    pos.justifyContent = 'flex-start';
  } else if (anchor.horizontal === 'right') {
    pos.right = 'var(--ui-snackbar-inset, 24px)';
    pos.justifyContent = 'flex-end';
  } else {
    pos.left = '50%';
    pos.transform = 'translateX(-50%)';
  }

  return pos;
}

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
  {
    open,
    autoHideDuration,
    onClose,
    anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
    message,
    action,
    children,
    className,
    style,
    xstyle,
    testId,
  },
  ref,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(open);

  React.useEffect(() => {
    ensureKeyframes();
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (autoHideDuration != null && autoHideDuration > 0 && onClose) {
      clearTimer();
      timerRef.current = setTimeout(() => {
        onClose(null, 'timeout');
      }, autoHideDuration);
    }
  }, [autoHideDuration, onClose, clearTimer]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      startTimer();
    } else {
      clearTimer();
      // Allow close animation before unmounting
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
    return clearTimer;
  }, [open, startTimer, clearTimer]);

  if (!visible && !open) return null;

  const animationName =
    anchorOrigin.vertical === 'top'
      ? 'ui-snackbar-slide-down'
      : 'ui-snackbar-slide-up';

  const positionStyle = getPositionStyle(anchorOrigin);

  const containerStyle: CSSProperties = {
    ...positionStyle,
    animation: open
      ? `${animationName} var(--ui-snackbar-animation-duration, 0.3s) ease forwards`
      : undefined,
    opacity: open ? 1 : 0,
    transition: open ? undefined : 'opacity 0.3s ease',
    ...resolveXStyle(xstyle),
    ...style,
  };

  const defaultContent = (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--ui-snackbar-gap, 8px)',
        padding: 'var(--ui-snackbar-padding, 6px 16px)',
        minWidth: 'var(--ui-snackbar-min-width, 288px)',
        maxWidth: 'var(--ui-snackbar-max-width, 568px)',
        backgroundColor: 'var(--ui-snackbar-bg, #323232)',
        color: 'var(--ui-snackbar-color, #fff)',
        borderRadius: 'var(--ui-snackbar-border-radius, 4px)',
        boxShadow:
          'var(--ui-snackbar-shadow, 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12))',
        fontSize: 'var(--ui-snackbar-font-size, 0.875rem)',
        fontFamily: 'var(--ui-snackbar-font-family, inherit)',
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      {action}
    </div>
  );

  return (
    <div
      ref={ref}
      className={className}
      style={containerStyle}
      data-testid={testId}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      {children ?? defaultContent}
    </div>
  );
});

export default Snackbar;
