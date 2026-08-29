'use client';

import { useMemo, useState } from 'react';
import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { Segmented } from '../Segmented';
import {
  getBreakouts,
  getRows,
  WINDOWS,
  type BreakoutInfo,
  type BreakoutWindow,
} from '@/lib/scanners';
import { tvSymbol, tvUrl } from '@/lib/watchlist';
import { dirClass, inr, pct } from '@/lib/format';
import { useTilt } from '@/hooks/useTilt';

type Status = 'all' | 'holding' | 'faded';

const STATUS: { id: Status; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'holding', label: 'Holding' },
  { id: 'faded', label: 'Faded back' },
];

export function BreakoutsView() {
  const [winId, setWinId] = useState<BreakoutWindow['id']>('bo10');
  const [status, setStatus] = useState<Status>('all');
  const win = WINDOWS.find((w) => w.id === winId) ?? WINDOWS[0];

  /* Both of these hash the full 62-symbol universe. They were called in the
     render body, so every click of the segmented control recomputed them —
     and they will become async the day a real feed lands, which is far easier
     from here than from an expression inline in the JSX. */
  const all = useMemo(() => getBreakouts(win), [win]);
  const options = useMemo(() => {
    const rows = getRows();
    return WINDOWS.map((w) => ({
      id: w.id,
      label: `${w.label} (${rows.filter((r) => r[w.id]).length})`,
    }));
  }, []);

  const rows = useMemo(
    () =>
      status === 'all' ? all : all.filter((b) => (status === 'holding' ? b.holding : !b.holding)),
    [all, status],
  );

  const holding = all.filter((b) => b.holding).length;

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Breakouts"
        subtitle="F&O stocks whose day's high cleared the prior N-day high — and whether the price has stayed above that level since."
      />

      <div className="ws-stats">
        <Stat label="Cleared" value={String(all.length)} sub={`${win.label} high`} />
        <Stat label="Holding above" value={String(holding)} sub="last price still over the level" dir={1} />
        <Stat
          label="Faded back"
          value={String(all.length - holding)}
          sub="poked through, slipped under"
          dir={-1}
        />
        <Stat
          label="Widest clear"
          value={all.length ? `+${all[0].margin.toFixed(2)}%` : '—'}
          sub={all.length ? all[0].row.sym : 'nothing cleared'}
          dir={1}
        />
      </div>

      <div className="ws-controls">
        <Segmented options={options} value={winId} onChange={setWinId} label="Breakout window" />
        <Segmented options={STATUS} value={status} onChange={setStatus} label="Held or faded" />
      </div>

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Clearing prior highs</h2>
          <span className="micro">Ranked by margin · symbol opens TradingView</span>
        </div>

        {rows.length === 0 ? (
          <div className="ws-empty ws-empty-sm">
            <p className="body">
              Nothing {status === 'all' ? '' : status === 'holding' ? 'holding ' : 'faded '}in the{' '}
              {win.label} window.
            </p>
          </div>
        ) : (
          <div className="ws-grid">
            {rows.map((b) => (
              <Card key={b.row.sym} b={b} win={win} />
            ))}
          </div>
        )}
      </section>

      <p className="micro ws-foot-note">
        &ldquo;Holding&rdquo; means the last price is still above the level the day&rsquo;s high
        cleared; &ldquo;faded back&rdquo; means it has slipped under it again. Both are
        descriptions of where price sits, not signals to act on. Illustrative figures only.
      </p>
    </div>
  );
}

function Card({ b, win }: { b: BreakoutInfo; win: BreakoutWindow }) {
  const { row: r, prior, margin, holding, offHigh } = b;
  const tilt = useTilt<HTMLAnchorElement>();

  /* Prior high as a marker, day's high at the right edge, last price as a dot.
     Scale starts below the lower of the two so faded names stay in the track. */
  const lo = Math.min(prior, r.ltp) * 0.999;
  const hi = r.dayHigh * 1.001;
  const at = (v: number) => ((v - lo) / (hi - lo)) * 100;

  return (
    <a
      className="ws-bo"
      data-holding={holding || undefined}
      href={tvUrl(r.sym)}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open ${tvSymbol(r.sym)} on TradingView`}
      {...tilt}
    >
      <span className="tilt-sheen" aria-hidden />

      <span className="ws-bo-lift">
        <div className="ws-bo-head">
          <Monogram sym={r.sym} size={30} />
          <span className="ws-bo-id">
            <span className="ws-bo-sym">{r.sym}</span>
            <span className={`ws-bo-tag ${holding ? 'is-hold' : 'is-fade'}`}>
              {holding ? 'Holding' : 'Faded back'}
            </span>
          </span>
          <span className="ws-bo-px">
            <span className="num">{inr(r.ltp)}</span>
            <span className={`num ${dirClass(r.chgPct)}`}>{pct(r.chgPct)}</span>
          </span>
        </div>

        <div className="ws-bo-track" aria-hidden>
          <span className="ws-bo-span" style={{ left: `${at(prior)}%`, right: '0%' }} />
          <span className="ws-bo-level" style={{ left: `${at(prior)}%` }} />
          <span className="ws-bo-dot" style={{ left: `${at(r.ltp)}%` }} />
        </div>

        <div className="ws-bo-foot">
          <span className="micro num">
            {win.label} {inr(prior)}
          </span>
          <span className="ws-bo-margin num is-up">+{margin.toFixed(2)}% clear</span>
        </div>

        <div className="ws-bo-foot is-plain">
          <span className="micro num">high {inr(r.dayHigh)}</span>
          <span className="micro num">{offHigh.toFixed(2)}% off high</span>
        </div>
      </span>
    </a>
  );
}

function Stat({ label, value, sub, dir }: { label: string; value: string; sub: string; dir?: number }) {
  return (
    <div className="ws-stat">
      <p className="ws-stat-label">{label}</p>
      <p className={`ws-stat-value num ${dir === undefined ? '' : dirClass(dir)}`}>{value}</p>
      <p className="ws-stat-sub micro">{sub}</p>
    </div>
  );
}
