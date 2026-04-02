# @risklab/ui-vanilla

Framework-agnostic Web Component UI package for RiskLab.

This is the explicit vanilla alias for teams that want package naming symmetry
with `@risklab/ui-react`, `@risklab/ui-vue`, and the other framework packages.
If you want the default root vanilla package instead, install `@risklab/ui`.

## Install

```bash
npm install @risklab/ui-vanilla
```

## Quick start

```ts
import "@risklab/ui-vanilla/auto";
import "@risklab/ui-vanilla/css";

document.body.innerHTML = `
  <div class="ui-root">
    <ui-button variant="filled" color="primary">Deploy</ui-button>
    <ui-badge color="success">Ready</ui-badge>
  </div>
`;
```

## Styling

RiskLab UI uses CSS custom properties, so the easiest way to integrate with an
existing design system is to override tokens at the host app level.

```css
:root {
  --ui-color-primary: #0057d9;
  --ui-color-text: #111827;
  --ui-radius-md: 6px;
}
```
