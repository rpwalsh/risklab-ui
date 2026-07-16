# Coverage policy

`npm run test:coverage` enforces at least 80% statement, function, and line coverage on the framework-neutral runtime that powers the root `@risklab/ui` package. Branch coverage is gated at 70% because custom-element rendering includes browser capability and accessibility fallbacks that are also exercised by the Chromium lifecycle suite.

Framework adapters are verified independently through type checks, package tests, clean builds, installed-tarball smoke tests, and browser tests. Generated barrels, declaration-only modules, and the side-effect-only auto-registration entry are not counted as executable unit-test coverage.
