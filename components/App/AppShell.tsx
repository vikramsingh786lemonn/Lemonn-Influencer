'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/Pock/Logo';
import { ThemeToggle } from '@/components/Pock/ThemeToggle';
import { WorldTicker } from '@/components/Pock/WorldTicker';
import { LoginButton } from '@/components/Pock/Login/LoginButton';
import { signOutUser } from '@/lib/auth/auth';
import { useAuthUser } from '@/hooks/useAuthUser';
import { APP_TABS } from '@/lib/app-tabs';
import { legalHref } from '@/lib/routes';

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  if (user === undefined) {
    return (
      <div className="pk ws-boot">
        <p className="body">Loading…</p>
      </div>
    );
  }

  if (!user) return <SignedOut />;

  return (
    <div className="pk ws" id="top">
      <header className="ws-bar">
        <div className="ws-bar-inner">
          <Link href="/" className="ws-brand" aria-label="TradeFinder home">
            <Logo size={30} />
          </Link>

          <nav className="ws-tabs" aria-label="Workspace">
            {APP_TABS.map((t) => {
              const active = pathname === `/app/${t.id}`;
              return (
                <Link
                  key={t.id}
                  href={`/app/${t.id}`}
                  className="ws-tab"
                  data-active={active || undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {t.short}
                </Link>
              );
            })}
          </nav>

          <div className="ws-spacer" />
          <ThemeToggle />
          <button
            type="button"
            className="btn btn-line ws-icon-btn"
            onClick={() => {
              void signOutUser().then(() => router.push('/'));
            }}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={16} strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      </header>

      <WorldTicker />

      <main className="ws-main">
        {children}
        <WorkspaceFooter />
      </main>

      <nav className="ws-bottom" aria-label="Workspace">
        {APP_TABS.map((t) => {
          const active = pathname === `/app/${t.id}`;
          return (
            <Link
              key={t.id}
              href={`/app/${t.id}`}
              className="ws-bottom-tab"
              data-active={active || undefined}
              aria-current={active ? 'page' : undefined}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? 2 : 1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                dangerouslySetInnerHTML={{ __html: t.icon }}
              />
              <span>{t.short}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SignedOut() {
  return (
    <div className="pk ws-boot">
      <h1 className="ws-title">Sign in to continue</h1>
      <p className="body">The workspace needs a verified mobile number.</p>
      {/* This screen exists to get someone signed in, so it leads with the
          thing that does it. It previously offered only a link back to the
          marketing site. */}
      <LoginButton className="btn btn-pear btn-sm" />
      <Link href="/" className="btn btn-line btn-sm">
        Back to TradeFinder
      </Link>
    </div>
  );
}

function WorkspaceFooter() {
  return (
    <footer className="ws-foot">
      <p className="micro">
        TradeFinder is an analytics platform, not an advisory. Nothing here is a
        recommendation to buy or sell any security.
      </p>
      <nav className="ws-foot-links" aria-label="Legal">
        <Link href={legalHref('disclaimer')}>Disclaimer</Link>
        <Link href={legalHref('terms')}>Terms</Link>
        <Link href={legalHref('privacy')}>Privacy</Link>
        <Link href={legalHref('refund')}>Refunds</Link>
      </nav>
    </footer>
  );
}
