# Release readiness

- Packages: `@risklab/ui-data`, `@risklab/ui`, `@risklab/ui-vanilla`, `@risklab/ui-react`, `@risklab/ui-vue`, `@risklab/ui-svelte`, `@risklab/ui-angular`, `@risklab/ui-lit`, `@risklab/ui-solid`, and `@risklab/workbench`
- Version: `1.0.0`
- Build: `npm run build:all`
- Validation: `npm run release:check`
- Tarball consumer test: `npm run smoke:install`
- Release workflow: `.github/workflows/release.yml`
- License: Apache-2.0 with package-specific `NOTICE` files
- ESM: all packages
- CommonJS: all packages except the Svelte-native package
- Browser support: evergreen browsers; custom-element lifecycle validation runs in Chromium
- Publication order: Styler and Icons, UI Data, Vanilla, UI Core, framework adapters, Workbench

Framework packages intentionally expose different host-framework component idioms while sharing tokens, accessibility contracts, styling, icons, and analytical data behavior.
