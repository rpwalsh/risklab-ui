import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-progress>` — Linear and circular progress indicators.
 *
 * @attr {number} value - Progress value (0-100). Omit for indeterminate.
 * @attr {string} variant - linear | circular (default: linear)
 * @attr {string} size - sm | md | lg
 * @attr {string} color
 */
export class UIProgress extends UIElement {
  static observedAttributes = ['value', 'variant', 'size', 'color'];

  protected styles(): string {
    return /* css */ `
      :host { display: block; }

      /* Linear */
      .track {
        width: 100%;
        background: var(--ui-color-border, #e2e8f0);
        border-radius: var(--ui-radius-full, 9999px);
        overflow: hidden;
      }
      .track.size-sm { height: 4px; }
      .track.size-md { height: 6px; }
      .track.size-lg { height: 8px; }

      .bar {
        height: 100%;
        background: var(--_pg-color, var(--ui-color-primary, #4f46e5));
        border-radius: inherit;
        transition: width 0.3s ease;
      }

      .bar.indeterminate {
        width: 40% !important;
        animation: slide 1.5s ease-in-out infinite;
      }

      @keyframes slide {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
      }

      /* Circular */
      .circular {
        display: inline-flex;
        position: relative;
      }
      .circular.size-sm svg { width: 24px; height: 24px; }
      .circular.size-md svg { width: 40px; height: 40px; }
      .circular.size-lg svg { width: 56px; height: 56px; }

      .circular-track {
        stroke: var(--ui-color-border, #e2e8f0);
        fill: none;
      }
      .circular-bar {
        stroke: var(--_pg-color, var(--ui-color-primary, #4f46e5));
        fill: none;
        stroke-linecap: round;
        transition: stroke-dashoffset 0.3s;
        transform: rotate(-90deg);
        transform-origin: center;
      }
      .circular-bar.indeterminate {
        animation: spin-circ 1.5s linear infinite;
      }
      @keyframes spin-circ {
        to { transform: rotate(270deg); }
      }

      :host([color="primary"])   { --_pg-color: var(--ui-color-primary); }
      :host([color="secondary"]) { --_pg-color: var(--ui-color-secondary); }
      :host([color="success"])   { --_pg-color: var(--ui-color-success); }
      :host([color="error"])     { --_pg-color: var(--ui-color-error); }
      :host([color="warning"])   { --_pg-color: var(--ui-color-warning); }
      :host([color="info"])      { --_pg-color: var(--ui-color-info); }
    `;
  }

  protected template(): string {
    const variant = this.getAttr('variant', 'linear');
    const size = this.getAttr('size', 'md');
    const hasValue = this.hasAttribute('value');
    const value = this.getNumAttr('value', 0);

    if (variant === 'circular') {
      const circumference = 2 * Math.PI * 18; // r=18 in viewBox 44
      const offset = hasValue ? circumference * (1 - value / 100) : circumference * 0.75;

      return `
        <div class="circular size-${size}" role="progressbar" aria-valuenow="${hasValue ? value : ''}" aria-valuemin="0" aria-valuemax="100" part="circular">
          <svg viewBox="0 0 44 44">
            <circle class="circular-track" cx="22" cy="22" r="18" stroke-width="4" />
            <circle class="circular-bar ${hasValue ? '' : 'indeterminate'}" cx="22" cy="22" r="18" stroke-width="4"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}" />
          </svg>
        </div>
      `;
    }

    return `
      <div class="track size-${size}" role="progressbar" aria-valuenow="${hasValue ? value : ''}" aria-valuemin="0" aria-valuemax="100" part="track">
        <div class="bar ${hasValue ? '' : 'indeterminate'}" style="width: ${hasValue ? value : 0}%" part="bar"></div>
      </div>
    `;
  }
}

register('ui-progress', UIProgress);
