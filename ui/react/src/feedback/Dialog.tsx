import React, {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useId,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cx, sx } from '../styling';

type MaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ScrollBehavior = 'body' | 'paper';
type XStyle =
  | Record<string, string | number>
  | Array<Record<string, string | number> | false | null | undefined>;

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  fullWidth?: boolean;
  maxWidth?: MaxWidth;
  scroll?: ScrollBehavior;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: XStyle;
  testId?: string;
}

export interface DialogTitleProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: XStyle;
  testId?: string;
  id?: string;
}

export interface DialogContentProps {
  children?: ReactNode;
  dividers?: boolean;
  className?: string;
  style?: CSSProperties;
  xstyle?: XStyle;
  testId?: string;
}

export interface DialogActionsProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: XStyle;
  testId?: string;
}

const maxWidthValues: Record<MaxWidth, string> = {
  xs: 'var(--ui-dialog-max-width-xs, 444px)',
  sm: 'var(--ui-dialog-max-width-sm, 600px)',
  md: 'var(--ui-dialog-max-width-md, 900px)',
  lg: 'var(--ui-dialog-max-width-lg, 1200px)',
  xl: 'var(--ui-dialog-max-width-xl, 1536px)',
};

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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
  function DialogTitle({ children, className, style, xstyle, testId, id }, ref) {
    const resolvedStyle: CSSProperties = {
      margin: 0,
      padding: 'var(--ui-dialog-title-padding, 16px 24px)',
      fontSize: 'var(--ui-dialog-title-font-size, 1.25rem)',
      fontWeight: 'var(--ui-dialog-title-font-weight, 600)' as never,
      lineHeight: 'var(--ui-dialog-title-line-height, 1.6)',
      fontFamily: 'var(--ui-dialog-font-family, inherit)',
      ...resolveXStyle(xstyle),
      ...style,
    };
    const titleSx = sx(resolvedStyle as Record<string, string | number | null>);

    return (
      <h2 ref={ref} id={id} className={cx('ui-dialog__title', className, titleSx.className)} data-testid={testId}>
        {children}
      </h2>
    );
  },
);

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent({ children, dividers, className, style, xstyle, testId }, ref) {
    const resolvedStyle: CSSProperties = {
      flex: '1 1 auto',
      padding: 'var(--ui-dialog-content-padding, 20px 24px)',
      overflowY: 'auto',
      fontFamily: 'var(--ui-dialog-font-family, inherit)',
      ...(dividers
        ? {
            borderTop: '1px solid var(--ui-dialog-divider-color, rgba(0,0,0,0.12))',
            borderBottom: '1px solid var(--ui-dialog-divider-color, rgba(0,0,0,0.12))',
          }
        : {}),
      ...resolveXStyle(xstyle),
      ...style,
    };
    const contentSx = sx(resolvedStyle as Record<string, string | number | null>);

    return (
      <div ref={ref} className={cx('ui-dialog__content', className, contentSx.className)} data-testid={testId}>
        {children}
      </div>
    );
  },
);

export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(
  function DialogActions({ children, className, style, xstyle, testId }, ref) {
    const resolvedStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 'var(--ui-dialog-actions-gap, 8px)',
      padding: 'var(--ui-dialog-actions-padding, 8px 24px 16px)',
      ...resolveXStyle(xstyle),
      ...style,
    };
    const actionsSx = sx(resolvedStyle as Record<string, string | number | null>);

    return (
      <div ref={ref} className={cx('ui-dialog__actions', className, actionsSx.className)} data-testid={testId}>
        {children}
      </div>
    );
  },
);

const keyframesId = 'ui-dialog-keyframes';

function ensureKeyframes(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(keyframesId)) return;
  const styleEl = document.createElement('style');
  styleEl.id = keyframesId;
  styleEl.textContent = `
@keyframes ui-dialog-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ui-dialog-scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
`;
  document.head.appendChild(styleEl);
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    open,
    onClose,
    title,
    fullWidth = false,
    maxWidth = 'sm',
    scroll = 'paper',
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    children,
    className,
    style,
    xstyle,
    testId,
  },
  ref,
) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Merge refs
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      dialogRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref],
  );

  useEffect(() => {
    ensureKeyframes();
  }, []);

  // Focus management: focus first focusable on open, return focus on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      // Defer to allow portal to render
      const timer = setTimeout(() => {
        const dialog = dialogRef.current;
        if (dialog) {
          const firstFocusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            dialog.focus();
          }
        }
      }, 0);
      return () => clearTimeout(timer);
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [open]);

  // Tab-key focus trap
  useEffect(() => {
    if (!open) return;
    const handleTab = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && !disableEscapeKeyDown) {
        e.stopPropagation();
        onClose?.();
      }
    },
    [disableEscapeKeyDown, onClose],
  );

  const handleBackdropClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !disableBackdropClick) {
        onClose?.();
      }
    },
    [disableBackdropClick, onClose],
  );

  if (!open) return null;

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 'var(--ui-dialog-z-index, 1300)' as never,
    display: 'flex',
    alignItems: scroll === 'body' ? 'flex-start' : 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--ui-dialog-backdrop-color, rgba(0, 0, 0, 0.5))',
    animation: 'ui-dialog-fade-in 0.2s ease',
    overflowY: scroll === 'body' ? 'auto' : 'hidden',
  };

  const paperStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--ui-dialog-bg, #fff)',
    color: 'var(--ui-dialog-color, rgba(0, 0, 0, 0.87))',
    borderRadius: 'var(--ui-dialog-border-radius, 4px)',
    boxShadow:
      'var(--ui-dialog-shadow, 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12))',
    margin: scroll === 'body' ? '32px auto' : '32px',
    maxHeight: scroll === 'paper' ? 'calc(100% - 64px)' : 'none',
    overflowY: scroll === 'paper' ? 'auto' : 'visible',
    width: fullWidth ? '100%' : undefined,
    maxWidth: maxWidthValues[maxWidth],
    animation: 'ui-dialog-scale-in 0.2s ease',
    outline: 'none',
    ...resolveXStyle(xstyle),
    ...style,
  };
  const backdropSx = sx(backdropStyle as Record<string, string | number | null>);
  const paperSx = sx(paperStyle as Record<string, string | number | null>);

  const portal = createPortal(
    <div
      className={cx('ui-dialog__backdrop', backdropSx.className)}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={setRefs}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cx('ui-dialog__paper', className, paperSx.className)}
        data-testid={testId}
        tabIndex={-1}
      >
        {title && <DialogTitle id={titleId}>{title}</DialogTitle>}
        {children}
      </div>
    </div>,
    document.body,
  );

  return portal;
});

export default Dialog;
