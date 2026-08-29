'use client';

import { useMemo, useState } from 'react';
import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { Segmented } from '../Segmented';
import { BENCHMARK, getBoost, type ScanRow } from '@/lib/scanners';
import { tvSymbol, tvUrl } from '@/lib/watchlist';
import { dirClass, inr, pct, signed } from '@/lib/format';

type Lens = 'leaders' | 'laggards' | 'both';

const LENSES: { id: Lens; label: string }[] = [
  { id: 'leaders', label: 'Leaders' },
  { id: 'laggards', label: 'Laggards' },
  { id: 'both', label: 'Both ends' },
];

/** Cap the visible list — the point of the screen is the extremes, not the middle. */
const N = 12;

export function BoostView() {
  const [lens, setLens] = useState<Lens>('leaders');
  const all = useMemo(() => getBoost(), []);

  const rows = useMemo(() => {
    if (lens === 'leaders') return all.slice(0, N);
    if (lens === 'laggards') return all.slice(-N).reverse();
    return [...all.slice(0, N / 2), ...all.slice(-N / 2).reverse()];
  }, [all, lens]);

  const maxAbs = Math.max(...all.map((r) => Math.abs(r.score)), 0.1);
  const outperforming = all.filter((r) => r.rs > 0).length;
  const longBuild = all.filter((r) => r.buildup === 'Long build-up').length;
  const shortBuild = all.filter((r) => r.buildup === 'Short build-up').length;

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Intraday Boost"
        subtitle={`F&O names ranked by relative strength against ${BENCHMARK.name}, weighted by whether futures OI moved the same way.`}
      />

      <div className="ws-stats">
        <Stat
          label={BENCHMARK.name}
          value={pct(BENCHMARK.chgPct)}
          sub="benchmark for RS"
          dir={BENCHMARK.chgPct}
        />
        <Stat
          label="Outperforming"
          value={`${outperforming} / ${all.length}`}
          sub={`${Math.round((outperforming / all.length) * 100)}% of the universe`}
        />
        <Stat label="Long build-up" value={String(longBuild)} sub="price up, OI up" dir={1} />
        <Stat label="Short build-up" value={String(shortBuild)} sub="price down, OI up" dir={-1} />
      </div>

      <div className="ws-controls">
        <Segmented options={LENSES} value={lens} onChange={setLens} label="Which end of the ranking" />
        <span className="micro">Symbol opens TradingView</span>
      </div>

      <section className="ws-card">
        <div className="ws-boost-head">
          <span />
          <span>Symbol</span>
          <span className="ws-boost-num">LTP</span>
          <span className="ws-boost-num">1D %</span>
          <span className="ws-boost-num" title="Relative strength: 1D % less the benchmark's, in percentage points">
            RS
          </span>
          <span className="ws-boost-num">OI chg</span>
          <span className="ws-boost-num" title="Session volume as a multiple of its own recent average">
            Vol
          </span>
          <span className="ws-boost-num ws-boost-span">Boost</span>
        </div>

        <ol className="ws-boost">
          {rows.map((r, i) => (
            <Row key={r.sym} r={r} n={i + 1} maxAbs={maxAbs} />
          ))}
        </ol>
      </section>

      <p className="micro ws-foot-note">
        Boost is relative strength against {BENCHMARK.name} scaled by whether futures OI
        and volume moved with the price rather than against it. Build-up labels describe
        what price and open interest did together — they are not positions to take.
        Illustrative figures only; nothing here is a recommendation to buy or sell.
      </p>
    </div>
  );
}

function Row({ r, n, maxAbs }: { r: ScanRow; n: number; maxAbs: number }) {
  const up = r.score >= 0;
  const w = (Math.abs(r.score) / maxAbs) * 100;

  return (
    <li className="ws-boost-row">
      <span className="ws-rank-n num">{n}</span>

      <span className="ws-boost-id">
        <Monogram sym={r.sym} size={30} />
        <span className="ws-boost-name">
          <a
            className="ws-boost-sym"
            href={tvUrl(r.sym)}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${tvSymbol(r.sym)} on TradingView`}
          >
            {r.sym}
          </a>
          <span className={`ws-buildup ${buildupClass(r.buildup)}`}>{r.buildup}</span>
        </span>
      </span>

      <span className="ws-boost-num num">{inr(r.ltp)}</span>
      <span className={`ws-boost-num num ${dirClass(r.chgPct)}`}>{pct(r.chgPct)}</span>
      <span className={`ws-boost-num num ${dirClass(r.rs)}`}>{signed(r.rs, 2)}</span>
      <span className={`ws-boost-num num ${dirClass(r.oiChgPct)}`}>{signed(r.oiChgPct)}%</span>
      <span className="ws-boost-num num ws-vol">{r.volMult.toFixed(1)}×</span>

      <span className={`ws-boost-num num ${dirClass(r.score)}`}>{signed(r.score)}</span>

      <span className="ws-boost-plot" aria-hidden>
        <span
          className={`ws-boost-fill ${up ? 'is-up' : 'is-down'}`}
          style={{ width: `${w}%` }}
        />
      </span>
    </li>
  );
}

function buildupClass(b: ScanRow['buildup']) {
  if (b === 'Long build-up') return 'is-long';
  if (b === 'Short build-up') return 'is-short';
  return b === 'Short covering' ? 'is-cover' : 'is-unwind';
}

function Stat({
  label,
  value,
  sub,
  dir,
}: {
  label: string;
  value: string;
  sub: string;
  dir?: number;
}) {
  return (
    <div className="ws-stat">
      <p className="ws-stat-label">{label}</p>
      <p className={`ws-stat-value num ${dir === undefined ? '' : dirClass(dir)}`}>{value}</p>
      <p className="ws-stat-sub micro">{sub}</p>
    </div>
  );
}
