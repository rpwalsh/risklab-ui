import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../src/theme/ThemeProvider';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('ThemeProvider token units', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it('serializes time and length tokens with semantic units', () => {
    act(() => root.render(<ThemeProvider mode="light"><span>content</span></ThemeProvider>));
    const wrapper = host.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--ui-duration')).toBe('200ms');
    expect(wrapper.style.getPropertyValue('--ui-duration-fast')).toBe('100ms');
    expect(wrapper.style.getPropertyValue('--ui-space-4')).toMatch(/px$/);
    expect(wrapper.style.getPropertyValue('--ui-line-height')).not.toMatch(/px$/);
  });
});
