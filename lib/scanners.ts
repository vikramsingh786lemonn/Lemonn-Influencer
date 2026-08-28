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
  score: number;
}

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
    score: r1((hash(sym, 59) - 0.5) * 12),
  };
}

export function getRows(): ScanRow[] {
  return CONSTITUENTS.map(row);
}

export function getMovers(): { gainers: ScanRow[]; losers: ScanRow[] } {
  const rows = getRows().sort((a, b) => b.chgPct - a.chgPct);
  return { gainers: rows.slice(0, 15), losers: rows.slice(-15).reverse() };
}

export function getBreakouts(win: BreakoutWindow): ScanRow[] {
  return getRows()
    .filter((r) => r[win.id])
    .sort((a, b) => b.chgPct - a.chgPct);
}

export function getBoost(): ScanRow[] {
  return getRows()
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .slice(0, 15);
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
}

export function getIndexPerf(group: 'sector' | 'broader', range: Range): IndexPerf[] {
  const names = group === 'sector' ? SECTOR_INDICES : BROADER_INDICES;
  return names
    .map((name) => ({
      name,
      val: r2((hash(name + range, 61) - 0.5) * RANGE_SPREAD[range]),
    }))
    .sort((a, b) => b.val - a.val);
}
