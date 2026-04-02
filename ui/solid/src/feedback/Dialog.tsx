/**
 * @risklab/ui-solid — Dialog
 * SolidJS modal/dialog using Portal and Show.
 */

import { mergeProps, splitProps, Show, createEffect, onCleanup, type Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { DialogProps } from '../core/types';
import { sizeMap } from '../core/tokens';

export const Dialog: Component<DialogProps> = (rawProps) => {
  const props = mergeProps(
    {
      open: false,
      modal: true,
      size: 'md' as const,
    },
    rawProps,
  );

  const [local] = splitProps(props, [
    'open',
    'onClose',
    'modal',
    'size',
    'children',
    'class',
    'style',
  ]);

  const maxWidth = (): string => {
    const m: Record<string, string> = {
      xs: '320px',
      sm: '440px',
      md: '560px',
      lg: '720px',
      xl: '900px',
    };
    return m[local.size] ?? '560px';
  };

  const handleBackdrop = () => {
    if (local.modal) {
      local.onClose?.();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      local.onClose?.();
    }
  };

  createEffect(() => {
    if (local.open) {
      const onDocKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          local.onClose?.();
        }
      };
      document.addEventListener('keydown', onDocKeyDown);
      onCleanup(() => document.removeEventListener('keydown', onDocKeyDown));
    }
  });

  return (
    <Show when={local.open}>
      <Portal>
        <div
          role="dialog"
          aria-modal={local.modal}
          class={local.class}
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            inset: '0',
            'z-index': 'var(--ui-z-modal, 1300)',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            ...(local.style as Record<string, string> | undefined),
          }}
        >
          {/* Backdrop */}
          <div
            onClick={handleBackdrop}
            style={{
              position: 'absolute',
              inset: '0',
              'background-color': 'rgba(0, 0, 0, 0.5)',
            }}
          />
          {/* Content */}
          <div
            style={{
              position: 'relative',
              'background-color': 'var(--ui-color-surface, #fff)',
              'border-radius': 'var(--ui-radius-lg, 0.75rem)',
              'box-shadow': 'var(--ui-shadow-xl)',
              'max-width': maxWidth(),
              width: '90%',
              'max-height': '85vh',
              overflow: 'auto',
              padding: '1.5rem',
              'box-sizing': 'border-box',
              'font-family': 'var(--ui-font-family, inherit)',
              color: 'var(--ui-color-text)',
              'z-index': '1',
            }}
          >
            {local.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};
