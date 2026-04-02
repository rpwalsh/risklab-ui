# Getting Started

This guide is the fastest honest path to a first successful RiskLab UI install.

## Choose your path

| If you are building | Install |
| --- | --- |
| React analytical workbench | `npm install @risklab/workbench @risklab/charts @risklab/charts-react` |
| React UI | `npm install @risklab/ui-react` |
| Vanilla or Web Components UI | `npm install @risklab/ui` |
| Vue, Svelte, Angular, Lit, Solid | install the matching `@risklab/ui-*` package |

## React workbench quick start

```tsx
import "@risklab/workbench/css";
import { Chart } from "@risklab/charts-react";
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

const series = [
  {
    id: "latency",
    name: "P95 latency",
    type: "line",
    data: [
      { x: "09:00", y: 112 },
      { x: "10:00", y: 96 },
      { x: "11:00", y: 104 },
    ],
  },
];

export function OpsWorkbench() {
  return (
    <WorkbenchProvider initialState={{ timeWindow: { preset: "24h" } }}>
      <WorkbenchShell
        topbar={
          <>
            <QueryBar />
            <FilterBar
              filters={[
                {
                  key: "severity",
                  label: "Severity",
                  options: [
                    { label: "Critical", value: "critical" },
                    { label: "Warning", value: "warning" },
                  ],
                },
              ]}
            />
            <TimeRangeControl />
          </>
        }
        inspector={<EntityInspector />}
      >
        <PanelLayout minColumnWidth={360}>
          <WorkbenchPanel panelId="latency" title="Service latency">
            <Chart
              title="P95 latency"
              height={320}
              series={series}
              yAxis={{ title: { text: "Milliseconds" } }}
            />
          </WorkbenchPanel>
        </PanelLayout>
      </WorkbenchShell>
    </WorkbenchProvider>
  );
}
```

Reference file: [examples/quickstart-workbench.tsx](../examples/quickstart-workbench.tsx)

## React UI quick start

```tsx
import "@risklab/ui-react/css";
import { Button, Card, Stack, TextField } from "@risklab/ui-react";

export function FiltersCard() {
  return (
    <Card>
      <Stack gap="12px">
        <TextField label="Search" placeholder="Find accounts" />
        <Button color="primary">Apply filters</Button>
      </Stack>
    </Card>
  );
}
```

Reference file: [examples/quickstart-react.tsx](../examples/quickstart-react.tsx)

## Vanilla quick start

```ts
import "@risklab/ui/auto";
import "@risklab/ui/css";

document.body.innerHTML = `
  <div class="ui-root">
    <ui-card>
      <ui-stack gap="12px">
        <ui-text-field label="Asset name" placeholder="Search assets"></ui-text-field>
        <ui-button variant="filled" color="primary">Run report</ui-button>
      </ui-stack>
    </ui-card>
  </div>
`;
```

Reference file: [examples/quickstart-vanilla.ts](../examples/quickstart-vanilla.ts)

## Package notes

- `@risklab/workbench` is the recommended shell, layout, and coordinated-state layer for serious React analytical apps.
- `@risklab/ui` is the default vanilla package.
- `@risklab/ui-vanilla` is the explicit alias when you want package naming symmetry.
- `@risklab/ui-react` is the recommended React UI entrypoint.

## What to evaluate next

- [docs/design-system-integration.md](design-system-integration.md)
- [SECURITY.md](../SECURITY.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
