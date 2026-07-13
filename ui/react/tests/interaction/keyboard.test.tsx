import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Autocomplete } from '../../src/inputs/Autocomplete';
import { Menu } from '../../src/navigation/Menu';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('keyboard interaction', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    document.querySelectorAll('.ui-menu, .ui-menu__overlay').forEach((node) => node.remove());
    host.remove();
  });

  it('moves through enabled menu items and restores anchor focus on Escape', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const close = vi.fn();
    act(() => root.render(<Menu open anchorEl={anchor} onClose={close} items={[
      { key: 'a', label: 'Disabled', disabled: true },
      { key: 'b', label: 'Bravo' },
      { key: 'c', label: 'Charlie' },
    ]} />));
    const items = [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')];
    items[1]!.focus();
    act(() => items[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })));
    expect(document.activeElement).toBe(items[2]);
    act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    expect(close).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(anchor);
    anchor.remove();
  });

  it('skips disabled autocomplete options', () => {
    const change = vi.fn();
    act(() => root.render(<Autocomplete options={[
      { label: 'Alpha', value: 'a', disabled: true },
      { label: 'Bravo', value: 'b' },
    ]} onChange={change} />));
    const input = host.querySelector('input[role="combobox"]') as HTMLInputElement;
    act(() => input.focus());
    act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })));
    expect(input.getAttribute('aria-activedescendant')).toMatch(/-opt-1$/);
    act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
    expect(change.mock.calls[0]?.[0]).toMatchObject({ value: 'b' });
  });
});
