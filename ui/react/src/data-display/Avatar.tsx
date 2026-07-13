// @risklab/ui — Avatar component

import {
  forwardRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type HTMLAttributes,
  type ImgHTMLAttributes,
} from 'react';
import type { SizeVariant, ColorVariant, BaseProps } from '../styling/types';
import { cx } from '../styling/cx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarVariant = 'circular' | 'rounded' | 'square';

export interface AvatarProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'className' | 'color'> {
  /** Image source URL. */
  src?: string;
  /** Alt text for the image. */
  alt?: string;
  /** Size — a SizeVariant token or a numeric pixel value. */
  size?: SizeVariant | number;
  /** Shape variant. */
  variant?: AvatarVariant;
  /** Background color — a ColorVariant token or CSS color string. */
  color?: ColorVariant | (string & {});
  /** Fallback content shown when the image fails to load. */
  fallback?: ReactNode;
  /** Initials to display when no image or fallback given. */
  initials?: string;
  /** Additional img attributes. */
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
  children?: ReactNode;
}

export interface AvatarGroupProps
  extends BaseProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'className'> {
  /** Maximum number of avatars to show before +N overflow. */
  max?: number;
  /** Overlap amount in px or CSS value. */
  spacing?: number | string;
  /** Size for all avatars in the group. */
  size?: SizeVariant | number;
  children?: ReactNode;
}

// ---------------------------------------------------------------------------
// Size tokens
// ---------------------------------------------------------------------------

const SIZE_PX: Record<SizeVariant, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

function resolveSize(size: SizeVariant | number): number {
  return typeof size === 'number' ? size : SIZE_PX[size];
}

// ---------------------------------------------------------------------------
// Color tokens
// ---------------------------------------------------------------------------

const COLOR_MAP: Record<ColorVariant, { bg: string; fg: string }> = {
  primary: { bg: 'var(--ui-color-primary, #3b82f6)', fg: '#fff' },
  secondary: { bg: 'var(--ui-color-secondary, #6366f1)', fg: '#fff' },
  success: { bg: 'var(--ui-color-success, #22c55e)', fg: '#fff' },
  warning: { bg: 'var(--ui-color-warning, #f59e0b)', fg: '#fff' },
  error: { bg: 'var(--ui-color-error, #ef4444)', fg: '#fff' },
  info: { bg: 'var(--ui-color-info, #06b6d4)', fg: '#fff' },
  neutral: { bg: 'var(--ui-color-neutral, #6b7280)', fg: '#fff' },
};

const SEMANTIC_COLORS = new Set<string>(Object.keys(COLOR_MAP));

function resolveColor(color: string | undefined): { bg: string; fg: string } {
  if (!color) return COLOR_MAP.neutral;
  if (SEMANTIC_COLORS.has(color)) return COLOR_MAP[color as ColorVariant];
  return { bg: color, fg: '#fff' };
}

// ---------------------------------------------------------------------------
// Variant classes are in ui.css: .ui-avatar--circular, --rounded, --square
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Default person icon fallback
// ---------------------------------------------------------------------------

