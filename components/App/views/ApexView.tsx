'use client';

import { useMemo, useRef, useState } from 'react';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { Segmented } from '../Segmented';
import {
  getApex,
  INDICES,
  TIMEFRAMES,
  type Candle,
  type IndexId,
  type Timeframe,
} from '@/lib/apex';
import { dirClass, num, pct, signed } from '@/lib/format';

/* Chart geometry in viewBox units. Both panes share one x scale so a candle
   sits directly above the writing that happened inside it. */
const W = 1000;
const PRICE_TOP = 10;
const PRICE_H = 250;
const FLOW_TOP = 296;
const FLOW_H = 120;
const H = FLOW_TOP + FLOW_H + 22;

export function ApexView() {
  const [index, setIndex] = useState<IndexId>('NIFTY');
  const [tf, setTf] = useState<Timeframe>('5m');
  const data = useMemo(() => getApex(index, tf), [index, tf]);

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Options Apex"
        subtitle="Intraday candles with the option writing that happened inside each one — where the large writers added, and on which side."
      />

      <div className="ws-controls">
        <Segmented
          options={INDICES.map((i) => ({ id: i.id, label: i.label }))}
          value={index}
          onChange={setIndex}
          label="Index"
        />
        <Segmented
          options={TIMEFRAMES.map((t) => ({ id: t, label: t }))}
          value={tf}
          onChange={setTf}
          label="Candle interval"
        />
      </div>

      <Stats data={data} />

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">{data.label} — candles &amp; writing flow</h2>
          <Legend />
        </div>
        <ApexChart candles={data.candles} />
      </section>

      <div className="ws-apex-split">
        <section className="ws-card">
          <div className="ws-card-head">
            <h2 className="ws-card-title">Where the writers are stacked</h2>
            <span className="micro">OI, lakh contracts</span>
          </div>
          <StrikeLadder data={data} />
        </section>

        <section className="ws-card">
          <div className="ws-card-head">
            <h2 className="ws-card-title">F&amp;O universe</h2>
            <span className="micro">{data.heatmap.length} stocks</span>
          </div>
          <div className="ws-heat is-compact">
            {data.heatmap.map((t) => (
              <div
                key={t.sym}
                className="ws-tile"
                title={`${t.sym} ${pct(t.chgPct)}`}
                style={{
                  background: `rgba(var(${
                    t.chgPct >= 0 ? '--up-rgb' : '--down-rgb'
                  }), ${(0.12 + 0.52 * Math.min(1, Math.abs(t.chgPct) / 2.5)).toFixed(2)})`,
                }}
              >
                <p className="ws-tile-sym">{t.sym}</p>
                <p className={`ws-tile-pct num ${dirClass(t.chgPct)}`}>{pct(t.chgPct)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <p className="ws-foot-note micro">
        Illustrative figures only. Nothing here is a recommendation to buy or sell any
        security, and no outcome is implied.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- stats */

function Stats({ data }: { data: ReturnType<typeof getApex> }) {
  const net = data.putWritten - data.callWritten;
  // Purely descriptive: which side added more contracts this session. It is a
  // statement about the data on screen, not a view on where the index goes.
  const bias =
    Math.abs(net) < data.callWritten * 0.06
      ? 'Balanced'
      : net > 0
        ? 'Put writers added more'
        : 'Call writers added more';

  return (
    <div className="ws-stats">
      <Stat label="Spot" value={num(data.spot)} sub={`${signed(data.chg, 2)} (${pct(data.chgPct)})`} dir={data.chgPct} />
      <Stat label="Call writing" value={num(data.callWritten)} sub="lakh contracts, session" />
      <Stat label="Put writing" value={num(data.putWritten)} sub="lakh contracts, session" />
      <Stat label="PCR (OI)" value={data.pcr.toFixed(2)} sub={bias} dir={net} />
    </div>
  );
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
      <p className={`ws-stat-sub micro ${dir === undefined ? '' : dirClass(dir)}`}>{sub}</p>
    </div>
  );
}

function Legend() {
  return (
    <div className="ws-legend micro">
      <span className="ws-legend-key">
        <i className="ws-swatch is-up" /> put writing
      </span>
      <span className="ws-legend-key">
        <i className="ws-swatch is-down" /> call writing
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- chart */

function ApexChart({ candles }: { candles: Candle[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const hi = Math.max(...candles.map((c) => c.h));
  const lo = Math.min(...candles.map((c) => c.l));
  const pad = (hi - lo) * 0.08 || 1;
  const yPx = (v: number) =>
    PRICE_TOP + ((hi + pad - v) / (hi - lo + pad * 2)) * PRICE_H;

  const maxFlow = Math.max(...candles.map((c) => Math.max(c.callW, c.putW)));
  const zero = FLOW_TOP + FLOW_H / 2;
  const yFlow = (v: number) => (v / maxFlow) * (FLOW_H / 2 - 4);

  const cw = W / candles.length;
  const body = Math.max(1.6, cw * 0.58);

  const move = (e: React.PointerEvent) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const i = Math.floor(((e.clientX - box.left) / box.width) * candles.length);
    setHover(i >= 0 && i < candles.length ? i : null);
  };

  const shown = hover ?? candles.length - 1;
  const c = candles[shown];
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) =>
    Math.min(candles.length - 1, Math.round(f * (candles.length - 1))),
  );

  return (
    <div className="ws-chart">
      <div className="ws-readout">
        <span className="ws-readout-t num">{c.t}</span>
        <Read k="O" v={num(c.o)} />
        <Read k="H" v={num(c.h)} />
        <Read k="L" v={num(c.l)} />
        <Read k="C" v={num(c.c)} dir={c.c - c.o} />
        <span className="ws-readout-gap" />
        <Read k="Put w." v={num(c.putW)} dir={1} />
        <Read k="Call w." v={num(c.callW)} dir={-1} />
      </div>

      <svg
        ref={svgRef}
        className="ws-chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Illustrative intraday candles with per-candle option writing flow. Session ${candles[0].t} to ${candles[candles.length - 1].t}.`}
        onPointerMove={move}
        onPointerLeave={() => setHover(null)}
      >
        {/* price gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            className="ws-grid-line"
            x1={0}
            x2={W}
            y1={PRICE_TOP + f * PRICE_H}
            y2={PRICE_TOP + f * PRICE_H}
          />
        ))}

        {candles.map((k, i) => {
          const x = i * cw + cw / 2;
          const up = k.c >= k.o;
          return (
            <g key={k.t} className={up ? 'is-up' : 'is-down'}>
              <line className="ws-wick" x1={x} x2={x} y1={yPx(k.h)} y2={yPx(k.l)} />
              <rect
                className="ws-body"
                x={x - body / 2}
                width={body}
                y={yPx(Math.max(k.o, k.c))}
                height={Math.max(1, Math.abs(yPx(k.o) - yPx(k.c)))}
              />
            </g>
          );
        })}

        {/* flow pane: put writing above the zero line, call writing below */}
        <line className="ws-zero" x1={0} x2={W} y1={zero} y2={zero} />
        {candles.map((k, i) => {
          const x = i * cw + cw / 2;
          return (
            <g key={k.t}>
              <rect
                className="ws-flow is-up"
                x={x - body / 2}
                width={body}
                y={zero - yFlow(k.putW)}
                height={yFlow(k.putW)}
              />
              <rect
                className="ws-flow is-down"
                x={x - body / 2}
                width={body}
                y={zero}
                height={yFlow(k.callW)}
              />
            </g>
          );
        })}

        {hover !== null ? (
          <line
            className="ws-cross"
            x1={hover * cw + cw / 2}
            x2={hover * cw + cw / 2}
            y1={PRICE_TOP}
            y2={FLOW_TOP + FLOW_H}
          />
        ) : null}

        {ticks.map((i) => (
          <text key={i} className="ws-axis" x={i * cw + cw / 2} y={H - 4}>
            {candles[i].t}
          </text>
        ))}
      </svg>
    </div>
  );
}

function Read({ k, v, dir }: { k: string; v: string; dir?: number }) {
  return (
    <span className="ws-readout-k">
      {k} <b className={`num ${dir === undefined ? '' : dirClass(dir)}`}>{v}</b>
    </span>
  );
}

/* -------------------------------------------------------- strike ladder */

function StrikeLadder({ data }: { data: ReturnType<typeof getApex> }) {
  const max = Math.max(...data.strikes.map((s) => Math.max(s.callOi, s.putOi)));

  return (
    <ul className="ws-ladder">
      <li className="ws-ladder-head micro">
        <span>Call OI</span>
        <span>Strike</span>
        <span>Put OI</span>
      </li>
      {data.strikes.map((s) => (
        <li key={s.strike} className="ws-ladder-row" data-atm={s.atm || undefined}>
          <span className="ws-ladder-side is-call">
            <span className="num">{s.callOi.toFixed(1)}</span>
            <i style={{ width: `${(s.callOi / max) * 100}%` }} />
          </span>
          <span className="ws-ladder-strike num">{s.strike}</span>
          <span className="ws-ladder-side is-put">
            <i style={{ width: `${(s.putOi / max) * 100}%` }} />
            <span className="num">{s.putOi.toFixed(1)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
