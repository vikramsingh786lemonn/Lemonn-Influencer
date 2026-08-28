import { CONSTITUENTS, hash, r1 } from './sample-data';

export interface HeatTile {
  sym: string;
  chgPct: number;
}

export interface ApexData {
  heatmap: HeatTile[];
}

export function getApex(): ApexData {
  const heatmap = CONSTITUENTS.map((sym) => ({
    sym,
    chgPct: r1((hash(sym, 31) - 0.5) * 5),
  }));
  heatmap.sort((a, b) => b.chgPct - a.chgPct);
  return { heatmap };
}
