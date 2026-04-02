import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * `<ui-drawer>` — Slide-out drawer with backdrop and anchor positions.
 *
 * @slot - Drawer content.
 * @fires ui-close - When drawer requests close (backdrop click, escape).
 *
 * @example
 * ```html
 * <ui-drawer open anchor="left" overlay>
 *   <nav>Sidebar content</nav>
 * </ui-drawer>
 * ```
 */
@customElement('ui-drawer')
export class UiDrawer extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }

    .container {
      position: fixed;
      inset: 0;
      z-index: var(--ui-z-drawer, 1200);
      pointer-events: none;
    }
    .container--open { pointer-events: auto; }

    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      opacity: 0;
      transition: opacity var(--ui-transition-base, 250ms);
    }
    .container--open .backdrop { opacity: 1; }

    .drawer {
      position: fixed;
      background: var(--ui-color-surface, #fff);
      box-shadow: var(--ui-shadow-xl, 0 20px 25px rgba(0,0,0,0.1));
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      transition: transform var(--ui-transition-base, 250ms);
      z-index: 1;
    }

    .drawer--left   { top: 0; left: 0; bottom: 0; width: var(--ui-drawer-size, 280px); transform: translateX(-100%); }
    .drawer--right  { top: 0; right: 0; bottom: 0; width: var(--ui-drawer-size, 280px); transform: translateX(100%); }
    .drawer--top    { top: 0; left: 0; right: 0; height: var(--ui-drawer-size, 320px); transform: translateY(-100%); }
    .drawer--bottom { bottom: 0; left: 0; right: 0; height: var(--ui-drawer-size, 320px); transform: translateY(100%); }

    .drawer--left.drawer--open,
    .drawer--right.drawer--open  { transform: translateX(0); }
    .drawer--top.drawer--open,
    .drawer--bottom.drawer--open { transform: translateY(0); }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) anchor: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @property({ type: String }) size = '280px';
  @property({ type: Boolean }) overlay = true;

  private _boundEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) this._requestClose();
  };

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this._boundEscape);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._boundEscape);
  }

  private _requestClose() {
    this.dispatchEvent(
      new CustomEvent('ui-close', { bubbles: true, composed: true }),
    );
    this.open = false;
  }

  private _onBackdropClick() {
    this._requestClose();
  }

  render() {
    return html`
      <div class="container ${this.open ? 'container--open' : ''}" ?inert=${!this.open}>
        ${this.overlay
          ? html`<div class="backdrop" @click=${this._onBackdropClick}></div>`
          : nothing}
        <div
          class="drawer drawer--${this.anchor} ${this.open ? 'drawer--open' : ''}"
          style="--ui-drawer-size:${this.size}"
          part="drawer"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-drawer': UiDrawer;
  }
}
