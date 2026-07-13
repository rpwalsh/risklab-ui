import { vi } from 'vitest';

class TestStyleSheet {
  replaceSync(): void {}
}

Object.defineProperty(globalThis, 'CSSStyleSheet', { value: TestStyleSheet, configurable: true });
Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', { value: [], writable: true, configurable: true });
Object.defineProperty(globalThis, 'ResizeObserver', { value: class { observe(): void {} disconnect(): void {} }, configurable: true });
Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
