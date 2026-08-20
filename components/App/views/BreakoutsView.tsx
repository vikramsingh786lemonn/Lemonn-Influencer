'use client';

import { useState } from 'react';
import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { Segmented } from '../Segmented';
import { getBreakouts, getRows, WINDOWS, type BreakoutWindow } from '@/lib/scanners';
import { tvSymbol, tvUrl } from '@/lib/watchlist';

const inr = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 1 })}`;
const sign = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export function BreakoutsView() {
  const [winId, setWinId] = useState<BreakoutWindow['id']>('bo10');
  const win = WINDOWS.find((w) => w.id === winId) ?? WINDOWS[0];
  const rows = getBreakouts(win);

  const all = getRows();
  const options = WINDOWS.map((w) => ({
    id: w.id,
    label: `${w.label} (${all.filter((r) => r[w.id]).length})`,
  }));

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Breakouts"
        subtitle="F&O stocks whose today's high has cleared the prior N-day high."
      />

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Clearing prior highs</h2>
          <Segmented options={options} value={winId} onChange={setWinId} label="Breakout window" />
        </div>

        {rows.length === 0 ? (
          <div className="ws-empty ws-empty-sm">
            <p className="body">No {win.label} breakouts right now.</p>
          </div>
        ) : (
          <div className="ws-grid">
            {rows.map((r) => {
              const prior = r[win.high];
              const margin = ((r.dayHigh - prior) / prior) * 100;
              return (
                <a
                  key={r.sym}
                  className="ws-bo"
                  href={tvUrl(r.sym)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${tvSymbol(r.sym)} on TradingView`}
                >
                  <div className="ws-bo-head">
                    <Monogram sym={r.sym} size={30} />
                    <span className="ws-bo-id">
                      <span className="ws-bo-sym">{r.sym}</span>
                      <span className="micro num">
                        {win.label} {inr(prior)}
                      </span>
                    </span>
                    <span className="ws-bo-px">
                      <span className="num">{inr(r.ltp)}</span>
                      <span className={`num ${r.chgPct >= 0 ? 'is-up' : 'is-down'}`}>
                        {sign(r.chgPct)}
                      </span>
                    </span>
                  </div>
                  <div className="ws-bo-foot">
                    <span className="micro num">day high {inr(r.dayHigh)}</span>
                    <span className="ws-bo-margin num is-up">
                      +{margin.toFixed(1)}% clear
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
