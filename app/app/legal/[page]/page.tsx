import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/App/PageHeader';
import { LEGAL_PAGES, LEGAL_SLUGS } from '@/lib/legal';
import { DEFAULT_TAB } from '@/lib/app-tabs';

export function generateStaticParams() {
  return LEGAL_SLUGS.map((page) => ({ page }));
}

type Params = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = LEGAL_PAGES[(await params).page];
  return {
    title: doc ? `${doc.title} · TradeFinder` : 'Workspace · TradeFinder',
    robots: { index: false, follow: false },
  };
}

export default async function LegalPage({ params }: Params) {
  const doc = LEGAL_PAGES[(await params).page];
  if (!doc) notFound();

  return (
    <div className="ws-legal">
      <Link href={`/app/${DEFAULT_TAB}`} className="ws-back">
        <ArrowLeft size={15} strokeWidth={1.8} aria-hidden />
        Back to workspace
      </Link>

      <PageHeader title={doc.title} />

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
  );
}
