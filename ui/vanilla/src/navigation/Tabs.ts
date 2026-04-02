import { UIElement } from '../core/UIElement';
import { register } from '../core/register';

/**
 * `<ui-tabs>` — Tabbed navigation.
 *
 * @attr {string} value - Active tab value
 * @attr {string} variant - standard | pills | underlined
 * @attr {string} size - sm | md | lg
 *
 * @fires ui-change - { value: string }
 *
 * @example
 * ```html
 * <ui-tabs value="tab1" variant="underlined">
 *   <ui-tab value="tab1" label="Dashboard"></ui-tab>
 *   <ui-tab value="tab2" label="Settings"></ui-tab>
 *   <ui-tab-panel value="tab1">Dashboard content</ui-tab-panel>
 *   <ui-tab-panel value="tab2">Settings content</ui-tab-panel>
 * </ui-tabs>
 * ```
 */
export class UITabs extends UIElement {
  static observedAttributes = ['value', 'variant', 'size'];

  get value(): string { return this.getAttr('value'); }
  set value(v: string) { this.setAttribute('value', v); }

  protected styles(): string {
    return /* css */ `
      :host { display: block; }
      .tablist {
        display: flex;
        gap: 0;
        border-bottom: 2px solid var(--ui-color-border, #e2e8f0);
      }
      :host([variant="pills"]) .tablist { border-bottom: none; gap: var(--ui-space-1, 0.25rem); }

      ::slotted(ui-tab-panel) { display: none; }
      ::slotted(ui-tab-panel[active]) { display: block; }
    `;
  }

  protected template(): string {
    return `
      <div class="tablist" role="tablist" part="tablist">
        <slot name="tab"></slot>
      </div>
      <div class="panels" part="panels">
        <slot></slot>
      </div>
    `;
  }

  protected onConnected(): void {
    this.addEventListener('tab-select', ((e: CustomEvent) => {
      this.value = e.detail.value;
      this._syncPanels();
      this.emit('ui-change', { value: this.value });
    }) as EventListener);
    // Defer to let children connect
    requestAnimationFrame(() => this._syncPanels());
  }

  private _syncPanels(): void {
    const val = this.value;
    this.querySelectorAll('ui-tab').forEach((tab) => {
      tab.toggleAttribute('active', tab.getAttribute('value') === val);
    });
    this.querySelectorAll('ui-tab-panel').forEach((panel) => {
      panel.toggleAttribute('active', panel.getAttribute('value') === val);
    });
  }
}

/**
 * `<ui-tab>` — Individual tab button. Use inside `<ui-tabs>`.
 * @attr {string} value - Tab value
 * @attr {string} label - Tab label text
 * @attr {boolean} disabled
 */
export class UITab extends UIElement {
  static observedAttributes = ['value', 'label', 'active', 'disabled'];

  protected styles(): string {
    return /* css */ `
      :host { display: inline-flex; }

      button {
        all: unset;
        cursor: pointer;
        padding: var(--ui-space-2, 0.5rem) var(--ui-space-4, 1rem);
        font-family: inherit;
        font-size: var(--ui-text-sm, 0.875rem);
        font-weight: var(--ui-weight-medium, 500);
        color: var(--ui-color-text-secondary, #64748b);
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        transition: color 0.15s, border-color 0.15s, background 0.15s;
        white-space: nowrap;
      }
      button:hover { color: var(--ui-color-text, #0f172a); }
      button.active {
        color: var(--ui-color-primary, #4f46e5);
        border-bottom-color: var(--ui-color-primary, #4f46e5);
      }
      button:disabled { opacity: 0.5; cursor: not-allowed; }
      button:focus-visible { outline: 2px solid var(--ui-color-primary); outline-offset: -2px; }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.slot = 'tab';
  }

  protected template(): string {
    const label = this.getAttr('label');
    const active = this.getBoolAttr('active');
    const disabled = this.getBoolAttr('disabled');

    return `
      <button role="tab" aria-selected="${active}" ${disabled ? 'disabled' : ''} class="${active ? 'active' : ''}" part="tab">
        ${label || '<slot></slot>'}
      </button>
    `;
  }

  protected onRendered(): void {
    this.$('button')?.addEventListener('click', () => {
      if (!this.getBoolAttr('disabled')) {
        this.dispatchEvent(
          new CustomEvent('tab-select', {
            bubbles: true,
            composed: true,
            detail: { value: this.getAttr('value') },
          }),
        );
      }
    });
  }
}

/**
 * `<ui-tab-panel>` — Tab panel content. Shown when its `value` matches the parent tabs.
 * @attr {string} value
 */
export class UITabPanel extends UIElement {
  static observedAttributes = ['value', 'active'];

  protected styles(): string {
    return /* css */ `
      :host { display: none; }
      :host([active]) { display: block; padding: var(--ui-space-4, 1rem) 0; }
    `;
  }

  protected template(): string {
    return '<slot></slot>';
  }
}

register('ui-tabs', UITabs);
register('ui-tab', UITab);
register('ui-tab-panel', UITabPanel);
