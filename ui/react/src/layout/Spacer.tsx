import {
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
  forwardRef,
} from 'react';
import { cx, sx } from '../styling';

interface SpacerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  className?: string;
  style?: CSSProperties;
  xstyle?: Record<string, unknown>;
  children?: never;
  testId?: string;

  /**
   * Fixed pixel (or CSS) size. When provided, the spacer has a fixed size
   * instead of flexing to fill available space.
   */
  size?: string | number;
}

function resolveSize(v: string | number | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

/**
 * Flex spacer that pushes siblings apart.
 * Without `size`, it expands to fill available space (flex: 1).
 * With `size`, it renders a fixed-size gap.
 */
const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  function Spacer(
    { className, style, xstyle, testId, size, ...rest },
    ref: Ref<HTMLDivElement>,
  ) {
    const resolved = resolveSize(size);

    const spacerStyle: CSSProperties = resolved
      ? {
          flexShrink: 0,
          width: resolved,
          height: resolved,
        }
      : {
          flex: 1,
        };

    const resolvedStyle: CSSProperties = {
      ...spacerStyle,
      ...(xstyle as CSSProperties | undefined),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cx(className, sx(resolvedStyle as Record<string, string | number>).className)}
        aria-hidden="true"
        data-testid={testId}
        {...rest}
      />
    );
  },
);

export { Spacer };
export type { SpacerProps };
