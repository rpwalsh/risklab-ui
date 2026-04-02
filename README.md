# RiskLab UI and Workbench

RiskLab UI and Workbench is a package family for analytical application shells,
operator workbenches, dashboards, and data-heavy frontend products.

This repo ships:

- `@risklab/ui`: the default standalone vanilla Web Component package
- `@risklab/workbench`: the React-first analytical shell and coordinated state layer
- `@risklab/ui-react`: the recommended React UI surface
- framework-specific UI packages for Vue, Svelte, Angular, Lit, and Solid

## Package chooser

| Use case | Install | Notes |
| --- | --- | --- |
| React analytical workbench | `npm install @risklab/workbench @risklab/charts @risklab/charts-react` | Recommended platform path for serious analytical apps |
| Vanilla or Web Components UI | `npm install @risklab/ui` | Default no-framework package |
| React UI | `npm install @risklab/ui-react` | Recommended app-team path |
| Vue, Svelte, Angular, Lit, Solid | install the matching `@risklab/ui-*` package | Keep framework intent explicit during review |

## Five-minute quick starts

### React workbench

```bash
npm install @risklab/workbench @risklab/charts @risklab/charts-react
```

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

### Vanilla UI

```bash
npm install @risklab/ui
```

```ts
import "@risklab/ui/auto";
import "@risklab/ui/css";

document.body.innerHTML = `
  <div class="ui-root">
    <ui-card>
      <ui-stack gap="12px">
        <ui-text-field label="Search" placeholder="Find assets"></ui-text-field>
        <ui-button variant="filled" color="primary">Run report</ui-button>
      </ui-stack>
    </ui-card>
  </div>
`;
```

### React

```bash
npm install @risklab/ui-react
```

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

More working references:

- [examples/quickstart-workbench.tsx](examples/quickstart-workbench.tsx)
- [docs/getting-started.md](docs/getting-started.md)
- [docs/design-system-integration.md](docs/design-system-integration.md)
- [examples/quickstart-react.tsx](examples/quickstart-react.tsx)
- [examples/quickstart-vanilla.ts](examples/quickstart-vanilla.ts)

## Design-system integration

RiskLab UI is designed to fit into an existing design system rather than replace
it.

- CSS custom properties are the contract for color, spacing, radius,
  typography, shadow, and focus tokens.
- `@risklab/ui` and `@risklab/ui-react` share the same token model.
- `@risklab/workbench` uses its own CSS-variable shell tokens so host products
  can translate workbench chrome without forking components.
- Tailwind, CSS Modules, and host design-token systems can wrap the package
  without needing a dedicated wrapper package.
- Dark mode is opt-in through `[data-ui-theme="dark"]` or `.ui-dark`.

## Trust and release posture

- Apache 2.0 licensing with `LICENSE`, `LICENSE.txt`, and `NOTICE`
- `SECURITY.md` with private disclosure guidance
- `CONTRIBUTING.md` with validation expectations
- no install-time `dependencies` in the publishable package set
- `npm run release:check` validates lint, types, tests, packing, and packed
  install smoke checks

## Local development

Requirements:

- Node.js `>=20`
- npm `>=10`

Useful commands:

```bash
npm run test
npm run build:all
npm run test:all
npm run release:check
```

## License

Apache-2.0

Redistributions must preserve the applicable copyright, license, and notice
attributions in `LICENSE`, `LICENSE.txt`, and `NOTICE`.
