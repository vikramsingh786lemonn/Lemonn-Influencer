'use client';

import { useMemo, useState } from 'react';
import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { Segmented } from '../Segmented';
import { getMovers, type ScanRow } from '@/lib/scanners';
import { tvSymbol, tvUrl } from '@/lib/watchlist';
import { dirClass, inr, pct } from '@/lib/format';

const SIZES = [
  { id: '10', label: 'Top 10' },
  { id: '15', label: 'Top 15' },
  { id: '25', label: 'Top 25' },
];

export function MoversView() {
  const [size, setSize] = useState('15');
  const data = useMemo(() => getMovers(Number(size)), [size]);

  // One scale across both lists so a +2.9% bar and a -2.9% bar are the same
  // length — otherwise each column self-normalises and the two sides stop
  // being comparable, which is the whole reason they sit next to each other.
  const scale = Math.max(
    ...data.gainers.map((r) => r.chgPct),
    ...data.losers.map((r) => Math.abs(r.chgPct)),
    0.1,
  );

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Top Gainers & Losers"
        subtitle={`The day's extremes across ${data.universe} F&O names, with the breadth behind them.`}
      />

      <Breadth data={data} />

      <div className="ws-controls">
        <Segmented options={SIZES} value={size} onChange={setSize} label="List length" />
        <span className="micro">Symbol opens TradingView</span>
      </div>

      <div className="ws-duo">
        <List title="Top Gainers" rows={data.gainers} scale={scale} />
        <List title="Top Losers" rows={data.losers} scale={scale} />
      </div>
    </div>
  );
}

function Breadth({ data }: { data: ReturnType<typeof getMovers> }) {
  const { advancing, declining, universe } = data;
  const ratio = declining === 0 ? advancing : advancing / declining;
  const spread = data.gainers[0].chgPct - data.losers[0].chgPct;

  return (
    <section className="ws-card">
      <div className="ws-card-head">
        <h2 className="ws-card-title">Market breadth</h2>
        <span className="micro">{universe} F&amp;O names</span>
      </div>

      <div className="ws-breadth" role="img" aria-label={`${advancing} advancing, ${declining} declining`}>
        <span className="ws-breadth-seg is-up" style={{ width: `${(advancing / universe) * 100}%` }}>
          <b className="num">{advancing}</b>
        </span>
        <span className="ws-breadth-seg is-down" style={{ width: `${(declining / universe) * 100}%` }}>
          <b className="num">{declining}</b>
        </span>
      </div>

      <div className="ws-breadth-legend micro">
        <span className="is-up">advancing</span>
        <span className="ws-breadth-mid">
          A/D ratio <b className={`num ${dirClass(ratio - 1)}`}>{ratio.toFixed(2)}</b>
          <span className="ws-breadth-dot">·</span>
          top-to-bottom spread <b className="num">{spread.toFixed(2)}%</b>
        </span>
        <span className="is-down">declining</span>
      </div>
    </section>
  );
}

function List({ title, rows, scale }: { title: string; rows: ScanRow[]; scale: number }) {
  return (
    <section className="ws-card">
      <div className="ws-card-head">
        <h2 className="ws-card-title">{title}</h2>
        <span className="micro">{rows.length} shown</span>
      </div>

      <div className="ws-mv-head">
        <span />
        <span>Symbol</span>
        <span className="ws-mv-px">Price</span>
        <span className="ws-mv-chg">1D %</span>
        <span />
      </div>

      <ol className="ws-rank">
        {rows.map((r, i) => (
          <li key={r.sym} className="ws-mv-row">
            <span className="ws-rank-n num">{i + 1}</span>

            <span className="ws-mv-id">
              <Monogram sym={r.sym} size={24} />
              <a
                className="ws-rank-sym"
                href={tvUrl(r.sym)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open ${tvSymbol(r.sym)} on TradingView`}
              >
                {r.sym}
              </a>
            </span>

            <span className="ws-mv-px num">{inr(r.ltp)}</span>
            <span className={`ws-mv-chg num ${dirClass(r.chgPct)}`}>{pct(r.chgPct)}</span>

            <span className="ws-mv-plot" aria-hidden>
              <span
                className={`ws-mv-fill ${dirClass(r.chgPct)}`}
                style={{ width: `${(Math.abs(r.chgPct) / scale) * 100}%` }}
              />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
