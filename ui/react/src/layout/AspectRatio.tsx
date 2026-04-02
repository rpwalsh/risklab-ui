import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  forwardRef,
} from 'react';
import { cx, sx } from '../styling';

interface AspectRatioProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  className?: string;
  style?: CSSProperties;
  xstyle?: Record<string, unknown>;
  children?: ReactNode;
  testId?: string;

  /** Aspect ratio as a number, e.g. 16/9, 4/3, 1. */
  ratio: number;
}

/**
 * Maintains a CSS aspect-ratio for its children.
 * Children are absolutely positioned to fill the container.
 */
const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio(
    { className, style, xstyle, children, testId, ratio, ...rest },
    ref: Ref<HTMLDivElement>,
  ) {
    const outerStyle: CSSProperties = {
      position: 'relative',
      width: '100%',
      aspectRatio: String(ratio),
      ...(xstyle as CSSProperties | undefined),
      ...style,
    };

    const innerStyle: CSSProperties = {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
    };

    return (
      <div
        ref={ref}
        className={cx(className, sx(outerStyle as Record<string, string | number>).className)}
        data-testid={testId}
        {...rest}
      >
        <div className={sx(innerStyle as Record<string, string | number>).className}>
          {children}
        </div>
      </div>
    );
  },
);

export { AspectRatio };
export type { AspectRatioProps };
