import React, { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import {
  EntityInspector,
  FilterBar,
  PanelLayout,
  QueryBar,
  TimeRangeControl,
  WorkbenchPanel,
  WorkbenchProvider,
  WorkbenchShell,
  createSavedWorkbenchView,
  parseSavedWorkbenchView,
  useWorkbench,
} from '../../ui/react/src/workbench';

describe('RiskLab workbench package', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('coordinates filters, time range, selection, and panel state in a single workbench shell', async () => {
    function Harness() {
      const { state, actions } = useWorkbench();

      return (
        <WorkbenchShell
          nav={<div>Ops</div>}
          topbar={
            <>
              <QueryBar />
              <FilterBar
                filters={[
                  {
                    key: 'severity',
                    label: 'Severity',
                    options: [
                      { label: 'Critical', value: 'critical' },
                      { label: 'Warning', value: 'warning' },
                    ],
                  },
                ]}
              />
              <TimeRangeControl
                options={[
                  { label: '1h', value: { preset: '1h', label: 'Last hour' } },
                  { label: '24h', value: { preset: '24h', label: 'Last 24 hours' } },
                ]}
              />
            </>
          }
          inspector={
            <EntityInspector
              renderContent={(selection) =>
                selection ? <div data-testid="selection-label">{selection.label}</div> : null
              }
            />
          }
        >
          <button
            type="button"
            onClick={() => actions.setSelection({ entityId: 'srv-42', label: 'Server 42' })}
          >
            Inspect server
          </button>
          <PanelLayout>
            <WorkbenchPanel panelId="latency" title="Latency" collapsible>
              <pre data-testid="state-json">{JSON.stringify(state)}</pre>
            </WorkbenchPanel>
          </PanelLayout>
        </WorkbenchShell>
      );
    }

    await act(async () => {
      root.render(
        <WorkbenchProvider>
          <Harness />
        </WorkbenchProvider>,
      );
    });

    const criticalButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Critical',
    );
    const queryInput = container.querySelector('input[type="search"]') as HTMLInputElement | null;
    const dayButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === '24h',
    );
    const inspectButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Inspect server',
    );
    const collapseButton = container.querySelector('[aria-label="Collapse panel"]');

    act(() => {
      if (queryInput) {
        const setValue = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'value',
        )?.set;
        setValue?.call(queryInput, 'service:payments');
        queryInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      criticalButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      dayButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      inspectButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(criticalButton?.getAttribute('aria-pressed')).toBe('true');
    expect(container.textContent).toContain('Server 42');
    expect(queryInput?.value).toBe('service:payments');
    expect(container.textContent).toContain('"query":"service:payments"');
    expect(container.textContent).toContain('"severity":"critical"');
    expect(container.textContent).toContain('"preset":"24h"');
    expect(container.textContent).toContain('"entityId":"srv-42"');

    act(() => {
      collapseButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(container.querySelector('[data-panel-id="latency"]')?.getAttribute('data-collapsed')).toBe('true');
  });

  it('serializes and restores saved workbench views', () => {
    const saved = createSavedWorkbenchView({
      version: 1,
      query: 'host:prod',
      filters: { severity: 'critical' },
      timeWindow: { preset: '24h', label: 'Last 24 hours' },
      selection: { entityId: 'srv-42', label: 'Server 42' },
      compare: { enabled: true, baselineLabel: 'Previous day' },
      panels: {
        alerts: {
          collapsed: false,
          filters: { owner: 'platform' },
        },
      },
    });

    const restored = parseSavedWorkbenchView(JSON.stringify(saved));

    expect(restored?.query).toBe('host:prod');
    expect(restored?.filters.severity).toBe('critical');
    expect(restored?.timeWindow?.preset).toBe('24h');
    expect(restored?.selection?.entityId).toBe('srv-42');
    expect(restored?.panels.alerts?.filters?.owner).toBe('platform');
  });
});
