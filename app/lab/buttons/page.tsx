'use client';

import { useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import './buttons.css';

type Case = {
  idx: string;
  name: string;
  note: string;
  cls: string;
  plate?: string;
  label: string;
  spec: string;
};

const CASES: Case[] = [
  {
    idx: '01',
    name: 'Raised',
    note: 'The extruded default. Four layers: inset top highlight, inset bottom shade, a tight contact shadow, and a wide ambient one. Press inverts the bevel so the light moves to the bottom edge.',
    cls: 'b-raised',
    label: 'Start scanning',
    spec: 'inset 0 1px 0 rgba(255,255,255,.75)\ninset 0 -2px 0 rgba(16,48,15,.22)\n0 1px 1px / 0 2px 4px / 0 8px 16px -6px',
  },
  {
    idx: '02',
    name: 'Pressed',
    note: 'A control that lives depressed — segmented states, active filters. Carved into the plate rather than sitting on it, with the highlight on the lower edge where a well would catch light.',
    cls: 'b-pressed',
    label: '1D · 1W · 1M',
    spec: 'inset 0 2px 5px rgba(9,26,12,.26)\ninset 0 -1px 0 rgba(255,255,255,.85)',
  },
  {
    idx: '03',
    name: 'Floating',
    note: 'The primary action. Depth comes from shadow distance, not bevel — the fill stays near-flat so elevation reads as height rather than thickness. Hover drifts a single specular band across.',
    cls: 'b-float',
    label: 'Open TradeStream',
    spec: '0 2px 4px / 0 10px 20px -6px / 0 24px 48px -12px\nhover: translateY(-3px), shadows scale with distance',
  },
  {
    idx: '04',
    name: 'Glass',
    note: 'Transparent material over content. The rim sells it: bright top edge, dark bottom edge, and a 1px inner ring — how a bevelled pane actually refracts. Needs something behind it to exist.',
    cls: 'b-glass',
    plate: 'plate-glass',
    label: 'View option chain',
    spec: 'backdrop-filter: blur(14px) saturate(1.5)\ninset 0 1px 0 rgba(255,255,255,.55)\ninset 0 0 0 1px rgba(255,255,255,.16)',
  },
  {
    idx: '05',
    name: 'Neumorphic',
    note: 'Extruded from the surface, same material. The rule that makes or breaks it: button and plate must share one fill — any colour difference and it collapses into a plain card. Press swaps both lights inside.',
    cls: 'b-neu',
    plate: 'plate-neu',
    label: 'Add to watchlist',
    spec: '-6px -6px 14px rgba(255,255,255,.9)\n 6px  6px 14px rgba(9,26,12,.16)\nactive: both inset',
  },
];

export default function ButtonLab() {
  const [stage, setStage] = useState<'light' | 'dark'>('light');

  return (
    <div className="lab" data-stage={stage}>
      <header className="lab-head">
        <div>
          <h1 className="lab-title">Button lab — 3D material studies</h1>
          <p className="lab-sub">
            Five depth treatments for a trading interface. Each is built from layered box-shadows
            rather than images, so they stay crisp at any zoom and cost nothing to render.
          </p>
        </div>

        <div className="stage-switch" role="group" aria-label="Stage">
          {(['light', 'dark'] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={stage === s}
              onClick={() => setStage(s)}
            >
              {s === 'light' ? 'Light stage' : 'Dark stage'}
            </button>
          ))}
        </div>
      </header>

      <div className="grid">
        {CASES.map((c) => (
          <section className="case" key={c.idx}>
            <div className="case-head">
              <h2 className="case-name">{c.name}</h2>
              <span className="case-idx">{c.idx}</span>
            </div>
            <p className="case-note">{c.note}</p>

            <div className={c.plate ? `plate ${c.plate}` : 'plate'}>
              <button type="button" className={`b3 ${c.cls} is-lg`}>
                <span>{c.label}</span>
                {c.cls === 'b-float' && <ArrowUpRight size={18} strokeWidth={2.4} />}
              </button>

              <div className="states">
                {(['Rest', 'Hover', 'Press'] as const).map((label) => (
                  <span className="state-label" key={label}>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      className={[
                        'b3',
                        c.cls,
                        'is-sm',
                        label === 'Hover' ? 'is-hover' : '',
                        label === 'Press' ? 'is-press' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <span>Trade</span>
                    </button>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <pre className="spec">{c.spec}</pre>
          </section>
        ))}

        <section className="case">
          <div className="case-head">
            <h2 className="case-name">Scale &amp; icon forms</h2>
            <span className="case-idx">06</span>
          </div>
          <p className="case-note">
            The bevel is a fixed 1–2px at every size, so it reads identically at 40px and 60px.
            Corner radius scales with height; shadow spread does not.
          </p>

          <div className="plate">
            <div className="states" style={{ marginTop: 0, alignItems: 'center' }}>
              <button type="button" className="b3 b-raised is-sm">
                <span>Small</span>
              </button>
              <button type="button" className="b3 b-raised">
                <span>Default</span>
              </button>
              <button type="button" className="b3 b-raised is-lg">
                <span>Large</span>
              </button>
              <button type="button" className="b3 b-float is-icon" aria-label="Play tutorial">
                <Play size={18} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <pre className="spec">{'--h: 40 / 52 / 60px\nradius: 12 / 16 / 20px\nbevel: constant'}</pre>
        </section>
      </div>
    </div>
  );
}
