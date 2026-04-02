# @risklab/ui-react

`@risklab/ui-react` is the recommended React UI surface for RiskLab.

Use it when you want analytical UI primitives that are easy to theme, compose,
and review in a serious application codebase.

## Install

```bash
npm install @risklab/ui-react
```

Peer dependencies:

- `react >= 18`
- `react-dom >= 18`

## Quick start

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

## Design-system fit

The package uses CSS custom properties for its token layer, so teams can align
it with existing typography, spacing, radii, and color systems without writing
a wrapper package.

```css
:root {
  --ui-color-primary: #0057d9;
  --ui-font-family: "Inter", sans-serif;
  --ui-radius-md: 6px;
}
```

Import the shared stylesheet once near your app root:

```ts
import "@risklab/ui-react/css";
```
