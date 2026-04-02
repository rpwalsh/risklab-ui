import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { SizeVariant, ColorVariant } from '../core/types';

/**
 * `<ui-progress>` — Linear or circular progress indicator.
 *
 * @example
 * ```html
 * <ui-progress value="60" type="linear" color="primary"></ui-progress>
 * <ui-progress variant="indeterminate" type="circular"></ui-progress>
 * ```
 */
@customElement('ui-progress')
export class UiProgress extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--ui-font-family, inherit);
    }

    /* ── Linear ─────────────────── */
    .linear-track {
      position: relative;
      overflow: hidden;
      width: 100%;
      background: var(--ui-color-border, #e2e8f0);
      border-radius: 9999px;
    }
    :host([size='sm']) .linear-track { height: 2px; }
    :host([size='md']) .linear-track { height: 4px; }
    :host([size='lg']) .linear-track { height: 8px; }

    .linear-bar {
      height: 100%;
      border-radius: inherit;
      background: var(--ui-progress-color, var(--ui-color-primary, #4f46e5));
      transition: width 0.4s linear;
    }

    .linear-bar--indeterminate {
      width: 50%;
      animation: ui-linear-indeterminate 1.5s ease-in-out infinite;
    }

    @keyframes ui-linear-indeterminate {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(300%); }
    }

    /* ── Circular ───────────────── */
    .circular {
      display: inline-block;
    }
    :host([size='sm']) .circular { width: 24px; height: 24px; }
    :host([size='md']) .circular { width: 40px; height: 40px; }
    :host([size='lg']) .circular { width: 56px; height: 56px; }

    .circular--indeterminate {
      animation: ui-circular-rotate 1.4s linear infinite;
    }

    @keyframes ui-circular-rotate {
      100% { transform: rotate(360deg); }
    }

    .circular-track { stroke: var(--ui-color-border, #e2e8f0); }
    .circular-bar   { stroke: var(--ui-progress-color, var(--ui-color-primary, #4f46e5)); transition: stroke-dashoffset 0.3s ease; }
    .circular-bar--indeterminate { animation: ui-circular-dash 1.4s ease-in-out infinite; }

    @keyframes ui-circular-dash {
      0%   { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
      50%  { stroke-dasharray: 100, 200; stroke-dashoffset: -15; }
      100% { stroke-dasharray: 100, 200; stroke-dashoffset: -125; }
    }

    /* Colors */
    :host([color='secondary']) { --ui-progress-color: var(--ui-color-secondary, #7c3aed); }
    :host([color='success'])   { --ui-progress-color: var(--ui-color-success, #16a34a); }
    :host([color='warning'])   { --ui-progress-color: var(--ui-color-warning, #d97706); }
    :host([color='error'])     { --ui-progress-color: var(--ui-color-error, #dc2626); }
    :host([color='info'])      { --ui-progress-color: var(--ui-color-info, #2563eb); }
    :host([color='neutral'])   { --ui-progress-color: var(--ui-color-neutral, #64748b); }
  `;

  @property({ type: Number }) value = 0;
  @property({ type: String }) variant: 'determinate' | 'indeterminate' = 'determinate';
  @property({ type: String }) type: 'linear' | 'circular' = 'linear';
  @property({ type: String, reflect: true }) size: SizeVariant = 'md';
  @property({ type: String, reflect: true }) color: ColorVariant = 'primary';

  private get _clampedValue(): number {
    return Math.max(0, Math.min(100, this.value));
  }

  private _renderLinear() {
    const isIndeterminate = this.variant === 'indeterminate';
    return html`
      <div class="linear-track" role="progressbar"
        aria-valuenow=${ifDefined(isIndeterminate ? undefined : this._clampedValue)}
        aria-valuemin="0" aria-valuemax="100"
        part="track"
      >
        <div
          class="linear-bar ${isIndeterminate ? 'linear-bar--indeterminate' : ''}"
          style=${isIndeterminate ? '' : `width:${this._clampedValue}%`}
          part="bar"
        ></div>
      </div>
    `;
  }

  private _renderCircular() {
    const isIndeterminate = this.variant === 'indeterminate';
    const r = 18;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (this._clampedValue / 100) * circumference;

    return html`
      <svg
        class="circular ${isIndeterminate ? 'circular--indeterminate' : ''}"
        viewBox="0 0 44 44"
        role="progressbar"
        aria-valuenow=${ifDefined(isIndeterminate ? undefined : this._clampedValue)}
        part="svg"
      >
        <circle class="circular-track" cx="22" cy="22" r=${r} fill="none" stroke-width="4"/>
        <circle
          class="circular-bar ${isIndeterminate ? 'circular-bar--indeterminate' : ''}"
          cx="22" cy="22" r=${r}
          fill="none" stroke-width="4"
          stroke-linecap="round"
          stroke-dasharray=${circumference}
          stroke-dashoffset=${isIndeterminate ? 0 : offset}
          transform="rotate(-90 22 22)"
        />
      </svg>
    `;
  }

  render() {
    return this.type === 'circular' ? this._renderCircular() : this._renderLinear();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-progress': UiProgress;
  }
}
