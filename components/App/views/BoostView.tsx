import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { getBoost } from '@/lib/scanners';
import { tvSymbol, tvUrl } from '@/lib/watchlist';
import { dirClass, pct, signed } from '@/lib/format';

export function BoostView() {
  const rows = getBoost();

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Intraday Boost"
        subtitle="Top 15 F&O names by Boost — relative strength vs Nifty, confirmed by OI flow."
      />

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Strongest longs &amp; shorts</h2>
          <span className="micro">Symbol opens TradingView</span>
        </div>

        <div className="ws-boost-head">
          <span />
          <span>Symbol</span>
          <span className="ws-boost-num">1D %</span>
          <span className="ws-boost-num">Boost</span>
          <span className="ws-boost-mid">Signal</span>
        </div>

        <ol className="ws-boost">
          {rows.map((r, i) => {
            const long = r.score >= 0;
            return (
              <li key={r.sym} className="ws-boost-row">
                <span className="ws-rank-n num">{i + 1}</span>

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
                    <span className={`ws-boost-side ${long ? 'is-up' : 'is-down'}`}>
                      {long ? 'LONG' : 'SHORT'}
                    </span>
                  </span>
                </span>

                <span className={`ws-boost-num num ${dirClass(r.chgPct)}`}>
                  {pct(r.chgPct)}
                </span>

                <span className="ws-boost-num">
                  <span className={`ws-chip ${long ? 'is-up' : 'is-down'} num`}>
                    {signed(r.score)}
                  </span>
                </span>

                <span className={`ws-boost-mid ${long ? 'is-up' : 'is-down'}`} aria-hidden>
                  {long ? '▲' : '▼'}
                </span>
              </li>
            );
          })}
        </ol>

      </section>

      <p className="micro ws-foot-note">
        Boost combines relative strength against Nifty with futures OI change in
        the same direction, ranked by absolute strength. It describes what the
        measure shows, not what to trade.
      </p>
    </div>
  );
}
