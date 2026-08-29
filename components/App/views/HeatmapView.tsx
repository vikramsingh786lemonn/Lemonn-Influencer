'use client';

import { useMemo, useState } from 'react';
import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { Segmented } from '../Segmented';
import {
  getConstituents,
  getIndexPerf,
  RANGES,
  type IndexPerf,
  type Range,
} from '@/lib/scanners';
import { treemap } from '@/lib/treemap';
import { tvSymbol, tvUrl } from '@/lib/watchlist';
import { dirClass, inr, pct } from '@/lib/format';

export function HeatmapView() {
  const [group, setGroup] = useState<'sector' | 'broader'>('sector');
  const [range, setRange] = useState<Range>('1D');
  const [picked, setPicked] = useState<string | null>(null);

  const perf = useMemo(() => getIndexPerf(group, range), [group, range]);

  // Default to the leader rather than an empty panel: the old screen opened
  // with a dashed placeholder taking up a third of the page and nothing in it.
  const active = picked && perf.some((p) => p.name === picked) ? picked : perf[0].name;
  const constituents = useMemo(() => getConstituents(active), [active]);

  const maxAbs = Math.max(...perf.map((p) => Math.abs(p.val)), 0.01);
  const up = perf.filter((p) => p.val > 0).length;
  const down = perf.filter((p) => p.val < 0).length;

  const short = (n: string) => n.replace('Nifty ', '');

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Sector Heatmap"
        subtitle="NSE sector and broader indices by return. Pick a tile to see the stocks inside it."
      />

      <div className="ws-stats">
        <Stat label="Advancing" value={`${up} / ${perf.length}`} sub="indices in the green" dir={1} />
        <Stat label="Declining" value={`${down} / ${perf.length}`} sub="indices in the red" dir={-1} />
        <Stat label="Leader" value={short(perf[0].name)} sub={pct(perf[0].val)} dir={perf[0].val} />
        <Stat
          label="Laggard"
          value={short(perf[perf.length - 1].name)}
          sub={pct(perf[perf.length - 1].val)}
          dir={perf[perf.length - 1].val}
        />
      </div>

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

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">{range} return by index</h2>
          <span className="micro">Area = weight in the group · colour = return</span>
        </div>

        <div className="ws-tm">
          {treemap(perf).map(({ item, x, y, w, h }) => (
            <Tile
              key={item.name}
              p={item}
              maxAbs={maxAbs}
              active={item.name === active}
              label={short(item.name)}
              rect={{ x, y, w, h }}
              onPick={() => setPicked(item.name)}
            />
          ))}
        </div>

        <Scale maxAbs={maxAbs} />
      </section>

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Inside {short(active)}</h2>
          <span className="micro">{constituents.length} stocks · not a real mapping</span>
        </div>

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
              <span className={`ws-rank-chg num ${dirClass(r.chgPct)}`}>{pct(r.chgPct)}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* Diverging ramp: neutral midpoint, three discrete bands per pole. A continuous
   alpha fade gives every tile a shade no reader can rank. Boundaries are shares
   of the largest move on screen, so a flat session still spreads. */
function band(val: number, maxAbs: number): string {
  const q = Math.abs(val) / maxAbs;
  const mag = q < 0.12 ? 0 : q < 0.45 ? 1 : q < 0.75 ? 2 : 3;
  if (mag === 0) return '0';
  return `${val >= 0 ? 'p' : 'n'}${mag}`;
}

function Tile({
  p,
  maxAbs,
  active,
  label,
  rect,
  onPick,
}: {
  p: IndexPerf;
  maxAbs: number;
  active: boolean;
  label: string;
  rect: { x: number; y: number; w: number; h: number };
  onPick: () => void;
}) {
  /* Keyed to height and width, not area: a wide, short tile has a large area
     but no vertical room, and got type it could not fit. Small tiles degrade to
     colour-only rather than overflow. */
  const size =
    rect.h >= 26 && rect.w >= 16
      ? 'lg'
      : rect.h >= 17 && rect.w >= 11
        ? 'md'
        : rect.h >= 9 && rect.w >= 7
          ? 'sm'
          : 'xs';

  return (
    <button
      type="button"
      className="ws-tm-tile"
      data-band={band(p.val, maxAbs)}
      data-size={size}
      data-active={active || undefined}
      aria-pressed={active}
      aria-label={`${label} ${pct(p.val)}`}
      onClick={onPick}
      title={`${label} · ${pct(p.val)} · ${(p.weight * 100).toFixed(1)}% of the group`}
      style={{
        left: `${rect.x}%`,
        top: `${rect.y}%`,
        width: `${rect.w}%`,
        height: `${rect.h}%`,
      }}
    >
      <span className="ws-tm-name">{label}</span>
      <span className="ws-tm-val num">{pct(p.val)}</span>
      <span className="ws-tm-wt micro num">{(p.weight * 100).toFixed(1)}% weight</span>
      <TileSpark points={p.spark} />
    </button>
  );
}

/* A treemap is a snapshot; this adds how the index got there. Stroked in the
   tile's own ink so it stays legible on every band of the ramp. */
function TileSpark({ points }: { points: number[] }) {
  const W = 100;
  const H = 30;
  const hi = Math.max(...points, 0);
  const lo = Math.min(...points, 0);
  const span = hi - lo || 1;
  const yOf = (v: number) => H - 1 - ((v - lo) / span) * (H - 2);

  const d = points
    .map((v, i) => `${i ? 'L' : 'M'}${(i / (points.length - 1)) * W} ${yOf(v)}`)
    .join(' ');

  return (
    <svg className="ws-tm-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
      <line className="ws-tm-spark-zero" x1={0} x2={W} y1={yOf(0)} y2={yOf(0)} />
      <path className="ws-tm-spark-line" d={d} />
    </svg>
  );
}

/* A ramp legend is not optional once colour carries magnitude: without it the
   shades are decoration. Labelled at the ends only. */
function Scale({ maxAbs }: { maxAbs: number }) {
  const bands = ['n3', 'n2', 'n1', '0', 'p1', 'p2', 'p3'];
  return (
    <div className="ws-hm-scale">
      <span className="micro num">{pct(-maxAbs)}</span>
      <span className="ws-hm-swatches" aria-hidden>
        {bands.map((b) => (
          <i key={b} data-band={b} />
        ))}
      </span>
      <span className="micro num">{pct(maxAbs)}</span>
    </div>
  );
}

function Stat({ label, value, sub, dir }: { label: string; value: string; sub: string; dir?: number }) {
  return (
    <div className="ws-stat">
      <p className="ws-stat-label">{label}</p>
      <p className={`ws-stat-value ${dir === undefined ? '' : dirClass(dir)}`}>{value}</p>
      <p className={`ws-stat-sub micro num ${dir === undefined ? '' : dirClass(dir)}`}>{sub}</p>
    </div>
  );
}
