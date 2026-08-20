import { PageHeader } from '../PageHeader';

export function ClockView() {
  return (
    <div>
      <PageHeader
        title="Option Clock"
        subtitle="Per-strike OI change over any intraday window."
      />

      <section className="ws-card">
        <div className="ws-card-head">
          <h2 className="ws-card-title">OI Clock</h2>
        </div>
        <div className="ws-empty">
          <p className="body">No open-interest snapshots available.</p>
          <p className="micro">
            This view needs a poller capturing the option chain through the
            session. Unlike the other scanners it carries no sample data — an
            invented option chain would read as real market structure.
          </p>
        </div>
      </section>
    </div>
  );
}
