# RiskLab UI Data

Framework-neutral data view engine for grids, trees, workbenches, and reports.
It provides immutable filtering, stable multi-sort, recursive grouping,
aggregations, facets, pagination, and serializable query contracts.

```ts
import { queryData } from '@risklab/ui-data';

const result = queryData(rows, {
  filters: [{ field: 'status', operator: 'equals', value: 'active' }],
  sort: [{ field: 'priority', direction: 'desc' }],
  groups: [{ field: 'region' }],
  aggregates: [{ field: 'cost', operation: 'sum', as: 'totalCost' }],
});
```