function DefaultFallbackIcon() {
  return (
    <svg
      aria-hidden="true"
      width="60%"
      height="60%"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(
    {
      src,
      alt,
      size = 'md',
      variant = 'circular',
      color,
      fallback,
      initials,
      imgProps,
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const [imgError, setImgError] = useState(false);

    const px = resolveSize(size);
    const showImage = !!src && !imgError;
    const isCustomSize = typeof size === 'number';
    const sizeToken = typeof size === 'string' ? size : undefined;
    const colorToken = color && SEMANTIC_COLORS.has(color) ? color : undefined;

    // Only dynamic custom properties go inline when size is numeric or color is non-semantic.
    // Predefined sizes/colors are handled by CSS .ui-avatar[data-size/color] selectors.
    const resolvedStyle: CSSProperties | undefined = (() => {
      const custom: Record<string, string | number> = {};
      if (isCustomSize) {
        custom['--ui-avatar-size'] = `${px}px`;
        custom.fontSize = `var(--ui-avatar-font-size, ${Math.round(px * 0.4)}px)`;
      }
      if (!colorToken && !showImage) {
        const colors = resolveColor(color);
        custom.backgroundColor = `var(--ui-avatar-bg, ${colors.bg})`;
        custom.color = `var(--ui-avatar-color, ${colors.fg})`;
      }
      const x = typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : undefined;
      const xa = Array.isArray(xstyle)
        ? xstyle.reduce<Record<string, string | number>>((a, s) => (s ? { ...a, ...s } : a), {})
        : undefined;
      const merged = { ...custom, ...x, ...xa, ...style };
      return Object.keys(merged).length > 0 ? merged as CSSProperties : undefined;
    })();

    let content: ReactNode;
    if (showImage) {
      content = (
        <img
          src={src}
          alt={alt ?? ''}
          {...imgProps}
          className={cx('ui-avatar__img', imgProps?.className)}
          {...(imgProps?.style ? { style: imgProps.style } : undefined)}
          onError={(e) => {
            setImgError(true);
            imgProps?.onError?.(e);
          }}
        />
      );
    } else if (children) {
      content = children;
    } else if (fallback) {
      content = fallback;
    } else if (initials) {
      content = (
        <span aria-hidden="true">{initials.slice(0, 2).toUpperCase()}</span>
      );
    } else {
      content = <DefaultFallbackIcon />;
    }

    return (
      <span
        ref={ref}
        className={cx('ui-avatar', `ui-avatar--${variant}`, className)}
        {...(resolvedStyle ? { style: resolvedStyle } : undefined)}
        role="img"
        aria-label={alt || initials || 'avatar'}
        data-testid={testId}
        data-size={sizeToken}
        data-color={showImage ? undefined : (colorToken ?? 'neutral')}
        data-show-image={showImage ? 'true' : undefined}
        {...rest}
      >
        {content}
      </span>
    );
  },
);

// ---------------------------------------------------------------------------
// AvatarGroup
// ---------------------------------------------------------------------------

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    {
      max,
      spacing = -8,
      size = 'md',
      className,
      style,
      xstyle,
      testId,
      children,
      ...rest
    },
    ref,
  ) {
    const childArray = Array.isArray(children)
      ? (children as ReactNode[]).filter(Boolean)
      : children
        ? [children]
        : [];

    const shown = max != null && childArray.length > max ? childArray.slice(0, max) : childArray;
    const overflowCount = max != null && childArray.length > max ? childArray.length - max : 0;

    const spacingValue = typeof spacing === 'number' ? `${spacing}px` : spacing;

    // Base layout lives in ui.css `.ui-avatar-group`; only user overrides go inline.
    const resolvedStyle: CSSProperties | undefined =
      style || xstyle
        ? {
            ...(typeof xstyle === 'object' && !Array.isArray(xstyle) ? xstyle : undefined),
            ...(Array.isArray(xstyle)
              ? xstyle.reduce<Record<string, string | number>>(
                  (a, s) => (s ? { ...a, ...s } : a),
                  {},
                )
              : undefined),
            ...style,
          }
        : undefined;

    const px = resolveSize(size);

    return (
      <div
        ref={ref}
        className={cx('ui-avatar-group', className)}
        {...(resolvedStyle ? { style: resolvedStyle } : undefined)}
        role="group"
        aria-label="Avatar group"
        data-testid={testId}
        {...rest}
      >
        {overflowCount > 0 && (
          <Avatar
            size={size}
            color="neutral"
            variant="circular"
            style={{
              marginLeft: spacingValue,
              border: '2px solid var(--ui-avatar-group-border, #fff)',
              fontSize: `${Math.round(px * 0.35)}px`,
            }}
            aria-label={`${overflowCount} more`}
          >
            +{overflowCount}
          </Avatar>
        )}
        {[...shown].reverse().map((child, i) => (
          <span
            key={i}
            className="ui-avatar-group__item"
            {...(
              i > 0 || overflowCount > 0
                ? { style: { marginLeft: spacingValue } }
                : undefined
            )}
          >
            {child}
          </span>
        ))}
      </div>
    );
  },
);
