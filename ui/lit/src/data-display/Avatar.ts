import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SizeVariant } from '../core/types';

/**
 * `<ui-avatar>` — User avatar: image, initials fallback, or icon slot.
 *
 * @example
 * ```html
 * <ui-avatar src="/photo.jpg" alt="Jane Doe" size="lg"></ui-avatar>
 * <ui-avatar initials="JD" variant="rounded" size="md"></ui-avatar>
 * ```
 */
@customElement('ui-avatar')
export class UiAvatar extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      width: var(--ui-avatar-size, 40px);
      height: var(--ui-avatar-size, 40px);
      font-family: var(--ui-font-family, inherit);
      font-weight: 600;
      line-height: 1;
      user-select: none;
      box-sizing: border-box;
      background-color: var(--ui-color-primary, #4f46e5);
      color: #fff;
    }

    :host([size='xs']) { --ui-avatar-size: 24px; font-size: 10px; }
    :host([size='sm']) { --ui-avatar-size: 32px; font-size: 13px; }
    :host([size='md']) { --ui-avatar-size: 40px; font-size: 16px; }
    :host([size='lg']) { --ui-avatar-size: 48px; font-size: 19px; }
    :host([size='xl']) { --ui-avatar-size: 64px; font-size: 26px; }

    :host([variant='circular']) { border-radius: 50%; }
    :host([variant='rounded'])  { border-radius: var(--ui-radius-md, 0.5rem); }
    :host([variant='square'])   { border-radius: 0; }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  `;

  @property({ type: String }) src = '';
  @property({ type: String }) alt = '';
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String, reflect: true }) variant: 'circular' | 'rounded' | 'square' = 'circular';
  @property({ type: String }) initials = '';

  render() {
    if (this.src) {
      return html`<img src=${this.src} alt=${this.alt} part="image" />`;
    }
    if (this.initials) {
      return html`<span part="initials">${this.initials}</span>`;
    }
    return html`
      <svg viewBox="0 0 24 24" width="65%" height="65%" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-avatar': UiAvatar;
  }
}
