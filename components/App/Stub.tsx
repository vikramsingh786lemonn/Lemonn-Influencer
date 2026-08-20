import { PageHeader } from './PageHeader';

export function Stub({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle ?? 'Part of the scanner build — wiring up shortly.'}
      />
      <div className="ws-empty">
        <p className="body">
          <b>{title}</b> is being built.
        </p>
        <p className="micro">
          The layout is in place; the live data feed is not connected yet.
        </p>
      </div>
    </div>
  );
}
