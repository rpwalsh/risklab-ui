import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-avatar>` — Avatar with image, initials, or fallback icon.
 *
 * @attr {string} src - Image URL
 * @attr {string} alt - Image alt text
 * @attr {string} size - xs | sm | md | lg | xl
 * @attr {string} variant - circular | rounded | square
 * @attr {string} initials - Fallback initials (e.g. "JD")
 */
export class UIAvatar extends UIElement {
  static observedAttributes = ['src', 'alt', 'size', 'variant', 'initials'];

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; }

      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: var(--ui-color-primary-subtle, #eef2ff);
        color: var(--ui-color-primary, #4f46e5);
        font-weight: var(--ui-weight-semibold, 600);
        user-select: none;
        flex-shrink: 0;
      }

      .avatar.size-xs { width: 24px; height: 24px; font-size: 10px; }
      .avatar.size-sm { width: 32px; height: 32px; font-size: 12px; }
      .avatar.size-md { width: 40px; height: 40px; font-size: 14px; }
      .avatar.size-lg { width: 48px; height: 48px; font-size: 18px; }
      .avatar.size-xl { width: 64px; height: 64px; font-size: 24px; }

      .avatar.variant-circular { border-radius: 50%; }
      .avatar.variant-rounded  { border-radius: var(--ui-radius-md, 0.5rem); }
      .avatar.variant-square   { border-radius: 0; }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    `;
  }

  protected template(): string {
    const src = this.getAttr('src');
    const alt = this.getAttr('alt', '');
    const size = this.getAttr('size', 'md');
    const variant = this.getAttr('variant', 'circular');
    const initials = this.getAttr('initials');

    const content = src
      ? `<img src="${src}" alt="${alt}" />`
      : `<span class="fallback">${initials || '?'}</span>`;

    return `<span class="avatar size-${size} variant-${variant}" part="avatar" role="img" aria-label="${alt || initials || 'avatar'}">${content}</span>`;
  }
}

register('ui-avatar', UIAvatar);
