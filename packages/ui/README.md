# @risklab/ui

`@risklab/ui` is the standalone vanilla RiskLab UI package.

Use it when you want:

- framework-agnostic Web Components
- zero runtime dependencies
- a package that can drop into static sites, dashboards, kiosks, or mixed stacks
- the same CSS token system used by the other RiskLab UI packages

If you are building a React application, prefer `@risklab/ui-react`.

## Install

```bash
npm install @risklab/ui
```

## Quick start

```ts
import "@risklab/ui/auto";
import "@risklab/ui/css";

document.body.innerHTML = `
  <div class="ui-root">
    <ui-button variant="filled" color="primary">Run report</ui-button>
    <ui-text-field label="Search" placeholder="Find assets"></ui-text-field>
  </div>
`;
```

Use `@risklab/ui/auto` when you want all built-in custom elements registered.
If you want more control, import the specific surface you need from
`@risklab/ui/inputs`, `@risklab/ui/layout`, `@risklab/ui/data-display`, and the
other category entrypoints.

## Styling and tokens

```ts
import "@risklab/ui/css";
```

RiskLab UI uses CSS custom properties so it can live inside an existing design
system without forcing one visual identity.

```css
:root {
  --ui-color-primary: #0057d9;
  --ui-color-surface: #ffffff;
  --ui-color-text: #111827;
  --ui-font-family: "Segoe UI", sans-serif;
  --ui-radius-md: 6px;
}
```

Dark mode is opt-in through `[data-ui-theme="dark"]` or `.ui-dark`.

## Package notes

- `@risklab/ui` is the default vanilla package.
- `@risklab/ui-vanilla` ships the same model for teams that prefer explicit
  package naming symmetry with `@risklab/ui-react`, `@risklab/ui-vue`, and the
  other framework packages.
- Published package surface has no install-time dependencies.
