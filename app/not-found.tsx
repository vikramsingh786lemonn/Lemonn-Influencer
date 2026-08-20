import Link from 'next/link';
import './pock.css';

export default function NotFound() {
  return (
    <div className="pk">
      <section
        className="wrap band"
        style={{ minHeight: '100vh', display: 'grid', alignContent: 'center' }}
      >
        <span className="tag" style={{ justifySelf: 'start' }}>
          404
        </span>
        <h1 className="d1" style={{ marginTop: 24 }}>
          Nothing trading here
        </h1>
        <p className="lede" style={{ marginTop: 20 }}>
          That page does not exist. The scanners are still running.
        </p>
        <Link className="btn btn-grass" href="/" style={{ marginTop: 32, justifySelf: 'start' }}>
          Back to TradeFinder
        </Link>
      </section>
    </div>
  );
}
