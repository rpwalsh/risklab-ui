import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-skeleton>` — Placeholder loading skeleton with pulse/wave animations.
 *
 * @example
 * ```html
 * <ui-skeleton variant="text" width="200px" animation="pulse"></ui-skeleton>
 * <ui-skeleton variant="circular" width="48px" height="48px"></ui-skeleton>
 * <ui-skeleton variant="rectangular" height="120px" animation="wave"></ui-skeleton>
 * ```
 */
@customElement('ui-skeleton')
export class UiSkeleton extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .skeleton {
      display: block;
      background-color: var(--ui-skeleton-bg, rgba(0, 0, 0, 0.11));
    }

    .skeleton--text {
      height: 1.2em;
      border-radius: 4px;
      width: 100%;
      transform-origin: 0 55%;
      transform: scale(1, 0.6);
    }

    .skeleton--circular {
      border-radius: 50%;
    }

    .skeleton--rectangular {
      border-radius: 0;
    }

    .skeleton--rounded {
      border-radius: var(--ui-radius-md, 0.5rem);
    }

    /* Pulse */
    .skeleton--pulse {
      animation: ui-skeleton-pulse 1.5s ease-in-out 0.5s infinite;
    }

    @keyframes ui-skeleton-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    /* Wave */
    .skeleton--wave {
      overflow: hidden;
      position: relative;
    }
    .skeleton--wave::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: ui-skeleton-wave 1.6s linear 0.5s infinite;
    }

    @keyframes ui-skeleton-wave {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;

  @property({ type: String }) variant: 'text' | 'circular' | 'rectangular' | 'rounded' = 'text';
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';
  @property({ type: String }) animation: 'pulse' | 'wave' | 'none' = 'pulse';

  render() {
    const w = this.width || (this.variant === 'circular' ? '40px' : '100%');
    const h = this.height || (this.variant === 'text' ? '' : this.variant === 'circular' ? '40px' : '100px');

    return html`
      <span
        class="skeleton skeleton--${this.variant} ${this.animation !== 'none' ? `skeleton--${this.animation}` : ''}"
        style="width:${w};${h ? `height:${h};` : ''}"
        part="skeleton"
      ></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-skeleton': UiSkeleton;
  }
}
