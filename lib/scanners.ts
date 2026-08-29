import { CONSTITUENTS, hash, r1, r2 } from './sample-data';

export interface ScanRow {
  sym: string;
  ltp: number;
  chgPct: number;
  dayHigh: number;
  h10: number;
  h50: number;
  h90: number;
  bo10: boolean;
  bo50: boolean;
  bo90: boolean;
  /** Relative strength: the stock's move less the benchmark's, in points of %. */
  rs: number;
  /** Futures open-interest change for the session, %. */
  oiChgPct: number;
  /** Session volume as a multiple of its own recent average. */
  volMult: number;
  buildup: Buildup;
  score: number;
}

/* The four-quadrant read of price against open interest. Descriptive only —
   deliberately not "long"/"short", which reads as an instruction to trade. */
export type Buildup =
  | 'Long build-up'
  | 'Short build-up'
  | 'Short covering'
  | 'Long unwinding';

export function classify(chgPct: number, oiChgPct: number): Buildup {
  if (chgPct >= 0) return oiChgPct >= 0 ? 'Long build-up' : 'Short covering';
  return oiChgPct >= 0 ? 'Short build-up' : 'Long unwinding';
}

/** The benchmark every relative-strength figure on these screens is measured against. */
export const BENCHMARK = { name: 'Nifty 50', chgPct: 0.17 };

export interface BreakoutWindow {
  id: 'bo10' | 'bo50' | 'bo90';
  label: string;
  n: number;
  high: 'h10' | 'h50' | 'h90';
}

export const WINDOWS: BreakoutWindow[] = [
  { id: 'bo10', label: '10-day', n: 10, high: 'h10' },
  { id: 'bo50', label: '50-day', n: 50, high: 'h50' },
  { id: 'bo90', label: '90-day', n: 90, high: 'h90' },
];

function row(sym: string): ScanRow {
  const ltp = r1(80 + hash(sym, 31) * 4000);
  const chgPct = r2((hash(sym, 37) - 0.5) * 6);
  const dayHigh = r1(ltp * (1 + hash(sym, 41) * 0.02));

  const h10 = r1(dayHigh * (0.985 + hash(sym, 43) * 0.03));
  const h50 = r1(dayHigh * (0.99 + hash(sym, 47) * 0.045));
  const h90 = r1(dayHigh * (0.995 + hash(sym, 53) * 0.055));

  const rs = r2(chgPct - BENCHMARK.chgPct);
  const oiChgPct = r1((hash(sym, 59) - 0.42) * 14);
  const volMult = r1(0.6 + hash(sym, 61) * 2.6);

  /* Derived, not an independent hash: rs sets direction and magnitude, OI only
     adds when it agrees. sign(score) therefore always matches sign(rs). */
  const agrees = (rs >= 0) === (oiChgPct >= 0);
  const conviction = 1 + (agrees ? 0.35 : 0) * Math.min(1, Math.abs(oiChgPct) / 8)
    + 0.2 * Math.min(1, Math.max(0, volMult - 1));

  return {
    sym,
    ltp,
    chgPct,
    dayHigh,
    h10,
    h50,
    h90,
    bo10: dayHigh > h10,
    bo50: dayHigh > h50,
    bo90: dayHigh > h90,
    rs,
    oiChgPct,
    volMult,
    buildup: classify(chgPct, oiChgPct),
    score: r1(Math.max(-9.9, Math.min(9.9, rs * 2.1 * conviction))),
  };
}

export function getRows(): ScanRow[] {
  return CONSTITUENTS.map(row);
}

export interface Movers {
  gainers: ScanRow[];
  losers: ScanRow[];
  /** Breadth over the whole universe, not just the slice on screen. */
  advancing: number;
  declining: number;
  unchanged: number;
  universe: number;
}

export function getMovers(n = 15): Movers {
  const rows = getRows().sort((a, b) => b.chgPct - a.chgPct);
  return {
    gainers: rows.slice(0, n),
    losers: rows.slice(-n).reverse(),
    advancing: rows.filter((r) => r.chgPct > 0).length,
    declining: rows.filter((r) => r.chgPct < 0).length,
    unchanged: rows.filter((r) => r.chgPct === 0).length,
    universe: rows.length,
  };
}

