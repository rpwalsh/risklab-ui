/**
 * UIElement — Base class for all @risklab/ui-vanilla Web Components.
 *
 * Provides:
 *  - Shadow DOM encapsulation with shared design tokens
 *  - Reactive attribute observation with auto-rerender
 *  - Type-safe property accessors
 *  - Lifecycle helpers (connectedCallback, attributeChangedCallback)
 *  - Shared stylesheet injection (CSS custom properties)
 */
export abstract class UIElement extends HTMLElement {
  /** Shadow root for encapsulated rendering */
  protected root: ShadowRoot;

  /** Whether initial render has happened */
  private _initialized = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this._injectTokenSheet();
    this.render();
    this._initialized = true;
    this.onConnected();
  }

  disconnectedCallback(): void {
    this.onDisconnected();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (this._initialized && oldValue !== newValue) {
      this.render();
    }
  }

  /** Override to run logic after first render. */
  protected onConnected(): void {}

  /** Override to clean up resources. */
  protected onDisconnected(): void {}

  /** Subclasses implement this to produce their shadow DOM content. */
  protected abstract template(): string;

  /** Optional component-scoped styles. */
  protected styles(): string {
    return '';
  }

  /** Re-render the shadow DOM. */
  protected render(): void {
    const styles = this.styles();
    this.root.innerHTML =
      (styles ? `<style>${styles}</style>` : '') + this.template();
    this.onRendered();
  }

  /** Override to attach event listeners after each render. */
  protected onRendered(): void {}

  // ─── Helpers ───────────────────────────────────────────────────────

  /** Read a boolean attribute (presence = true). */
  protected getBoolAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  /** Read a string attribute with a default. */
  protected getAttr(name: string, fallback = ''): string {
    return this.getAttribute(name) ?? fallback;
  }

  /** Read a numeric attribute with a default. */
  protected getNumAttr(name: string, fallback = 0): number {
    const val = this.getAttribute(name);
    return val !== null ? Number(val) : fallback;
  }

  /** Emit a typed custom event. */
  protected emit<T = unknown>(name: string, detail?: T): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }

  /** Query an element inside the shadow root. */
  protected $<T extends HTMLElement = HTMLElement>(
    selector: string,
  ): T | null {
    return this.root.querySelector<T>(selector);
  }

  /** Query all elements inside the shadow root. */
  protected $$<T extends HTMLElement = HTMLElement>(
    selector: string,
  ): T[] {
    return Array.from(this.root.querySelectorAll<T>(selector));
  }

  // ─── Token injection ──────────────────────────────────────────────

  /** Inject CSS custom properties into Shadow DOM so tokens pass through. */
  private _injectTokenSheet(): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        /* Inherit all --ui-* tokens from light DOM */
        font-family: var(--ui-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        color: var(--ui-color-text, #0f172a);
        box-sizing: border-box;
      }
      :host([hidden]) { display: none !important; }
      *, *::before, *::after { box-sizing: inherit; }
    `);
    this.root.adoptedStyleSheets = [sheet];
  }
}
