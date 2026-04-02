import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-switch>` — Toggle switch.
 *
 * @attr {boolean} checked
 * @attr {boolean} disabled
 * @attr {string} size - sm | md | lg
 * @attr {string} color - primary | secondary | success | …
 * @attr {string} label
 *
 * @fires ui-change - { checked: boolean }
 */
export class UISwitch extends UIElement {
  static observedAttributes = ['checked', 'disabled', 'size', 'color', 'label'];

  get checked(): boolean { return this.getBoolAttr('checked'); }
  set checked(v: boolean) {
    if (v) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
  }

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; align-items: center; gap: var(--ui-space-2, 0.5rem); cursor: pointer; }
      :host([disabled]) { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

      .track {
        position: relative;
        border-radius: var(--ui-radius-full, 9999px);
        background: var(--ui-color-border-strong, #cbd5e1);
        transition: background 0.2s;
        flex-shrink: 0;
      }
      .track.checked {
        background: var(--_sw-color, var(--ui-color-primary, #4f46e5));
      }

      .thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,.2);
      }

      /* Sizes */
      .track.size-sm { width: 32px; height: 18px; }
      .track.size-sm .thumb { width: 14px; height: 14px; }
      .track.size-sm.checked .thumb { transform: translateX(14px); }

      .track.size-md { width: 40px; height: 22px; }
      .track.size-md .thumb { width: 18px; height: 18px; }
      .track.size-md.checked .thumb { transform: translateX(18px); }

      .track.size-lg { width: 52px; height: 28px; }
      .track.size-lg .thumb { width: 24px; height: 24px; }
      .track.size-lg.checked .thumb { transform: translateX(24px); }

      :host([color="primary"])   .track { --_sw-color: var(--ui-color-primary); }
      :host([color="secondary"]) .track { --_sw-color: var(--ui-color-secondary); }
      :host([color="success"])   .track { --_sw-color: var(--ui-color-success); }
      :host([color="error"])     .track { --_sw-color: var(--ui-color-error); }

      label { font-size: var(--ui-text-sm); color: var(--ui-color-text); user-select: none; cursor: inherit; }

      :host(:focus-visible) .track { outline: 2px solid var(--ui-color-primary); outline-offset: 2px; }
    `;
  }

  protected template(): string {
    const size = this.getAttr('size', 'md');
    const checked = this.getBoolAttr('checked');
    const label = this.getAttr('label');

    return `
      <span class="track size-${size} ${checked ? 'checked' : ''}" role="switch" aria-checked="${checked}" tabindex="0" part="track">
        <span class="thumb" part="thumb"></span>
      </span>
      ${label ? `<label part="label">${label}</label>` : '<slot></slot>'}
    `;
  }

  protected onConnected(): void {
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'switch');
  }

  protected onRendered(): void {
    const track = this.$('.track');
    const toggle = () => {
      if (this.getBoolAttr('disabled')) return;
      this.checked = !this.checked;
      this.render();
      this.emit('ui-change', { checked: this.checked });
    };
    track?.addEventListener('click', toggle);
    track?.addEventListener('keydown', (e: Event) => {
      const key = (e as KeyboardEvent).key;
      if (key === ' ' || key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    });
  }
}

register('ui-switch', UISwitch);
