import type { CSSProperties } from 'react';

export interface ViewportLayoutAreaDefinition {
  column: string;
  row: string;
  overflow?: CSSProperties['overflow'];
  minHeight?: string | number;
}

export interface ViewportLayoutPreset {
  id: string;
  label: string;
  description: string;
  family: 'hud' | 'watchfloor' | 'operator' | 'matrix' | 'split';
  density: 'tight' | 'balanced' | 'broad';
  columns: string;
  rows: string;
  gap?: string | number;
  minHeight?: string | number;
  areas: Record<string, ViewportLayoutAreaDefinition>;
}

const VIEWPORT_COLUMNS = 'repeat(12, minmax(0, 1fr))';
const VIEWPORT_ROWS = 'repeat(10, minmax(0, 1fr))';

function area(
  column: string,
  row: string,
  overflow: CSSProperties['overflow'] = 'hidden',
): ViewportLayoutAreaDefinition {
  return { column, row, overflow, minHeight: 0 };
}

function preset(
  id: string,
  label: string,
  description: string,
  family: ViewportLayoutPreset['family'],
  density: ViewportLayoutPreset['density'],
  areas: ViewportLayoutPreset['areas'],
): ViewportLayoutPreset {
  return {
    id,
    label,
    description,
    family,
    density,
    columns: VIEWPORT_COLUMNS,
    rows: VIEWPORT_ROWS,
    gap: '8px',
    minHeight: 0,
    areas,
  };
}

