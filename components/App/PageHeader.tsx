export function PageHeader({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="ws-head">
      <div className="ws-head-row">
        <h1 className="ws-title">{title}</h1>
        {meta ? <span className="ws-head-meta">{meta}</span> : null}
      </div>
      {subtitle ? <p className="body">{subtitle}</p> : null}
    </div>
  );
}
