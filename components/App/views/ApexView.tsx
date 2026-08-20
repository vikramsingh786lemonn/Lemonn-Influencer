import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { getApex } from '@/lib/apex';

export function ApexView() {
  const { heatmap } = getApex();

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Options Apex"
        subtitle="Nifty 50 — intraday candles with net option-writing flow."
      />

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Nifty 50 — intraday + OI flow</h2>
        </div>
        <div className="ws-empty ws-empty-sm">
          <p className="body">Not connected to an intraday feed.</p>
          <p className="micro">
            Candles and option-writing flow need a live market data source.
          </p>
        </div>
      </section>

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">Nifty 50 heatmap</h2>
          <span className="micro">{heatmap.length} stocks · sample</span>
        </div>

        <div className="ws-heat">
          {heatmap.map((t) => (
            <div
              key={t.sym}
              className="ws-tile"
              style={{
                background: `rgba(var(${t.chgPct >= 0 ? '--up-rgb' : '--down-rgb'}), ${(
                  0.14 + 0.5 * Math.min(1, Math.abs(t.chgPct) / 3)
                ).toFixed(2)})`,
              }}
            >
              <p className="ws-tile-sym">{t.sym}</p>
              <p className={`ws-tile-pct num ${t.chgPct >= 0 ? 'is-up' : 'is-down'}`}>
                {t.chgPct >= 0 ? '+' : ''}
                {t.chgPct.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
