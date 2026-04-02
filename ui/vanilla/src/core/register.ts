/**
 * register() — Safe custom element registration.
 * Prevents duplicate registration errors.
 */
export function register(
  tagName: string,
  ctor: CustomElementConstructor,
): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ctor);
  }
}

/**
 * registerAll() — Register every @risklab/ui-vanilla component.
 * Call once at app entry. The public root entry now eagerly imports and
 * self-registers every component, so this remains as a compatibility helper.
 */
export function registerAll(): void {}
