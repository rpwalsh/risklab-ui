import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-drawer>` — Slide-out panel (sidebar, mobile nav, etc.)
 *
 * @attr {boolean} open
 * @attr {string} anchor - left | right | top | bottom (default: left)
 * @attr {string} size - CSS width/height (default: 280px)
 * @attr {boolean} overlay - Show backdrop (default: true)
 *
 * @fires ui-close
 */
export class UIDrawer extends UIElement {
  static observedAttributes = ['open', 'anchor', 'size', 'overlay'];

  get open(): boolean { return this.getBoolAttr('open'); }
  set open(v: boolean) {
    if (v) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  protected styles(): string {
    return /* css */ `
      :host { display: contents; }

      .backdrop {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0,0,0,0.4);
        animation: fadeIn 0.15s;
      }
      :host([open]) .backdrop { display: block; }
      :host(:not([overlay])) .backdrop { background: transparent; pointer-events: none; }

      .panel {
        position: fixed;
        z-index: 10000;
        background: var(--ui-color-surface, #fff);
        box-shadow: 0 8px 30px rgba(0,0,0,.15);
        overflow-y: auto;
        transition: transform 0.25s ease;
      }

      /* Left */
      :host([anchor="left"]) .panel, .panel.anchor-left {
        top: 0; bottom: 0; left: 0;
        width: var(--_drawer-size, 280px);
        transform: translateX(-100%);
      }
      :host([open][anchor="left"]) .panel, :host([open]) .panel.anchor-left {
        transform: translateX(0);
      }

      /* Right */
      :host([anchor="right"]) .panel, .panel.anchor-right {
        top: 0; bottom: 0; right: 0;
        width: var(--_drawer-size, 280px);
        transform: translateX(100%);
      }
      :host([open][anchor="right"]) .panel, :host([open]) .panel.anchor-right {
        transform: translateX(0);
      }

      /* Top */
      :host([anchor="top"]) .panel, .panel.anchor-top {
        top: 0; left: 0; right: 0;
        height: var(--_drawer-size, 280px);
        transform: translateY(-100%);
      }
      :host([open][anchor="top"]) .panel, :host([open]) .panel.anchor-top {
        transform: translateY(0);
      }

      /* Bottom */
      :host([anchor="bottom"]) .panel, .panel.anchor-bottom {
        bottom: 0; left: 0; right: 0;
        height: var(--_drawer-size, 280px);
        transform: translateY(100%);
      }
      :host([open][anchor="bottom"]) .panel, :host([open]) .panel.anchor-bottom {
        transform: translateY(0);
      }

      .content { padding: var(--ui-space-4, 1rem); }

      @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    `;
  }

  protected template(): string {
    const anchor = this.getAttr('anchor', 'left');
    const size = this.getAttr('size', '280px');

    return `
      <div class="backdrop" part="backdrop"></div>
      <div class="panel anchor-${anchor}" style="--_drawer-size: ${size}" role="dialog" part="panel">
        <div class="content" part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  protected onRendered(): void {
    this.$('.backdrop')?.addEventListener('click', () => {
      this.open = false;
      this.emit('ui-close');
    });
  }
}

register('ui-drawer', UIDrawer);
