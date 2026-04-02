import React, { useState, useRef, useEffect } from 'react';

export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export interface TransitionProps {
  in: boolean;
  timeout?: number | { enter?: number; exit?: number };
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  children: (state: TransitionState) => React.ReactNode;
}

export function Transition({
  in: inProp,
  timeout = 300,
  mountOnEnter = false,
  unmountOnExit = false,
  onEnter,
  onEntered,
  onExit,
  onExited,
  children,
}: TransitionProps) {
  const enterDuration = typeof timeout === 'number' ? timeout : (timeout.enter ?? 300);
  const exitDuration = typeof timeout === 'number' ? timeout : (timeout.exit ?? 300);

  const [state, setState] = useState<TransitionState>(inProp ? 'entered' : 'exited');
  const [mounted, setMounted] = useState(inProp || !mountOnEnter);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store latest callbacks in refs to avoid stale closures
  const onEnterRef = useRef(onEnter);
  const onEnteredRef = useRef(onEntered);
  const onExitRef = useRef(onExit);
  const onExitedRef = useRef(onExited);
  onEnterRef.current = onEnter;
  onEnteredRef.current = onEntered;
  onExitRef.current = onExit;
  onExitedRef.current = onExited;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (inProp) {
      setMounted(true);
      setState('entering');
      onEnterRef.current?.();
      timerRef.current = setTimeout(() => {
        setState('entered');
        onEnteredRef.current?.();
      }, enterDuration);
    } else {
      setState('exiting');
      onExitRef.current?.();
      timerRef.current = setTimeout(() => {
        setState('exited');
        onExitedRef.current?.();
        if (unmountOnExit) setMounted(false);
      }, exitDuration);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [inProp, enterDuration, exitDuration, unmountOnExit]);

  if (!mounted) return null;
  return <>{children(state)}</>;
}

export interface FadeProps {
  in: boolean;
  timeout?: number;
  children: React.ReactElement<{ style?: React.CSSProperties }>;
  unmountOnExit?: boolean;
}

export function Fade({ in: inProp, timeout = 300, children, unmountOnExit = false }: FadeProps) {
  return (
    <Transition in={inProp} timeout={timeout} unmountOnExit={unmountOnExit}>
      {(state) =>
        React.cloneElement(children, {
          style: {
            opacity: state === 'entered' ? 1 : 0,
            transition: `opacity ${timeout}ms ease`,
            ...children.props.style,
          },
        })
      }
    </Transition>
  );
}

export interface SlideProps {
  in: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  timeout?: number;
  children: React.ReactElement;
  unmountOnExit?: boolean;
}

const slideTransforms: Record<string, { enter: string; exit: string }> = {
  up: { exit: 'translateY(20px)', enter: 'translateY(0)' },
  down: { exit: 'translateY(-20px)', enter: 'translateY(0)' },
  left: { exit: 'translateX(20px)', enter: 'translateX(0)' },
  right: { exit: 'translateX(-20px)', enter: 'translateX(0)' },
};

export function Slide({ in: inProp, direction = 'up', timeout = 300, children, unmountOnExit = false }: SlideProps) {
  const transforms = slideTransforms[direction];
  const child = children as React.ReactElement<{ style?: React.CSSProperties }>;
  return (
    <Transition in={inProp} timeout={timeout} unmountOnExit={unmountOnExit}>
      {(state) =>
        React.cloneElement(child, {
          style: {
            opacity: state === 'entered' ? 1 : 0,
            transform: state === 'entered' ? transforms.enter : transforms.exit,
            transition: `opacity ${timeout}ms ease, transform ${timeout}ms ease`,
            ...child.props.style,
          },
        })
      }
    </Transition>
  );
}

export interface CollapseProps {
  in: boolean;
  timeout?: number;
  children: React.ReactElement;
  unmountOnExit?: boolean;
}

export function Collapse({ in: inProp, timeout = 300, children, unmountOnExit = false }: CollapseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>(inProp ? 'auto' : '0px');

  useEffect(() => {
    if (inProp) {
      const h = ref.current?.scrollHeight ?? 0;
      setHeight(`${h}px`);
      const t = setTimeout(() => setHeight('auto'), timeout);
      return () => clearTimeout(t);
    } else {
      const h = ref.current?.scrollHeight ?? 0;
      setHeight(`${h}px`);
      const raf = requestAnimationFrame(() => setHeight('0px'));
      return () => cancelAnimationFrame(raf);
    }
  }, [inProp, timeout]);

  if (!inProp && unmountOnExit && height === '0px') return null;

  return (
    <div
      ref={ref}
      style={{
        overflow: 'hidden',
        height,
        transition: `height ${timeout}ms ease`,
      }}
    >
      {children}
    </div>
  );
}
