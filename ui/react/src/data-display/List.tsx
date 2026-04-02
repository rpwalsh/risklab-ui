// @risklab/ui � List component

import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
  type HTMLAttributes,
  type LiHTMLAttributes,
} from 'react';
import type { BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ListVariant = 'plain' | 'bordered' | 'divided';

export interface ListProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLUListElement | HTMLOListElement>, 'style' | 'className'> {
  /** Visual variant. */
  variant?: ListVariant;
  /** Reduced vertical spacing. */
  dense?: boolean;
  /** Remove default padding. */
  disablePadding?: boolean;
  /** Render as `<ol>` instead of `<ul>`. */
  ordered?: boolean;
  children?: ReactNode;
}

export interface ListItemProps
  extends BaseProps,
    Omit<LiHTMLAttributes<HTMLLIElement>, 'style' | 'className' | 'onClick'> {
  /** Visually mark as selected. */
  selected?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  /** Make the item interactive (renders with button role). */
  button?: boolean;
  /** Click handler (implies interactive). */
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  /** Add a divider (bottom border) after this item. */
  divider?: boolean;
  children?: ReactNode;
}

export interface ListItemIconProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'className'> {
  children?: ReactNode;
}

export interface ListItemTextProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'className'> {
  /** Primary text. */
  primary?: ReactNode;
  /** Secondary/subtitle text. */
  secondary?: ReactNode;
  children?: ReactNode;
}

export interface ListItemActionProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'className'> {
  children?: ReactNode;
}

export interface ListSubheaderProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLLIElement>, 'style' | 'className'> {
  children?: ReactNode;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mergeXStyle(
  xstyle: BaseProps['xstyle'],
): Record<string, string | number> | undefined {
  if (!xstyle) return undefined;
  if (typeof xstyle === 'object' && !Array.isArray(xstyle))
    return xstyle as Record<string, string | number>;
  if (Array.isArray(xstyle))
    return xstyle.reduce<Record<string, string | number>>(
      (a, s) => (s ? { ...a, ...s } : a),
      {},
    );
  return undefined;
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export const List = forwardRef<HTMLUListElement, ListProps>(
  function List(
    {
      variant = 'plain',
      dense = false,
      disablePadding = false,
      ordered = false,
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const userStyle: CSSProperties | undefined =
      (xstyle || style) ? { ...mergeXStyle(xstyle), ...style } : undefined;

    if (ordered) {
      return (
        <ol
          ref={ref as React.Ref<HTMLOListElement>}
          className={cx(
            'ui-list',
            `ui-list--${variant}`,
            disablePadding && 'ui-list--no-padding',
            dense && 'ui-list--dense',
            className,
          )}
          {...(userStyle ? { style: userStyle } : undefined)}
          role="list"
          data-testid={testId}
          {...rest}
        >
          {children}
        </ol>
      );
    }

    return (
      <ul
        ref={ref}
        className={cx(
          'ui-list',
          `ui-list--${variant}`,
          disablePadding && 'ui-list--no-padding',
          dense && 'ui-list--dense',
          className,
        )}
        {...(userStyle ? { style: userStyle } : undefined)}
        role="list"
        data-testid={testId}
        {...rest}
      >
        {children}
      </ul>
    );
  },
);

// ---------------------------------------------------------------------------
// ListItem
// ---------------------------------------------------------------------------

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  function ListItem(
    {
      selected = false,
      disabled = false,
      button = false,
      onClick,
      divider = false,
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const isInteractive = button || !!onClick;

    const userStyle: CSSProperties | undefined =
      (xstyle || style) ? { ...mergeXStyle(xstyle), ...style } : undefined;

    return (
      <li
        ref={ref}
        className={cx(
          'ui-list-item',
          selected && 'ui-list-item--selected',
          disabled && 'ui-list-item--disabled',
          isInteractive && 'ui-list-item--button',
          divider && 'ui-list-item--divider',
          className,
        )}
        {...(userStyle ? { style: userStyle } : undefined)}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        aria-current={selected ? 'true' : undefined}
        data-disabled={disabled || undefined}
        onClick={!disabled ? onClick : undefined}
        onKeyDown={
          isInteractive && !disabled
            ? (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && onClick) {
                  e.preventDefault();
                  onClick(e as unknown as React.MouseEvent<HTMLLIElement>);
                }
              }
            : undefined
        }
        data-testid={testId}
        {...rest}
      >
        {children}
      </li>
    );
  },
);

// ---------------------------------------------------------------------------
// ListItemIcon
// ---------------------------------------------------------------------------

export const ListItemIcon = forwardRef<HTMLSpanElement, ListItemIconProps>(
  function ListItemIcon({ className, style, xstyle, testId, children, ...rest }, ref) {
    const userStyle: CSSProperties | undefined =
      (xstyle || style) ? { ...mergeXStyle(xstyle), ...style } : undefined;

    return (
      <span
        ref={ref}
        className={cx('ui-list-item-icon', className)}
        {...(userStyle ? { style: userStyle } : undefined)}
        aria-hidden="true"
        data-testid={testId}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

// ---------------------------------------------------------------------------
// ListItemText
// ---------------------------------------------------------------------------

export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(
  function ListItemText(
    { primary, secondary, className, style, xstyle, testId, children, ...rest },
    ref,
  ) {
    const userStyle: CSSProperties | undefined =
      (xstyle || style) ? { ...mergeXStyle(xstyle), ...style } : undefined;

    return (
      <div
        ref={ref}
        className={cx('ui-list-item-text', className)}
        {...(userStyle ? { style: userStyle } : undefined)}
        data-testid={testId}
        {...rest}
      >
        {primary && (
          <span className="ui-list-item-text__primary">
            {primary}
          </span>
        )}
        {secondary && (
          <span className="ui-list-item-text__secondary">
            {secondary}
          </span>
        )}
        {children}
      </div>
    );
  },
);

// ---------------------------------------------------------------------------
// ListItemAction
// ---------------------------------------------------------------------------

export const ListItemAction = forwardRef<HTMLDivElement, ListItemActionProps>(
  function ListItemAction({ className, style, xstyle, testId, children, ...rest }, ref) {
    const userStyle: CSSProperties | undefined =
      (xstyle || style) ? { ...mergeXStyle(xstyle), ...style } : undefined;

    return (
      <div
        ref={ref}
        className={cx('ui-list-item-action', className)}
        {...(userStyle ? { style: userStyle } : undefined)}
        data-testid={testId}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

// ---------------------------------------------------------------------------
// ListSubheader
// ---------------------------------------------------------------------------

export const ListSubheader = forwardRef<HTMLLIElement, ListSubheaderProps>(
  function ListSubheader({ className, style, xstyle, testId, children, ...rest }, ref) {
    const userStyle: CSSProperties | undefined =
      (xstyle || style) ? { ...mergeXStyle(xstyle), ...style } : undefined;

    return (
      <li
        ref={ref}
        className={cx('ui-list-subheader', className)}
        {...(userStyle ? { style: userStyle } : undefined)}
        aria-hidden="true"
        data-testid={testId}
        {...rest}
      >
        {children}
      </li>
    );
  },
);
