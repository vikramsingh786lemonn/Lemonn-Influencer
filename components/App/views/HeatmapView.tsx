'use client';

import { useMemo, useState } from 'react';
import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { Segmented } from '../Segmented';
import { getIndexPerf, getRows, RANGES, type Range } from '@/lib/scanners';
import { tvSymbol, tvUrl } from '@/lib/watchlist';
import { dirClass, inr, pct } from '@/lib/format';

export function HeatmapView() {
  const [group, setGroup] = useState<'sector' | 'broader'>('sector');
  const [range, setRange] = useState<Range>('1D');
  const [picked, setPicked] = useState<string | null>(null);

  const perf = useMemo(() => getIndexPerf(group, range), [group, range]);
  const maxAbs = Math.max(...perf.map((p) => Math.abs(p.val)), 0.01);
  const constituents = useMemo(() => (picked ? getRows().slice(0, 12) : []), [picked]);

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Sector Heatmap"
        subtitle="NSE sector and broader indices by return — pick a bar to see constituents."
      />

      <div className="ws-controls">
        <Segmented
          options={[
            { id: 'sector', label: 'Sector' },
            { id: 'broader', label: 'Broader' },
          ]}
          value={group}
          onChange={(g) => {
            setGroup(g);
            setPicked(null);
          }}
          label="Index group"
        />
        <Segmented
          options={RANGES.map((r) => ({ id: r, label: r }))}
          value={range}
          onChange={setRange}
          label="Return window"
        />
      </div>

      <div className="ws-split">
        <div className="ws-card">
          <ul className="ws-bars">
            {perf.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  className="ws-bar-row"
                  data-active={p.name === picked || undefined}
                  onClick={() => setPicked(p.name === picked ? null : p.name)}
                >
                  <span className="ws-bar-name">{p.name.replace('Nifty ', '')}</span>
                  <span className="ws-bar-plot">
                    <span
                      className={`ws-bar-fill ${dirClass(p.val)}`}
                      style={{ width: `${(Math.abs(p.val) / maxAbs) * 84}%` }}
                    />
                    <span className={`ws-bar-val num ${dirClass(p.val)}`}>
                      {pct(p.val)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <section className="ws-card">
          <div className="ws-card-head">
            <h2 className="ws-card-title">
              {picked ? picked.replace('Nifty ', '') : 'Constituents'}
            </h2>
            {picked ? <span className="micro">Not a real mapping</span> : null}
          </div>

          {!picked ? (
            <div className="ws-empty ws-empty-sm">
              <p className="body">Pick a bar to view its stocks.</p>
            </div>
          ) : (
            <ol className="ws-rank">
              {constituents.map((r, i) => (
                <li key={r.sym} className="ws-rank-row">
                  <span className="ws-rank-n num">{i + 1}</span>
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
                  <span className="ws-rank-px num">{inr(r.ltp)}</span>
                  <span className={`ws-rank-chg num ${dirClass(r.chgPct)}`}>
                    {pct(r.chgPct)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
