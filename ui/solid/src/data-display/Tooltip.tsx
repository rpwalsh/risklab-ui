/**
 * @risklab/ui-solid — Tooltip
 * SolidJS tooltip with createSignal for show state, placement, delay.
 * Uses onMount/onCleanup for mouse listeners.
 */

import {
  mergeProps,
  splitProps,
  createSignal,
  createUniqueId,
  onMount,
  onCleanup,
  Show,
  type Component,
} from 'solid-js';
import type { TooltipProps } from '../core/types';

export const Tooltip: Component<TooltipProps> = (rawProps) => {
  const props = mergeProps(
    {
      placement: 'top' as const,
      delay: 200,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'content',
    'placement',
    'delay',
    'children',
    'class',
    'style',
  ]);

  const tooltipId = createUniqueId();
  const [show, setShow] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let wrapperRef!: HTMLSpanElement;

  const handleEnter = () => {
    timeoutId = setTimeout(() => setShow(true), local.delay);
  };

  const handleLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setShow(false);
  };

  onMount(() => {
    if (wrapperRef) {
      wrapperRef.addEventListener('mouseenter', handleEnter);
      wrapperRef.addEventListener('mouseleave', handleLeave);
      wrapperRef.addEventListener('focusin', handleEnter);
      wrapperRef.addEventListener('focusout', handleLeave);
    }
  });

  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
    if (wrapperRef) {
      wrapperRef.removeEventListener('mouseenter', handleEnter);
      wrapperRef.removeEventListener('mouseleave', handleLeave);
      wrapperRef.removeEventListener('focusin', handleEnter);
      wrapperRef.removeEventListener('focusout', handleLeave);
    }
  });

  const tooltipPosition = (): Record<string, string> => {
    const base: Record<string, string> = {
      position: 'absolute',
      padding: '0.375rem 0.625rem',
      'font-size': '0.75rem',
      'font-family': 'var(--ui-font-family, inherit)',
      'font-weight': '500',
      'line-height': '1.4',
      'border-radius': '0.375rem',
      'white-space': 'nowrap',
      'pointer-events': 'none',
      'z-index': 'var(--ui-z-tooltip, 1500)',
      'background-color': '#1f2937',
      color: '#fff',
      'box-shadow': '0 2px 8px rgba(0,0,0,0.2)',
    };

    switch (local.placement) {
      case 'top':
        base.bottom = '100%';
        base.left = '50%';
        base.transform = 'translateX(-50%)';
        base['margin-bottom'] = '6px';
        break;
      case 'bottom':
        base.top = '100%';
        base.left = '50%';
        base.transform = 'translateX(-50%)';
        base['margin-top'] = '6px';
        break;
      case 'left':
        base.right = '100%';
        base.top = '50%';
        base.transform = 'translateY(-50%)';
        base['margin-right'] = '6px';
        break;
      case 'right':
        base.left = '100%';
        base.top = '50%';
        base.transform = 'translateY(-50%)';
        base['margin-left'] = '6px';
        break;
    }

    return base;
  };

  return (
    <span
      ref={wrapperRef}
      class={local.class}
      aria-describedby={show() && local.content ? tooltipId : undefined}
      style={{
        position: 'relative',
        display: 'inline-flex',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      {local.children}
      <Show when={show() && local.content}>
        <span id={tooltipId} style={tooltipPosition()} role="tooltip">
          {local.content}
        </span>
      </Show>
    </span>
  );
};
