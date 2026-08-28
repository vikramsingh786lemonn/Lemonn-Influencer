import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { LEGAL_PAGES, LEGAL_SLUGS } from '@/lib/legal';
import '../../pock.css';

/* Legal documents are public on purpose. They used to live under `/app/legal/`,
   behind the workspace auth gate — but the login form links the terms and the
   investor charter from its consent line, which a visitor reads *before* they
   have an account. A consent link that demands a login to read is worse than no
   link at all. */

export function generateStaticParams() {
  return LEGAL_SLUGS.map((page) => ({ page }));
}

type Params = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = LEGAL_PAGES[(await params).page];
  return {
    title: doc ? `${doc.title} — TradeFinder` : 'TradeFinder',
    robots: doc?.pending ? { index: false, follow: true } : undefined,
  };
}

export default async function LegalPage({ params }: Params) {
  const doc = LEGAL_PAGES[(await params).page];
  if (!doc) notFound();

  return (
    <div className="pk">
      <div className="wrap ws-legal">
        <Link href="/" className="ws-back">
          <ArrowLeft size={15} strokeWidth={1.8} aria-hidden />
          Back to TradeFinder
        </Link>

        <div className="ws-head">
          <div className="ws-head-row">
            <h1 className="ws-title">{doc.title}</h1>
          </div>
        </div>

        {doc.pending ? (
          <div className="ws-empty">
            <p className="body">
              <b>{doc.title}</b> is awaiting approved copy.
            </p>
            <p className="micro">
              This page is intentionally empty rather than filled with placeholder
              legal text — see lib/legal.ts.
            </p>
          </div>
        ) : (
          <div className="ws-prose">
            {doc.blocks.map(([kind, text], i) =>
              kind === 'h' ? (
                <h2 key={i} className="ws-prose-h">
                  {text}
                </h2>
              ) : (
                <p key={i} className="body">
                  {text}
                </p>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
