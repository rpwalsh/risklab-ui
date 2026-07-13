import { UIElement } from '../core/UIElement';
import { register } from '../core/register';
import type { WorkbenchState, WorkbenchStore } from './state';
import type { WorkbenchThemeTokens, WorkbenchTone } from './theme';
import { createWorkbenchStore } from './state';
import { serializeThemeStyle, slotHasContent } from './helpers';
import { WORKBENCH_CSS } from './styles';

export class UIWorkbenchShell extends UIElement {
  static observedAttributes = ['tone'];

  private _store?: WorkbenchStore;
  private _theme?: Partial<WorkbenchThemeTokens>;
  private _initialState?: Partial<WorkbenchState>;
  private hasNav = false;
  private hasInspector = false;
  private hasTopbar = false;
  private hasStatus = false;

  get tone(): WorkbenchTone {
    return (this.getAttribute('tone') as WorkbenchTone | null) ?? 'dark';
  }

  set tone(value: WorkbenchTone) {
    this.setAttribute('tone', value);
  }

  get theme(): Partial<WorkbenchThemeTokens> | undefined {
    return this._theme;
  }

  set theme(value: Partial<WorkbenchThemeTokens> | undefined) {
    this._theme = value;
    this.render();
  }

  get initialState(): Partial<WorkbenchState> | undefined {
    return this._initialState;
  }

  set initialState(value: Partial<WorkbenchState> | undefined) {
    this._initialState = value;
    if (!this._store) {
      this.render();
    }
  }

  get store(): WorkbenchStore {
    if (!this._store) {
      this._store = createWorkbenchStore(this._initialState);
    }
    return this._store;
  }

  set store(value: WorkbenchStore | null | undefined) {
    this._store = value ?? undefined;
    this.render();
  }

  get workbenchStore(): WorkbenchStore {
    return this.store;
  }

  protected styles(): string {
    return WORKBENCH_CSS;
  }

  protected template(): string {
    const classes = [
      'rlwb-shell',
      this.hasNav && 'rlwb-shell--has-nav',
      this.hasInspector && 'rlwb-shell--has-inspector',
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <div data-rl-workbench="" class="${classes}" style="${serializeThemeStyle(this.tone, this._theme)}">
        <aside class="rlwb-shell__nav${this.hasNav ? '' : ' rlwb-hidden'}">
          <slot name="nav"></slot>
        </aside>
        <div class="rlwb-shell__frame">
          <header class="rlwb-shell__topbar${this.hasTopbar ? '' : ' rlwb-hidden'}">
            <slot name="topbar"></slot>
          </header>
          <div class="rlwb-shell__body">
            <main class="rlwb-shell__workspace">
              <slot></slot>
            </main>
            <aside class="rlwb-shell__inspector${this.hasInspector ? '' : ' rlwb-hidden'}">
              <slot name="inspector"></slot>
            </aside>
          </div>
          <footer class="rlwb-shell__status${this.hasStatus ? '' : ' rlwb-hidden'}">
            <slot name="status"></slot>
          </footer>
        </div>
      </div>
    `;
  }

  protected onRendered(): void {
    const navSlot = this.$<HTMLSlotElement>('slot[name="nav"]');
    const topbarSlot = this.$<HTMLSlotElement>('slot[name="topbar"]');
    const inspectorSlot = this.$<HTMLSlotElement>('slot[name="inspector"]');
    const statusSlot = this.$<HTMLSlotElement>('slot[name="status"]');

    const handleSlotChange = () => {
      const nextHasNav = slotHasContent(navSlot);
      const nextHasTopbar = slotHasContent(topbarSlot);
      const nextHasInspector = slotHasContent(inspectorSlot);
      const nextHasStatus = slotHasContent(statusSlot);

      if (
        nextHasNav !== this.hasNav
        || nextHasTopbar !== this.hasTopbar
        || nextHasInspector !== this.hasInspector
        || nextHasStatus !== this.hasStatus
      ) {
        this.hasNav = nextHasNav;
        this.hasTopbar = nextHasTopbar;
        this.hasInspector = nextHasInspector;
        this.hasStatus = nextHasStatus;
        this.render();
      }
    };

    navSlot?.addEventListener('slotchange', handleSlotChange);
    topbarSlot?.addEventListener('slotchange', handleSlotChange);
    inspectorSlot?.addEventListener('slotchange', handleSlotChange);
    statusSlot?.addEventListener('slotchange', handleSlotChange);
    handleSlotChange();
  }
}

register('ui-workbench-shell', UIWorkbenchShell);
