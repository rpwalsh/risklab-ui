import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { Alert, type AlertProps } from './Alert';

type Severity = 'success' | 'info' | 'warning' | 'error';
type ToastVariant = 'standard' | 'outlined' | 'filled';
type XStyle =
  | Record<string, string | number>
  | Array<Record<string, string | number> | false | null | undefined>;

export interface AnchorOrigin {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface ToastProps {
  message?: ReactNode;
  severity?: Severity;
  variant?: ToastVariant;
  action?: ReactNode;
  onClose?: () => void;
  autoHideDuration?: number;
  anchorOrigin?: AnchorOrigin;
  open?: boolean;
  icon?: ReactNode | false;
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

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    message,
    severity = 'info',
    variant = 'filled',
    action,
    onClose,
    autoHideDuration,
    open = true,
    icon,
    children,
    className,
    style,
    xstyle,
    testId,
  },
  ref,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        onClose();
      }, autoHideDuration);
    }
  }, [autoHideDuration, onClose, clearTimer]);

  useEffect(() => {
    if (open) {
      startTimer();
    }
    return clearTimer;
  }, [open, startTimer, clearTimer]);

  if (!open) return null;

  const userStyle: CSSProperties | undefined = (xstyle || style)
    ? { ...resolveXStyle(xstyle), ...style }
    : undefined;

  const alertProps: Omit<AlertProps, 'ref'> = {
    severity,
    variant,
    icon,
    action,
    onClose,
    children: children ?? message,
  };

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={['ui-toast', className].filter(Boolean).join(' ')}
      {...(userStyle ? { style: userStyle } : undefined)}
      data-testid={testId}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <Alert {...alertProps} />
    </div>
  );
});

export default Toast;
