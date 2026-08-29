/* Options Apex — illustrative data: intraday candles plus the call and put
   writing that happened inside each one. Deterministic per index and timeframe
   so a screen never reshuffles and reads as a live feed. See `sample-data.ts`. */

import { CONSTITUENTS, hash, r1, r2 } from './sample-data';

export const INDICES = [
  { id: 'NIFTY', label: 'Nifty 50', spot: 24238.5, step: 50 },
  { id: 'BANKNIFTY', label: 'Bank Nifty', spot: 52140.2, step: 100 },
  { id: 'FINNIFTY', label: 'Fin Nifty', spot: 23415.8, step: 50 },
] as const;

export type IndexId = (typeof INDICES)[number]['id'];

export const TIMEFRAMES = ['3m', '5m', '15m'] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

const TF_MIN: Record<Timeframe, number> = { '3m': 3, '5m': 5, '15m': 15 };

/** 09:15 + n minutes, as `HH:MM`. */
function clock(minsFromOpen: number): string {
  const m = 9 * 60 + 15 + minsFromOpen;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** A seeded 0..1 stream — `hash` is stable but single-shot, so index it. */
function series(seed: string, mult: number) {
  return (i: number) => hash(`${seed}:${i}`, mult);
}

export interface Candle {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  /** Fresh call writing in this candle, in lakh contracts. Bearish pressure. */
  callW: number;
  /** Fresh put writing in this candle, in lakh contracts. Bullish pressure. */
  putW: number;
}

export interface Strike {
  strike: number;
  callOi: number;
  putOi: number;
  callChg: number;
  putChg: number;
  atm: boolean;
}

export interface ApexData {
  label: string;
  spot: number;
  chg: number;
  chgPct: number;
  candles: Candle[];
  strikes: Strike[];
  /** Session totals, lakh contracts. */
  callWritten: number;
  putWritten: number;
  pcr: number;
  heatmap: HeatTile[];
}

export interface HeatTile {
  sym: string;
  chgPct: number;
}

function buildCandles(id: IndexId, tf: Timeframe, base: number): Candle[] {
  const n = Math.floor(375 / TF_MIN[tf]);
  const rnd = series(`${id}${tf}`, 31);
  const flowRnd = series(`${id}${tf}w`, 37);
  const vol = base * 0.0006 * Math.sqrt(TF_MIN[tf]);

  const out: Candle[] = [];
  let px = base * 0.997;

  for (let i = 0; i < n; i++) {
    // A gentle drift plus noise. The drift term gives the session a shape
    // rather than a directionless jitter.
    const drift = Math.sin((i / n) * Math.PI * 1.4 + hash(id, 41) * 3) * vol * 0.55;
    const o = px;
    const c = o + drift + (rnd(i) - 0.5) * vol * 2.4;
    const wick = vol * (0.4 + rnd(i + 900) * 0.9);
    out.push({
      t: clock(i * TF_MIN[tf]),
      o: r2(o),
      h: r2(Math.max(o, c) + wick),
      l: r2(Math.min(o, c) - wick),
      c: r2(c),
      // Writers lean against the candle: a red candle tends to carry call
      // writing, a green one put writing. Not a rule, just the usual tilt.
      callW: r2((flowRnd(i) * 0.7 + (c < o ? 0.55 : 0.12)) * 2.2),
      putW: r2((flowRnd(i + 500) * 0.7 + (c > o ? 0.55 : 0.12)) * 2.2),
    });
    px = c;
  }
  return out;
}

function buildStrikes(id: IndexId, spot: number, step: number): Strike[] {
  const atm = Math.round(spot / step) * step;
  const rnd = series(`${id}oi`, 43);
  const out: Strike[] = [];

  for (let k = -5; k <= 5; k++) {
    const strike = atm + k * step;
    // OI peaks a little out of the money on each side, the way a real chain
    // stacks up: calls above spot, puts below.
    const callBell = Math.exp(-Math.pow(k - 2, 2) / 7);
    const putBell = Math.exp(-Math.pow(k + 2, 2) / 7);
    out.push({
      strike,
      callOi: r1(18 + callBell * 62 * (0.75 + rnd(k + 20) * 0.5)),
      putOi: r1(18 + putBell * 62 * (0.75 + rnd(k + 40) * 0.5)),
      callChg: r1((rnd(k + 60) - 0.38) * 16),
      putChg: r1((rnd(k + 80) - 0.38) * 16),
      atm: k === 0,
    });
  }
  return out;
}

export function getApex(id: IndexId = 'NIFTY', tf: Timeframe = '5m'): ApexData {
  const meta = INDICES.find((i) => i.id === id) ?? INDICES[0];
  const candles = buildCandles(id, tf, meta.spot);
  const strikes = buildStrikes(id, meta.spot, meta.step);

  const last = candles[candles.length - 1].c;
  const open = candles[0].o;
  const callWritten = r1(candles.reduce((s, c) => s + c.callW, 0));
  const putWritten = r1(candles.reduce((s, c) => s + c.putW, 0));
  const totCall = strikes.reduce((s, x) => s + x.callOi, 0);
  const totPut = strikes.reduce((s, x) => s + x.putOi, 0);

  const heatmap = CONSTITUENTS.map((sym) => ({
    sym,
    chgPct: r1((hash(sym, 31) - 0.5) * 5),
  })).sort((a, b) => b.chgPct - a.chgPct);

  return {
    label: meta.label,
    spot: r2(last),
    chg: r2(last - open),
    chgPct: r2(((last - open) / open) * 100),
    candles,
    strikes,
    callWritten,
    putWritten,
    pcr: r2(totPut / totCall),
    heatmap,
  };
}
