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
      { x: "12:00", y: 88 },
    ],
  },
];

export function QuickstartWorkbenchExample() {
  return (
    <WorkbenchProvider initialState={{ timeWindow: { preset: "24h", label: "Last 24 hours" } }}>
      <WorkbenchShell
        nav={<div>Operations</div>}
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
                    { label: "Healthy", value: "healthy" },
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
          <WorkbenchPanel panelId="alerts" title="Alert triage" tone="warning">
            Alert table or triage queue goes here.
          </WorkbenchPanel>
        </PanelLayout>
      </WorkbenchShell>
    </WorkbenchProvider>
  );
}
