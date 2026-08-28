import { Monogram } from '../Monogram';
import { PageHeader } from '../PageHeader';
import { SamplePill } from '../SampleNote';
import { getMovers, type ScanRow } from '@/lib/scanners';
import { tvSymbol, tvUrl } from '@/lib/watchlist';
import { dirClass, inr, pct } from '@/lib/format';

function List({ title, rows }: { title: string; rows: ScanRow[] }) {
  return (
    <section className="ws-card">
      <div className="ws-card-head">
        <h2 className="ws-card-title">{title}</h2>
        <span className="micro">{rows.length} stocks</span>
      </div>
      <div className="ws-rank-head">
        <span className="ws-rank-n" />
        <span className="ws-rank-sym">Symbol</span>
        <span className="ws-rank-px">Price</span>
        <span className="ws-rank-chg">1D %</span>
      </div>
      <ol className="ws-rank">
        {rows.map((r, i) => (
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
    </section>
  );
}

export function MoversView() {
  const { gainers, losers } = getMovers();

  return (
    <div>
      <PageHeader
        meta={<SamplePill />}
        title="Top Gainers & Losers"
        subtitle={`F&O universe · ${gainers.length + losers.length} stocks · today's move.`}
      />

      <div className="ws-duo">
        <List title="Top Gainers" rows={gainers} />
        <List title="Top Losers" rows={losers} />
      </div>
    </div>
  );
}
