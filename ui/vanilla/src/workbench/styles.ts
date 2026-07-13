export const WORKBENCH_CSS = `
  :host {
    display: block;
    box-sizing: border-box;
    min-width: 0;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  [data-rl-workbench] {
    color: var(--rlwb-text);
    background: var(--rlwb-bg);
    font-family: var(--rlwb-font-family);
  }

  .rlwb-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    height: 100%;
    min-height: var(--rlwb-shell-min-height, 100vh);
    background:
      radial-gradient(circle at top right, rgba(76, 141, 255, 0.08), transparent 26%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0)),
      var(--rlwb-bg);
  }

  .rlwb-shell--has-nav {
    grid-template-columns: var(--rlwb-nav-width) minmax(0, 1fr);
  }

  .rlwb-shell__nav,
  .rlwb-shell__topbar,
  .rlwb-shell__status,
  .rlwb-shell__inspector,
  .rlwb-panel,
  .rlwb-inspector {
    backdrop-filter: blur(16px);
  }

  .rlwb-shell__nav {
    border-right: 1px solid var(--rlwb-border);
    background: linear-gradient(180deg, var(--rlwb-surface), var(--rlwb-surface-muted));
    padding: calc(var(--rlwb-gap) * 1.25);
  }

  .rlwb-shell__frame {
    min-width: 0;
    display: grid;
    grid-template-rows: auto 1fr auto;
  }

  .rlwb-shell__topbar {
    min-height: var(--rlwb-topbar-height);
    border-bottom: 1px solid var(--rlwb-border);
    background: color-mix(in srgb, var(--rlwb-surface) 88%, transparent);
    padding: 0 var(--rlwb-gap);
    display: flex;
    align-items: center;
    gap: calc(var(--rlwb-gap) * 1.25);
    flex-wrap: wrap;
  }

  .rlwb-shell__body {
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }

  .rlwb-shell--has-inspector .rlwb-shell__body {
    grid-template-columns: minmax(0, 1fr) var(--rlwb-inspector-width);
  }

  .rlwb-shell__workspace {
    min-width: 0;
    padding: var(--rlwb-gap);
  }

  .rlwb-shell__inspector {
    border-left: 1px solid var(--rlwb-border);
    background: color-mix(in srgb, var(--rlwb-surface) 92%, transparent);
    padding: var(--rlwb-gap);
    overflow: auto;
  }

  .rlwb-shell__status {
    min-height: var(--rlwb-status-height);
    border-top: 1px solid var(--rlwb-border);
    background: color-mix(in srgb, var(--rlwb-surface) 84%, transparent);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 var(--rlwb-gap);
    color: var(--rlwb-text-muted);
    font-size: 12px;
  }

  .rlwb-panel-layout {
    display: grid;
    gap: var(--rlwb-gap);
  }

  .rlwb-panel-layout--dense {
    grid-auto-flow: dense;
  }

  .rlwb-panel,
  .rlwb-inspector {
    border: 1px solid var(--rlwb-border);
    border-radius: var(--rlwb-radius);
    background: color-mix(in srgb, var(--rlwb-surface) 94%, transparent);
    box-shadow: var(--rlwb-shadow);
  }

  .rlwb-panel {
    min-width: 0;
    min-height: 220px;
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
  }

  .rlwb-panel--collapsed {
    min-height: auto;
  }

  .rlwb-panel__header,
  .rlwb-inspector__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--rlwb-border);
  }

  .rlwb-panel__titles {
    min-width: 0;
    display: grid;
    gap: 4px;
  }

  .rlwb-panel__title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .rlwb-panel__subtitle {
    color: var(--rlwb-text-muted);
    font-size: 12px;
  }

  .rlwb-panel__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rlwb-panel__body,
  .rlwb-inspector__body {
    min-width: 0;
    min-height: 0;
  }

  .rlwb-panel__body {
    padding: var(--rlwb-panel-padding);
  }

  .rlwb-panel--padding-none .rlwb-panel__body {
    padding: 0;
  }

  .rlwb-panel--padding-sm .rlwb-panel__body {
    padding: 12px;
  }

  .rlwb-panel--padding-md .rlwb-panel__body {
    padding: var(--rlwb-panel-padding);
  }

  .rlwb-panel__footer {
    border-top: 1px solid var(--rlwb-border);
    padding: 12px 16px;
    color: var(--rlwb-text-muted);
    font-size: 12px;
  }

  .rlwb-panel--tone-positive {
    box-shadow: inset 0 1px 0 rgba(41, 179, 125, 0.4), var(--rlwb-shadow);
  }

  .rlwb-panel--tone-warning {
    box-shadow: inset 0 1px 0 rgba(242, 184, 75, 0.4), var(--rlwb-shadow);
  }

  .rlwb-panel--tone-danger {
    box-shadow: inset 0 1px 0 rgba(239, 100, 100, 0.4), var(--rlwb-shadow);
  }

  .rlwb-filter-bar,
  .rlwb-query-bar,
  .rlwb-time-range,
  .rlwb-filter-group,
  .rlwb-filter-group__options {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .rlwb-query-bar {
    min-width: min(100%, 360px);
  }

  .rlwb-query-label {
    color: var(--rlwb-text-muted);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .rlwb-query-input {
    width: 100%;
    min-height: 38px;
    border: 1px solid var(--rlwb-border);
    border-radius: 999px;
    background: color-mix(in srgb, var(--rlwb-surface) 88%, transparent);
    color: var(--rlwb-text);
    padding: 0 14px;
    font: inherit;
  }

  .rlwb-query-input::placeholder {
    color: var(--rlwb-text-muted);
  }

  .rlwb-query-input:focus-visible {
    outline: 2px solid var(--rlwb-accent);
    outline-offset: 2px;
  }

  .rlwb-filter-group__label {
    color: var(--rlwb-text-muted);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .rlwb-filter-chip,
  .rlwb-icon-button {
    border: 1px solid var(--rlwb-border);
    background: var(--rlwb-surface-muted);
    color: var(--rlwb-text);
    border-radius: 999px;
    cursor: pointer;
    transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
  }

  .rlwb-filter-chip {
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .rlwb-icon-button {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .rlwb-filter-chip[aria-pressed="true"],
  .rlwb-icon-button:hover,
  .rlwb-filter-chip:hover {
    background: var(--rlwb-accent-soft);
    border-color: var(--rlwb-accent);
  }

  .rlwb-filter-chip:focus-visible,
  .rlwb-icon-button:focus-visible {
    outline: 2px solid var(--rlwb-accent);
    outline-offset: 2px;
  }

  .rlwb-inspector__body {
    padding: var(--rlwb-panel-padding);
  }

  .rlwb-empty-state {
    color: var(--rlwb-text-muted);
    font-size: 13px;
    line-height: 1.5;
  }

  .rlwb-selection-list {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    margin: 0;
  }

  .rlwb-selection-list dt {
    color: var(--rlwb-text-muted);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .rlwb-selection-list dd {
    margin: 0;
    font-size: 13px;
  }

  .rlwb-hidden {
    display: none !important;
  }

  @media (max-width: 1080px) {
    .rlwb-shell--has-nav {
      grid-template-columns: minmax(0, 1fr);
    }

    .rlwb-shell__nav {
      display: none;
    }

    .rlwb-shell--has-inspector .rlwb-shell__body {
      grid-template-columns: minmax(0, 1fr);
    }

    .rlwb-shell__inspector {
      border-left: 0;
      border-top: 1px solid var(--rlwb-border);
    }

    .rlwb-query-bar {
      min-width: 100%;
    }
  }
`;