export const viewportLayoutPresets = [
  preset('hud-alpha', 'HUD Alpha', 'Wide watch surface with compact side stack.', 'hud', 'tight', {
    analysis: area('1 / span 8', '1 / span 6'),
    alerts: area('9 / span 4', '1 / span 4'),
    entities: area('1 / span 4', '7 / span 2'),
    timeline: area('5 / span 4', '7 / span 2'),
    domain: area('9 / span 4', '5 / span 3'),
    support: area('1 / span 9', '9 / span 2'),
    selection: area('10 / span 3', '8 / span 3'),
  }),
  preset('hud-bravo', 'HUD Bravo', 'Hero analysis with thin alert tower and lower record band.', 'hud', 'tight', {
    analysis: area('1 / span 9', '1 / span 6'),
    alerts: area('10 / span 3', '1 / span 6'),
    entities: area('1 / span 4', '7 / span 2'),
    timeline: area('5 / span 5', '7 / span 2'),
    domain: area('10 / span 3', '7 / span 2'),
    support: area('1 / span 8', '9 / span 2'),
    selection: area('9 / span 4', '9 / span 2'),
  }),
  preset('hud-charlie', 'HUD Charlie', 'Front-weighted console with lower three-block review strip.', 'hud', 'tight', {
    analysis: area('1 / span 8', '1 / span 7'),
    alerts: area('9 / span 4', '1 / span 3'),
    entities: area('9 / span 4', '4 / span 4'),
    timeline: area('1 / span 4', '8 / span 3'),
    domain: area('5 / span 4', '8 / span 3'),
    support: area('9 / span 4', '8 / span 2'),
    selection: area('9 / span 4', '10 / span 1'),
  }),
  preset('hud-delta', 'HUD Delta', 'Top-heavy layout for chart-dominant mission review.', 'hud', 'balanced', {
    analysis: area('1 / span 10', '1 / span 5'),
    alerts: area('11 / span 2', '1 / span 5'),
    entities: area('1 / span 4', '6 / span 2'),
    timeline: area('5 / span 5', '6 / span 2'),
    domain: area('10 / span 3', '6 / span 2'),
    support: area('1 / span 8', '8 / span 3'),
    selection: area('9 / span 4', '8 / span 3'),
  }),
  preset('hud-echo', 'HUD Echo', 'Operator strip with deep lower support lane.', 'hud', 'balanced', {
    analysis: area('1 / span 7', '1 / span 6'),
    alerts: area('8 / span 5', '1 / span 3'),
    entities: area('8 / span 5', '4 / span 3'),
    timeline: area('1 / span 5', '7 / span 2'),
    domain: area('6 / span 4', '7 / span 2'),
    support: area('10 / span 3', '7 / span 2'),
    selection: area('1 / span 12', '9 / span 2'),
  }),
  preset('hud-foxtrot', 'HUD Foxtrot', 'Balanced heads-up board with long evidence deck.', 'hud', 'balanced', {
    analysis: area('1 / span 8', '1 / span 5'),
    alerts: area('9 / span 4', '1 / span 5'),
    entities: area('1 / span 3', '6 / span 2'),
    timeline: area('4 / span 5', '6 / span 2'),
    domain: area('9 / span 4', '6 / span 2'),
    support: area('1 / span 9', '8 / span 3'),
    selection: area('10 / span 3', '8 / span 3'),
  }),
  preset('watchfloor-alpha', 'Watchfloor Alpha', 'Equalized watch cells with strong timeline lane.', 'watchfloor', 'tight', {
    analysis: area('1 / span 7', '1 / span 6'),
    alerts: area('8 / span 5', '1 / span 2'),
    entities: area('8 / span 5', '3 / span 2'),
    timeline: area('8 / span 5', '5 / span 2'),
    domain: area('1 / span 4', '7 / span 2'),
    support: area('5 / span 4', '7 / span 2'),
    selection: area('9 / span 4', '7 / span 4'),
  }),
  preset('watchfloor-bravo', 'Watchfloor Bravo', 'Tall analysis lane with twin lower record wells.', 'watchfloor', 'tight', {
    analysis: area('1 / span 8', '1 / span 7'),
    alerts: area('9 / span 4', '1 / span 3'),
    entities: area('9 / span 4', '4 / span 2'),
    timeline: area('9 / span 4', '6 / span 2'),
    domain: area('1 / span 4', '8 / span 3'),
    support: area('5 / span 4', '8 / span 3'),
    selection: area('9 / span 4', '8 / span 3'),
  }),
  preset('watchfloor-charlie', 'Watchfloor Charlie', 'Wide analysis slab with long lower ticker row.', 'watchfloor', 'balanced', {
    analysis: area('1 / span 9', '1 / span 5'),
    alerts: area('10 / span 3', '1 / span 5'),
    entities: area('1 / span 3', '6 / span 2'),
    timeline: area('4 / span 3', '6 / span 2'),
    domain: area('7 / span 3', '6 / span 2'),
    support: area('10 / span 3', '6 / span 2'),
    selection: area('1 / span 12', '8 / span 3'),
  }),
  preset('watchfloor-delta', 'Watchfloor Delta', 'Central console with flanking queue and support towers.', 'watchfloor', 'balanced', {
    analysis: area('3 / span 8', '1 / span 6'),
    alerts: area('1 / span 2', '1 / span 6'),
    entities: area('11 / span 2', '1 / span 3'),
    timeline: area('11 / span 2', '4 / span 3'),
    domain: area('1 / span 4', '7 / span 2'),
    support: area('5 / span 4', '7 / span 2'),
    selection: area('9 / span 4', '7 / span 4'),
  }),
  preset('watchfloor-golf', 'Watchfloor Golf', 'Dense center-console layout with a taller analysis well and compressed right stack.', 'watchfloor', 'tight', {
    analysis: area('3 / span 8', '1 / span 7'),
    alerts: area('1 / span 2', '1 / span 7'),
    entities: area('11 / span 2', '1 / span 2'),
    timeline: area('11 / span 2', '3 / span 2'),
    domain: area('11 / span 2', '5 / span 3'),
    support: area('1 / span 6', '8 / span 3'),
    selection: area('7 / span 6', '8 / span 3'),
  }),
  preset('watchfloor-echo', 'Watchfloor Echo', 'Evidence-led watchline with bottom inspection strip.', 'watchfloor', 'balanced', {
    analysis: area('1 / span 8', '1 / span 5'),
    alerts: area('9 / span 4', '1 / span 2'),
    entities: area('9 / span 4', '3 / span 3'),
    timeline: area('1 / span 4', '6 / span 2'),
    domain: area('5 / span 4', '6 / span 2'),
    support: area('9 / span 4', '6 / span 2'),
    selection: area('1 / span 12', '8 / span 3'),
  }),
  preset('watchfloor-foxtrot', 'Watchfloor Foxtrot', 'Tight command board with broad lower archive lane.', 'watchfloor', 'broad', {
    analysis: area('1 / span 10', '1 / span 5'),
    alerts: area('11 / span 2', '1 / span 5'),
    entities: area('1 / span 4', '6 / span 2'),
    timeline: area('5 / span 4', '6 / span 2'),
    domain: area('9 / span 4', '6 / span 2'),
    support: area('1 / span 8', '8 / span 3'),
    selection: area('9 / span 4', '8 / span 3'),
  }),
  preset('operator-alpha', 'Operator Alpha', 'Dual-bank operator board with compact bottom queue.', 'operator', 'tight', {
    analysis: area('1 / span 6', '1 / span 6'),
    alerts: area('7 / span 3', '1 / span 3'),
    entities: area('10 / span 3', '1 / span 3'),
    timeline: area('7 / span 3', '4 / span 3'),
    domain: area('10 / span 3', '4 / span 3'),
    support: area('1 / span 8', '7 / span 4'),
    selection: area('9 / span 4', '7 / span 4'),
  }),
  preset('operator-bravo', 'Operator Bravo', 'Large primary board with sequential lower review panels.', 'operator', 'balanced', {
    analysis: area('1 / span 7', '1 / span 7'),
    alerts: area('8 / span 5', '1 / span 2'),
    entities: area('8 / span 5', '3 / span 2'),
    timeline: area('8 / span 5', '5 / span 3'),
    domain: area('1 / span 4', '8 / span 3'),
    support: area('5 / span 4', '8 / span 3'),
    selection: area('9 / span 4', '8 / span 3'),
  }),
  preset('operator-charlie', 'Operator Charlie', 'Tri-bank review frame with deep analysis trench.', 'operator', 'balanced', {
    analysis: area('1 / span 8', '1 / span 5'),
    alerts: area('9 / span 4', '1 / span 5'),
    entities: area('1 / span 3', '6 / span 3'),
    timeline: area('4 / span 6', '6 / span 3'),
    domain: area('10 / span 3', '6 / span 2'),
    support: area('10 / span 3', '8 / span 2'),
    selection: area('1 / span 12', '9 / span 2'),
  }),
  preset('operator-delta', 'Operator Delta', 'Wide operator lane with mirrored lower record grid.', 'operator', 'balanced', {
    analysis: area('1 / span 9', '1 / span 6'),
    alerts: area('10 / span 3', '1 / span 3'),
    entities: area('10 / span 3', '4 / span 3'),
    timeline: area('1 / span 4', '7 / span 2'),
    domain: area('5 / span 4', '7 / span 2'),
    support: area('9 / span 4', '7 / span 2'),
    selection: area('1 / span 12', '9 / span 2'),
  }),
  preset('operator-echo', 'Operator Echo', 'Center-mass analysis with long lower support trench.', 'operator', 'broad', {
    analysis: area('2 / span 9', '1 / span 6'),
    alerts: area('1 / span 1', '1 / span 6'),
    entities: area('11 / span 2', '1 / span 2'),
    timeline: area('11 / span 2', '3 / span 2'),
    domain: area('11 / span 2', '5 / span 2'),
    support: area('1 / span 8', '7 / span 4'),
    selection: area('9 / span 4', '7 / span 4'),
  }),
  preset('operator-foxtrot', 'Operator Foxtrot', 'Broad mission frame with compressed right-side status cells.', 'operator', 'broad', {
    analysis: area('1 / span 8', '1 / span 7'),
    alerts: area('9 / span 4', '1 / span 2'),
    entities: area('9 / span 4', '3 / span 2'),
    timeline: area('9 / span 4', '5 / span 3'),
    domain: area('1 / span 4', '8 / span 3'),
    support: area('5 / span 5', '8 / span 3'),
    selection: area('10 / span 3', '8 / span 3'),
  }),
  preset('matrix-alpha', 'Matrix Alpha', 'Four-quadrant command frame with lower strip controls.', 'matrix', 'tight', {
    analysis: area('1 / span 6', '1 / span 5'),
    alerts: area('7 / span 3', '1 / span 5'),
    entities: area('10 / span 3', '1 / span 5'),
    timeline: area('1 / span 4', '6 / span 3'),
    domain: area('5 / span 4', '6 / span 3'),
    support: area('9 / span 4', '6 / span 3'),
    selection: area('1 / span 12', '9 / span 2'),
  }),
  preset('matrix-bravo', 'Matrix Bravo', 'Equalized lower matrix under a dominant top board.', 'matrix', 'tight', {
    analysis: area('1 / span 12', '1 / span 4'),
    alerts: area('1 / span 3', '5 / span 2'),
    entities: area('4 / span 3', '5 / span 2'),
    timeline: area('7 / span 3', '5 / span 2'),
    domain: area('10 / span 3', '5 / span 2'),
    support: area('1 / span 8', '7 / span 4'),
    selection: area('9 / span 4', '7 / span 4'),
  }),
  preset('matrix-charlie', 'Matrix Charlie', 'Dense six-cell matrix around a left-mounted analysis well.', 'matrix', 'balanced', {
    analysis: area('1 / span 7', '1 / span 7'),
    alerts: area('8 / span 5', '1 / span 2'),
    entities: area('8 / span 5', '3 / span 2'),
    timeline: area('8 / span 5', '5 / span 3'),
    domain: area('1 / span 4', '8 / span 3'),
    support: area('5 / span 4', '8 / span 3'),
    selection: area('9 / span 4', '8 / span 3'),
  }),
  preset('matrix-delta', 'Matrix Delta', 'Stacked matrix for mixed chart and evidence operations.', 'matrix', 'balanced', {
    analysis: area('1 / span 8', '1 / span 4'),
    alerts: area('9 / span 4', '1 / span 4'),
    entities: area('1 / span 4', '5 / span 2'),
    timeline: area('5 / span 4', '5 / span 2'),
    domain: area('9 / span 4', '5 / span 2'),
    support: area('1 / span 8', '7 / span 4'),
    selection: area('9 / span 4', '7 / span 4'),
  }),
  preset('matrix-echo', 'Matrix Echo', 'Centered matrix with tall lower support rack.', 'matrix', 'broad', {
    analysis: area('2 / span 8', '1 / span 5'),
    alerts: area('10 / span 3', '1 / span 2'),
    entities: area('10 / span 3', '3 / span 3'),
    timeline: area('1 / span 4', '6 / span 2'),
    domain: area('5 / span 4', '6 / span 2'),
    support: area('9 / span 4', '6 / span 2'),
    selection: area('1 / span 12', '8 / span 3'),
  }),
  preset('matrix-foxtrot', 'Matrix Foxtrot', 'Full-width board with balanced lower quad lanes.', 'matrix', 'broad', {
    analysis: area('1 / span 12', '1 / span 5'),
    alerts: area('1 / span 3', '6 / span 2'),
    entities: area('4 / span 3', '6 / span 2'),
    timeline: area('7 / span 3', '6 / span 2'),
    domain: area('10 / span 3', '6 / span 2'),
    support: area('1 / span 9', '8 / span 3'),
    selection: area('10 / span 3', '8 / span 3'),
  }),
  preset('split-alpha', 'Split Alpha', 'Heavy left analysis and right-side serial operations stack.', 'split', 'tight', {
    analysis: area('1 / span 8', '1 / span 7'),
    alerts: area('9 / span 4', '1 / span 2'),
    entities: area('9 / span 4', '3 / span 2'),
    timeline: area('9 / span 4', '5 / span 2'),
    domain: area('1 / span 4', '8 / span 3'),
    support: area('5 / span 4', '8 / span 3'),
    selection: area('9 / span 4', '8 / span 3'),
  }),
  preset('split-bravo', 'Split Bravo', 'Tall right analysis with broad left-side watch stack.', 'split', 'tight', {
    analysis: area('5 / span 8', '1 / span 7'),
    alerts: area('1 / span 4', '1 / span 2'),
    entities: area('1 / span 4', '3 / span 2'),
    timeline: area('1 / span 4', '5 / span 2'),
    domain: area('1 / span 4', '8 / span 3'),
    support: area('5 / span 5', '8 / span 3'),
    selection: area('10 / span 3', '8 / span 3'),
  }),
  preset('split-charlie', 'Split Charlie', 'Two-bank split with lower full-width support trench.', 'split', 'balanced', {
    analysis: area('1 / span 7', '1 / span 6'),
    alerts: area('8 / span 5', '1 / span 3'),
    entities: area('8 / span 5', '4 / span 3'),
    timeline: area('1 / span 4', '7 / span 2'),
    domain: area('5 / span 4', '7 / span 2'),
    support: area('9 / span 4', '7 / span 2'),
    selection: area('1 / span 12', '9 / span 2'),
  }),
  preset('split-delta', 'Split Delta', 'Wide evidence split with lower two-zone archive band.', 'split', 'balanced', {
    analysis: area('1 / span 9', '1 / span 5'),
    alerts: area('10 / span 3', '1 / span 5'),
    entities: area('1 / span 6', '6 / span 2'),
    timeline: area('7 / span 6', '6 / span 2'),
    domain: area('1 / span 4', '8 / span 3'),
    support: area('5 / span 5', '8 / span 3'),
    selection: area('10 / span 3', '8 / span 3'),
  }),
  preset('split-echo', 'Split Echo', 'Long lower review line under a centered analysis slab.', 'split', 'broad', {
    analysis: area('2 / span 9', '1 / span 6'),
    alerts: area('11 / span 2', '1 / span 6'),
    entities: area('1 / span 4', '7 / span 2'),
    timeline: area('5 / span 4', '7 / span 2'),
    domain: area('9 / span 4', '7 / span 2'),
    support: area('1 / span 9', '9 / span 2'),
    selection: area('10 / span 3', '9 / span 2'),
  }),
  preset('split-foxtrot', 'Split Foxtrot', 'Balanced split deck for operator playback and case assembly.', 'split', 'broad', {
    analysis: area('1 / span 8', '1 / span 6'),
    alerts: area('9 / span 4', '1 / span 3'),
    entities: area('9 / span 4', '4 / span 3'),
    timeline: area('1 / span 4', '7 / span 2'),
    domain: area('5 / span 4', '7 / span 2'),
    support: area('1 / span 8', '9 / span 2'),
    selection: area('9 / span 4', '9 / span 2'),
  }),
] as const satisfies ReadonlyArray<ViewportLayoutPreset>;

export type ViewportLayoutPresetId = typeof viewportLayoutPresets[number]['id'];

export function getViewportLayoutPreset(id: ViewportLayoutPresetId): ViewportLayoutPreset {
  const match = viewportLayoutPresets.find((presetOption) => presetOption.id === id);
  if (!match) {
    return viewportLayoutPresets[0];
  }
  return match;
}

export function listViewportLayoutPresets(
  family?: ViewportLayoutPreset['family'],
): ViewportLayoutPreset[] {
  return family
    ? viewportLayoutPresets.filter((presetOption) => presetOption.family === family)
    : [...viewportLayoutPresets];
}
