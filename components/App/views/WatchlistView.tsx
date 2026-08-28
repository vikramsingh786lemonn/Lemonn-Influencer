'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { CONSTITUENTS } from '@/lib/sample-data';
import {
  addSymbol,
  getAlerts,
  getWatch,
  setAlerts,
  type AlertPrefs,
  removeSymbol,
  tvSymbol,
  tvUrl,
  updateSymbol,
  type WatchItem,
} from '@/lib/watchlist';

export function WatchlistView() {
  const [list, setList] = useState<WatchItem[]>([]);
  const [query, setQuery] = useState('');
  const [alerts, setAlertState] = useState<AlertPrefs>({ telegram: false, chatId: '' });

  useEffect(() => {
    setList(getWatch());
    setAlertState(getAlerts());
  }, []);

  const q = query.trim().toUpperCase();
  const matches = q
    ? CONSTITUENTS.filter((s) => s.includes(q) && !list.some((w) => w.sym === s)).slice(0, 8)
    : [];

  const level = (item: WatchItem, field: 'above' | 'below') => (
    <label className="ws-level">
      {field === 'above' ? 'Above' : 'Below'}
      <input
        type="number"
        inputMode="decimal"
        className="ws-level-input num"
        value={item[field] ?? ''}
        onChange={(e) =>
          setList(
            updateSymbol(item.sym, {
              [field]: e.target.value === '' ? null : Number(e.target.value),
            }),
          )
        }
      />
    </label>
  );

  return (
    <div>
      <PageHeader
        title="Watchlist"
        subtitle="Track symbols and note the levels you care about."
      />

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Add a symbol</h2>
          <span className="micro">Nifty 50 universe</span>
        </div>
        <div className="ws-search">
          <input
            className="ws-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol…"
            aria-label="Search symbol"
          />
          {matches.length > 0 && (
            <ul className="ws-search-drop">
              {matches.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => {
                      setList(addSymbol(s));
                      setQuery('');
                    }}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Price alerts</h2>
          <span className="micro">Not delivering yet</span>
        </div>

        <div className="ws-alerts">
          <button
            type="button"
            className="ws-switch"
            role="switch"
            aria-checked={alerts.telegram}
            onClick={() => setAlertState(setAlerts({ telegram: !alerts.telegram }))}
          >
            <span className="ws-switch-track" aria-hidden>
              <span className="ws-switch-knob" />
            </span>
            Telegram alerts
          </button>

          {alerts.telegram && (
            <input
              className="ws-search-input ws-chat-id"
              value={alerts.chatId}
              onChange={(e) => setAlertState(setAlerts({ chatId: e.target.value }))}
              placeholder="Telegram chat id"
              aria-label="Telegram chat id"
            />
          )}
        </div>

        <p className="micro ws-alert-note">
          {alerts.telegram
            ? 'Saved to this browser. No alerts will be sent — delivery needs a backend service that is not connected yet.'
            : 'Records a preference for when alert delivery is connected. Nothing monitors prices today.'}
        </p>
      </section>

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Watching ({list.length})</h2>
          <span className="micro">Symbol opens TradingView</span>
        </div>

        {list.length === 0 ? (
          <div className="ws-empty ws-empty-sm">
            <p className="body">Nothing on the list yet.</p>
            <p className="micro">Search above to add a symbol.</p>
          </div>
        ) : (
          <ul className="ws-watch">
            {list.map((item) => (
              <li key={item.sym} className="ws-watch-row">
                <a
                  className="ws-watch-sym"
                  href={tvUrl(item.sym)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${tvSymbol(item.sym)} on TradingView`}
                >
                  <Monogram sym={item.sym} size={26} />
                  {item.sym}
                  <ExternalLink size={13} strokeWidth={1.8} aria-hidden />
                </a>
                {level(item, 'above')}
                {level(item, 'below')}
                <button
                  type="button"
                  className="ws-watch-del"
                  onClick={() => setList(removeSymbol(item.sym))}
                  aria-label={`Remove ${item.sym}`}
                >
                  <X size={15} strokeWidth={2} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="micro ws-foot-note">
        Levels are saved to this browser only. Nothing monitors prices or sends
        alerts — TradeFinder is an analytics platform, not an advisory, and these
        notes are not a recommendation to buy or sell.
      </p>
    </div>
  );
}
