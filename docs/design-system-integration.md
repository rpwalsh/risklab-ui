# Design-System Integration

RiskLab UI is designed to fit into an existing design system with a small number
of predictable integration surfaces.

## Current recommendation

### Adopt now

- `@risklab/ui` for vanilla or Web Component environments
- `@risklab/ui-react` for React applications
- CSS custom properties as the shared token contract

### Keep for specific teams

- framework-specific UI packages when you truly need framework-native components

### Defer for now

- dedicated Fluent wrapper package
- dedicated Chakra, Mantine, Ant, or shadcn wrapper packages

Those can come later if there is proven adoption pressure. Today the better move
is to keep the token contract stable and avoid wrapper sprawl.

## Token strategy

RiskLab UI uses CSS custom properties for:

- color
- spacing
- radius
- typography
- shadow
- focus

Example host override:

```css
:root {
  --ui-color-primary: #0057d9;
  --ui-color-surface: #ffffff;
  --ui-color-text: #111827;
  --ui-font-family: "Segoe UI", sans-serif;
  --ui-radius-md: 6px;
}
```

Dark mode is controlled with `[data-ui-theme="dark"]` or `.ui-dark`.

## Existing compatibility guidance

### Tailwind

Use the RiskLab CSS variable contract and let Tailwind utilities style layout,
shell, and surrounding surfaces. Do not add a Tailwind-only wrapper layer.

### Fluent

If a Fluent integration becomes necessary, the next step should be a token
bridge or theme mapping, not a duplicate component suite.

### Existing design systems

Start with token overrides before deciding to wrap or fork components. The UI
packages are designed to be visually adaptable without changing package APIs.
