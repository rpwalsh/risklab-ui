import { forwardRef, type ReactNode, type CSSProperties } from 'react';

type Severity = 'success' | 'info' | 'warning' | 'error';
type AlertVariant = 'standard' | 'outlined' | 'filled';
type XStyle =
  | Record<string, string | number>
  | Array<Record<string, string | number> | false | null | undefined>;

export interface AlertProps {
  severity?: Severity;
  variant?: AlertVariant;
  icon?: ReactNode | false;
  action?: ReactNode;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: XStyle;
  testId?: string;
}

// Severity colors and backgrounds are now defined in ui.css via
// .ui-alert[data-variant="..."][data-severity="..."] selectors.

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

const defaultIcons: Record<Severity, ReactNode> = {
  success: <SuccessIcon />,
  info: <InfoIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
};

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

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

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    severity = 'info',
    variant = 'standard',
    icon,
    action,
    onClose,
    title,
    children,
    className,
    style,
    xstyle,
    testId,
  },
  ref,
) {
  const userStyle: CSSProperties | undefined = (xstyle || style)
    ? { ...resolveXStyle(xstyle), ...style }
    : undefined;

  const renderIcon = icon === false ? null : icon ?? defaultIcons[severity];

  return (
    <div
      ref={ref}
      role="alert"
      className={['ui-alert', className].filter(Boolean).join(' ')}
      {...(userStyle ? { style: userStyle } : undefined)}
      data-testid={testId}
      data-severity={severity}
      data-variant={variant}
    >
      {renderIcon && (
        <span className="ui-alert__icon">
          {renderIcon}
        </span>
      )}
      <div className="ui-alert__content">
        {title && (
          <div className="ui-alert__title">
            {title}
          </div>
        )}
        {children}
      </div>
      {(action || onClose) && (
        <span className="ui-alert__actions">
          {action}
          {onClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="ui-alert__close"
            >
              <CloseIcon />
            </button>
          )}
        </span>
      )}
    </div>
  );
});

export default Alert;
