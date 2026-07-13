import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Dialog } from '../../src/feedback/Dialog';
import { VirtualList } from '../../src/utils/VirtualList';
import {
  WorkbenchProvider,
  useWorkbenchActions,
  useWorkbenchSelector,
} from '../../src/workbench/state';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('UI runtime contracts', () => {
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
    document.body.style.overflow = '';
  });

  it('restores focus and body scrolling when a dialog unmounts', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    act(() => root.render(<Dialog open title="Details"><button>Confirm</button></Dialog>));
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 5)); });
    expect(document.activeElement?.textContent).toBe('Confirm');
    expect(document.body.style.overflow).toBe('hidden');
    await act(async () => root.render(<Dialog open={false} />));
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');
    trigger.remove();
  });

  it('renders the correct variable-height range at an item boundary', () => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => 100 });
    act(() => root.render(
      <VirtualList
        items={Array.from({ length: 20 }, (_, index) => index)}
        rowHeight={(item) => item % 2 === 0 ? 20 : 30}
        height={100}
        overscan={0}
        renderItem={(item, _index, style) => <div style={style}>Item {item}</div>}
      />,
    ));
    const list = host.querySelector('[role="list"]') as HTMLDivElement;
    act(() => {
      list.scrollTop = 50;
      list.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    expect(host.textContent).not.toContain('Item 0');
    expect(host.textContent).toContain('Item 2');
    if (descriptor) Object.defineProperty(HTMLElement.prototype, 'clientHeight', descriptor);
  });

  it('notifies only workbench consumers whose selected state changed', () => {
    let actions: ReturnType<typeof useWorkbenchActions> | undefined;
    let queryRenders = 0;
    let selectionRenders = 0;
    function QueryConsumer() {
      useWorkbenchSelector((state) => state.query);
      queryRenders += 1;
      return null;
    }
    function SelectionConsumer() {
      useWorkbenchSelector((state) => state.selection);
      selectionRenders += 1;
      return null;
    }
    function Controls() {
      actions = useWorkbenchActions();
      return null;
    }
    act(() => root.render(
      <WorkbenchProvider><QueryConsumer /><SelectionConsumer /><Controls /></WorkbenchProvider>,
    ));
    const queryBefore = queryRenders;
    const selectionBefore = selectionRenders;
    act(() => actions?.setSelection({ entityId: 'track-1' }));
    expect(queryRenders).toBe(queryBefore);
    expect(selectionRenders).toBe(selectionBefore + 1);
  });
});
