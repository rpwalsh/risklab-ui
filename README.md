# RiskLab UI

RiskLab UI is a package family for analytical application shells, dashboards,
operator workbenches, and data-heavy frontend products.

This repo ships:

- `@risklab/ui`: the default standalone vanilla Web Component package
- `@risklab/ui-react`: the recommended React UI surface
- framework-specific UI packages for Vue, Svelte, Angular, Lit, and Solid

## Package chooser

| Use case | Install | Notes |
| --- | --- | --- |
| Vanilla or Web Components UI | `npm install @risklab/ui` | Default no-framework package |
| React UI | `npm install @risklab/ui-react` | Recommended app-team path |
| Vue, Svelte, Angular, Lit, Solid | install the matching `@risklab/ui-*` package | Keep framework intent explicit during review |

## Five-minute quick starts

### Vanilla

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
npm run build:all
npm run test:all
npm run release:check
```

## License

Apache-2.0

Redistributions must preserve the applicable copyright, license, and notice
attributions in `LICENSE`, `LICENSE.txt`, and `NOTICE`.
