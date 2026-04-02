/**
 * @risklab/ui-solid — Breadcrumbs
 * SolidJS breadcrumbs with separator between children.
 */

import {
  mergeProps,
  splitProps,
  children as resolveChildren,
  For,
  Show,
  type Component,
} from 'solid-js';
import type { BreadcrumbsProps } from '../core/types';

export const Breadcrumbs: Component<BreadcrumbsProps> = (rawProps) => {
  const props = mergeProps({ separator: '/' }, rawProps);
  const [local] = splitProps(props, ['separator', 'children', 'class', 'style']);

  const resolved = resolveChildren(() => local.children);

  const items = () => {
    const c = resolved();
    if (Array.isArray(c)) return c.filter(Boolean);
    if (c != null) return [c];
    return [];
  };

  return (
    <nav
      aria-label="Breadcrumb"
      class={local.class}
      style={{
        display: 'flex',
        'align-items': 'center',
        'font-size': 'var(--ui-text-sm, 0.875rem)',
        color: 'var(--ui-color-text-secondary, #64748b)',
        'font-family': 'var(--ui-font-family, inherit)',
        ...(local.style as Record<string, string> | undefined),
      }}
    >
      <ol
        style={{
          display: 'flex',
          'align-items': 'center',
          'list-style': 'none',
          margin: '0',
          padding: '0',
          'flex-wrap': 'wrap',
          gap: '0',
        }}
      >
        <For each={items()}>
          {(item, i) => (
            <li style={{ display: 'flex', 'align-items': 'center' }}>
              <Show when={i() > 0}>
                <span
                  style={{
                    'margin-inline': 'var(--ui-space-2, 0.5rem)',
                    'user-select': 'none',
                  }}
                  aria-hidden="true"
                >
                  {local.separator}
                </span>
              </Show>
              {item}
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
};
