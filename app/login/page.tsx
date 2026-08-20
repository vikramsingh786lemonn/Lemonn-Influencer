import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Pock/Logo';
import { LoginForm } from '@/components/Pock/Login/LoginForm';
import '../pock.css';

export const metadata: Metadata = {
  title: 'Log in — TradeFinder',
  description: 'Log in to TradeFinder with your mobile number.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="pk">
      <main className="auth-split">
        <aside className="auth-aside">
          <Link href="/" className="auth-brand" aria-label="TradeFinder home">
            <Logo size={30} />
          </Link>

          <div>
            <h2 className="auth-aside-title">
              The session is already running. Log in and read it.
            </h2>
            <p className="auth-aside-sub">
              Option Apex, Option Clock and Sector Scope — institutional positioning as it
              forms, on one login.
            </p>
          </div>

          <Link href="/" className="auth-back">
            <ArrowLeft size={15} aria-hidden="true" />
            Back to site
          </Link>
        </aside>

        <section className="auth-main">
          <LoginForm />
        </section>
      </main>
    </div>
  );
}
