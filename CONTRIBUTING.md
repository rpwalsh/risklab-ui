# Contributing

## Setup

```bash
npm install
```

## Validate before opening a PR

```bash
npm run typecheck:all
npm run test:all
npm run build:all
```

For release-sensitive changes:

```bash
npm run release:check
```

## Contribution rules

- Keep package boundaries clear.
- Keep public export maps truthful.
- Keep docs and examples on public package imports, not repo-private paths.
- Add or update tests when behavior changes.
- Keep token and CSS variable behavior stable across packages.
- Do not add demo-only behavior to package surfaces.

## Pull request checklist

- [ ] Build passes for changed workspaces
- [ ] Typecheck passes
- [ ] Tests pass or rationale is provided
- [ ] Public API changes are documented
- [ ] No placeholder copy or debug artifacts left behind
