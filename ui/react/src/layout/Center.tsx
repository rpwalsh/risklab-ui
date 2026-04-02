import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  forwardRef,
} from 'react';
import { cx, sx } from '../styling';

interface CenterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  className?: string;
  style?: CSSProperties;
  xstyle?: Record<string, unknown>;
  children?: ReactNode;
  testId?: string;

  /** Use inline-flex instead of flex. */
  inline?: boolean;
}

/**
 * Centers children horizontally and vertically using Flexbox.
 */
const Center = forwardRef<HTMLDivElement, CenterProps>(
  function Center(
    { className, style, xstyle, children, testId, inline, ...rest },
    ref: Ref<HTMLDivElement>,
  ) {
    const centerStyle: CSSProperties = {
      display: inline ? 'inline-flex' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...(xstyle as CSSProperties | undefined),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cx(className, sx(centerStyle as Record<string, string | number>).className)}
        data-testid={testId}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export { Center };
export type { CenterProps };