export interface BreakoutInfo {
  row: ScanRow;
  /** The prior N-day high the day's high cleared. */
  prior: number;
  /** How far the day's high got above that prior high, %. Always positive. */
  margin: number;
  /** Is the last price still above the level, or has it slipped back under? */
  holding: boolean;
  /** How far the last price sits below the day's high, %. */
  offHigh: number;
}

export function breakoutInfo(row: ScanRow, win: BreakoutWindow): BreakoutInfo {
  const prior = row[win.high];
  return {
    row,
    prior,
    margin: r2(((row.dayHigh - prior) / prior) * 100),
    holding: row.ltp >= prior,
    offHigh: r2(((row.dayHigh - row.ltp) / row.dayHigh) * 100),
  };
}

/* Ranked by how decisively the level was cleared, not by the day's change —
   a different question, and sorting on it buried the widest clears. */
export function getBreakouts(win: BreakoutWindow): BreakoutInfo[] {
  return getRows()
    .filter((r) => r[win.id])
    .map((r) => breakoutInfo(r, win))
    .sort((a, b) => b.margin - a.margin);
}

/** Every name, strongest Boost first. The view slices and filters it. */
export function getBoost(): ScanRow[] {
  return getRows().sort((a, b) => b.score - a.score);
}

export const SECTOR_INDICES = [
  'Nifty Bank', 'Nifty IT', 'Nifty Pharma', 'Nifty Auto', 'Nifty FMCG',
  'Nifty Metal', 'Nifty Realty', 'Nifty Media', 'Nifty Energy',
  'Nifty PSU Bank', 'Nifty Pvt Bank', 'Nifty Fin Service',
];

export const BROADER_INDICES = [
  'Nifty 50', 'Nifty Next 50', 'Nifty 100', 'Nifty 200', 'Nifty 500',
  'Nifty Midcap 100', 'Nifty Smallcap 100', 'Nifty Midcap 150',
];

export const RANGES = ['1D', '7D', '30D', '90D', '52W'] as const;
export type Range = (typeof RANGES)[number];

const RANGE_SPREAD: Record<Range, number> = {
  '1D': 3,
  '7D': 6,
  '30D': 12,
  '90D': 22,
  '52W': 45,
};

export interface IndexPerf {
  name: string;
  val: number;
  /** Illustrative share of the group, 0..1. */
  weight: number;
  /** Cumulative return path across the window, starting at 0 and ending at `val`. */
  spark: number[];
}

const SPARK_N = 24;

/* Wobble is scaled by sin(πt), zero at both ends, so the path starts at 0 and
   lands exactly on `val` instead of contradicting the figure beside it. */
function sparkPath(name: string, range: Range, val: number): number[] {
  const amp = Math.max(Math.abs(val), 0.2) * 0.85;
  const out: number[] = [];
  for (let i = 0; i < SPARK_N; i++) {
    const t = i / (SPARK_N - 1);
    const wob = (hash(`${name}${range}${i}`, 83) - 0.5) * amp;
    out.push(val * t + wob * Math.sin(Math.PI * t));
  }
  out[0] = 0;
  out[SPARK_N - 1] = val;
  return out;
}

/* Which stocks sit in an index. Was `getRows().slice(0, 12)` — the same twelve
   whichever index you picked. Illustrative, but stable per index. */
export function getConstituents(indexName: string, n = 12): ScanRow[] {
  return getRows()
    .map((r) => ({ r, k: hash(indexName + r.sym, 67) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, n)
    .map((x) => x.r)
    .sort((a, b) => b.chgPct - a.chgPct);
}

export function getIndexPerf(group: 'sector' | 'broader', range: Range): IndexPerf[] {
  const names = group === 'sector' ? SECTOR_INDICES : BROADER_INDICES;

  /* Squared so the spread is uneven like real index weights; twelve equal tiles
     would make a treemap pointless. Independent of `range`. */
  const raw = names.map((name) => 0.35 + Math.pow(hash(name, 71), 2) * 4);
  const total = raw.reduce((x, y) => x + y, 0);

  return names
    .map((name, i) => ({
      name,
      val: r2((hash(name + range, 61) - 0.5) * RANGE_SPREAD[range]),
      weight: raw[i] / total,
      spark: sparkPath(name, range, r2((hash(name + range, 61) - 0.5) * RANGE_SPREAD[range])),
    }))
    .sort((a, b) => b.val - a.val);
}
