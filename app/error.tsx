'use client';

import Link from 'next/link';
import './pock.css';

/* Any uncaught render error below the root used to produce a blank page. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="pk">
      <section
        className="wrap band"
        style={{ minHeight: '100vh', display: 'grid', alignContent: 'center' }}
      >
        <span className="tag" style={{ justifySelf: 'start' }}>
          error
        </span>
        <h1 className="d1" style={{ marginTop: 24 }}>
          That didn&apos;t load
        </h1>
        <p className="lede" style={{ marginTop: 20 }}>
          Something broke on our side rather than yours. Trying again usually clears it.
        </p>
        <div
          style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}
        >
          <button type="button" className="btn btn-pear" onClick={reset}>
            Try again
          </button>
          <Link className="btn btn-line" href="/">
            Back to TradeFinder
          </Link>
        </div>
      </section>
    </div>
  );
}
