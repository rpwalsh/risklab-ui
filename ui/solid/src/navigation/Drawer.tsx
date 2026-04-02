/**
 * @risklab/ui-solid — Drawer
 * SolidJS drawer using Portal with slide animation via CSS.
 */

import { mergeProps, splitProps, Show, createEffect, onCleanup, type Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { DrawerProps } from '../core/types';

export const Drawer: Component<DrawerProps> = (rawProps) => {
  const props = mergeProps(
    {
      open: false,
      anchor: 'left' as const,
      size: '280px',
      overlay: true,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'open',
    'onClose',
    'anchor',
    'size',
    'overlay',
    'children',
    'class',
    'style',
  ]);

  const drawerStyle = (): Record<string, string> => {
    const base: Record<string, string> = {
      position: 'fixed',
      'background-color': 'var(--ui-color-surface, #fff)',
      'box-shadow': 'var(--ui-shadow-xl)',
      'overflow-y': 'auto',
      display: 'flex',
      'flex-direction': 'column',
      transition: 'transform var(--ui-transition-base, 250ms)',
      'z-index': '1',
      'box-sizing': 'border-box',
    };

    const isOpen = local.open;
    switch (local.anchor) {
      case 'left':
        base.top = '0'; base.left = '0'; base.bottom = '0';
        base.width = local.size;
        base.transform = isOpen ? 'translateX(0)' : 'translateX(-100%)';
        break;
      case 'right':
        base.top = '0'; base.right = '0'; base.bottom = '0';
        base.width = local.size;
        base.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';
        break;
      case 'top':
        base.top = '0'; base.left = '0'; base.right = '0';
        base.height = local.size;
        base.transform = isOpen ? 'translateY(0)' : 'translateY(-100%)';
        break;
      case 'bottom':
        base.bottom = '0'; base.left = '0'; base.right = '0';
        base.height = local.size;
        base.transform = isOpen ? 'translateY(0)' : 'translateY(100%)';
        break;
    }

    return base;
  };

  createEffect(() => {
    if (local.open) {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          local.onClose?.();
        }
      };
      document.addEventListener('keydown', onKeyDown);
      onCleanup(() => document.removeEventListener('keydown', onKeyDown));
    }
  });

  return (
    <Portal>
      <Show when={local.open}>
        <div
          style={{
            position: 'fixed',
            inset: '0',
            'z-index': 'var(--ui-z-drawer, 1200)',
            'pointer-events': 'auto',
          }}
        >
          {/* Backdrop */}
          <Show when={local.overlay}>
            <div
              onClick={() => local.onClose?.()}
              style={{
                position: 'absolute',
                inset: '0',
                'background-color': 'rgba(0, 0, 0, 0.5)',
                opacity: '1',
                transition: 'opacity var(--ui-transition-base, 250ms)',
              }}
            />
          </Show>
          {/* Drawer panel */}
          <div
            class={local.class}
            style={{
              ...drawerStyle(),
              ...(local.style as Record<string, string> | undefined),
            }}
          >
            {local.children}
          </div>
        </div>
      </Show>
    </Portal>
  );
};
