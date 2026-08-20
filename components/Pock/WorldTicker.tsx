'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { getWorld, SAMPLE, type WorldItem } from '@/lib/world';

const sign = (n: number) =>
  (n >= 0 ? '+' : '') + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

export function WorldTicker() {
  const [items, setItems] = useState<WorldItem[]>(SAMPLE);

  useEffect(() => {
    let alive = true;
    let id = 0;

    const load = () => {
      void getWorld().then(({ items: next, live }) => {
        if (!alive) return;
        setItems(next);
        if (live && !id) id = window.setInterval(load, 60_000);
      });
    };

    load();
    return () => {
      alive = false;
      if (id) window.clearInterval(id);
    };
  }, []);

  if (!items.length) return null;

  const row = (
    <div className="tick-row" aria-hidden>
      {items.map((it) => (
        <span className="tick" key={it.name}>
          <b className="tick-name">{it.name}</b>
          <span className="tick-price num">{fmt(it.price)}</span>
          <span className={`tick-chg num ${it.chgPct >= 0 ? 'is-up' : 'is-down'}`}>
            {sign(it.chg)} ({sign(it.chgPct)}%)
          </span>
        </span>
      ))}
    </div>
  );

  const duration = Math.max(30, items.length * 4.5);

  return (
    <div className="wrap ticker-band">
      <div className="ticker">
        <div className="tick-track" style={{ '--tick-dur': `${duration}s` } as CSSProperties}>
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}
