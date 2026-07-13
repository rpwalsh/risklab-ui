# @risklab/workbench

`@risklab/workbench` is the React-first shell layer for building serious
analytical applications with RiskLab.

It is not a dashboard theme and it is not a chart wrapper. It gives you the
operator-grade application frame around charts, tables, inspectors, and dense
analytical workflows:

- `WorkbenchProvider` for coordinated state
- `WorkbenchShell` for the canonical app frame
- `PanelLayout` and `WorkbenchPanel` for dense panel composition
- `QueryBar` for global workbench query state
- `FilterBar` and `TimeRangeControl` for shared analytical controls
- `EntityInspector` for detail-on-selection workflows
- saved-view serialization for reproducible workspace state
- CSS-variable-based theming so it can embed into an existing product

## Install

```bash
npm install @risklab/workbench
```

The package has no install-time `dependencies`. It expects a host React app.

## Example

```tsx
import "@risklab/workbench/css";
import {
  EntityInspector,
  FilterBar,
  PanelLayout,
  QueryBar,
  TimeRangeControl,
  WorkbenchPanel,
  WorkbenchProvider,
  WorkbenchShell,
} from "@risklab/workbench";

const severityFilters = [
  {
    key: "severity",
    label: "Severity",
    options: [
      { label: "Critical", value: "critical" },
      { label: "Warning", value: "warning" },
      { label: "Healthy", value: "healthy" },
    ],
  },
];

const timeRanges = [
  { label: "1h", value: { preset: "1h", label: "Last hour" } },
  { label: "24h", value: { preset: "24h", label: "Last 24 hours" } },
  { label: "7d", value: { preset: "7d", label: "Last 7 days" } },
];

export function OpsWorkbench() {
  return (
    <WorkbenchProvider initialState={{ timeWindow: { preset: "24h" } }}>
      <WorkbenchShell
        nav={<div>Operations</div>}
        topbar={
          <>
            <QueryBar />
            <FilterBar filters={severityFilters} />
            <TimeRangeControl options={timeRanges} />
          </>
        }
        inspector={
          <EntityInspector
            renderContent={(selection) =>
              selection ? <div>{selection.label}</div> : null
            }
          />
        }
      >
        <PanelLayout minColumnWidth={360}>
          <WorkbenchPanel panelId="latency" title="Latency">
            Chart or table content goes here.
          </WorkbenchPanel>
          <WorkbenchPanel panelId="alerts" title="Active alerts">
            Alert list or triage table goes here.
          </WorkbenchPanel>
        </PanelLayout>
      </WorkbenchShell>
    </WorkbenchProvider>
  );
}
```

## Position in RiskLab

- Pair it with `@risklab/charts-react` when you need analytical charts.
- Pair it with `@risklab/ui-react` when you need lower-level React UI controls.
- Use it as the application spine when you need a serious analytical workbench,
  not just a component gallery.

## License

Apache-2.0

Redistributions must preserve the applicable copyright, license, and notice
attributions in `LICENSE` and `NOTICE`.
