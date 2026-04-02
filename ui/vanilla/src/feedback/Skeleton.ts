import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-skeleton>` — Content placeholder with loading animation.
 *
 * @attr {string} variant - text | circular | rectangular | rounded (default: text)
 * @attr {string} width - CSS width
 * @attr {string} height - CSS height
 * @attr {string} animation - pulse | wave | none (default: pulse)
 */
export class UISkeleton extends UIElement {
  static observedAttributes = ['variant', 'width', 'height', 'animation'];

  protected styles(): string {
    return /* css */ `
      :host { display: block; }

      .skeleton {
        background: var(--ui-gray-200, #e2e8f0);
        display: block;
      }

      .skeleton.variant-text {
        height: 1em;
        border-radius: var(--ui-radius-sm, 0.25rem);
        width: 100%;
      }
      .skeleton.variant-circular { border-radius: 50%; }
      .skeleton.variant-rectangular { border-radius: 0; }
      .skeleton.variant-rounded { border-radius: var(--ui-radius-md, 0.5rem); }

      /* Pulse animation */
      .skeleton.anim-pulse {
        animation: pulse 1.5s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      /* Wave animation */
      .skeleton.anim-wave {
        position: relative;
        overflow: hidden;
      }
      .skeleton.anim-wave::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: wave 1.6s linear infinite;
      }
      @keyframes wave {
        from { transform: translateX(-100%); }
        to   { transform: translateX(100%); }
      }
    `;
  }

  protected template(): string {
    const variant = this.getAttr('variant', 'text');
    const width = this.getAttr('width', variant === 'circular' ? '40px' : '100%');
    const height = this.getAttr('height', variant === 'circular' ? '40px' : variant === 'text' ? '1em' : '100px');
    const animation = this.getAttr('animation', 'pulse');

    return `<span
      class="skeleton variant-${variant} anim-${animation}"
      style="width:${width};height:${height}"
      aria-hidden="true"
      part="skeleton"
    ></span>`;
  }
}

register('ui-skeleton', UISkeleton);
