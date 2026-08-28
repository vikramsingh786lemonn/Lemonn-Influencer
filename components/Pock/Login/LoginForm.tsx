'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import {
  AUTH_MODE,
  onAuth,
  resetVerifier,
  sendOtp,
  verifyOtp,
  type AuthUser,
} from '@/lib/auth/auth';
import { legalHref, WORKSPACE_HREF } from '@/lib/routes';

const CC = '+91';

const RESEND_COOLDOWN = 30;

export function LoginForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [devCode, setDevCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  const digits = phone.replace(/\D/g, '');

  useEffect(() => {
    return onAuth((u: AuthUser | null | undefined) => {
      if (!u) return;
      if (onSuccess) onSuccess();
      router.replace(WORKSPACE_HREF);
    });
  }, [router, onSuccess]);

  useEffect(() => {
    if (step === 'code') codeRef.current?.focus();
  }, [step]);

  useEffect(() => {
    return () => resetVerifier();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const request = useCallback(
    async (isResend: boolean) => {
      if (busy || (isResend && cooldown > 0)) return;
      setError('');
      setNote('');
      if (digits.length !== 10) {
        setError('Enter your 10-digit Indian mobile number.');
        return;
      }
      setBusy(true);
      try {
        const { devCode: dc } = await sendOtp(CC + digits);
        setDevCode(dc ?? '');
        setCode('');
        setStep('code');
        setCooldown(RESEND_COOLDOWN);
        if (isResend) setNote('A new code has been sent.');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not send the code.');
      }
      setBusy(false);
    },
    [busy, cooldown, digits],
  );

  async function confirm() {
    if (busy) return;
    setError('');
    setNote('');
    const entered = code.replace(/\D/g, '');
    if (entered.length < 6) {
      setError('Enter the 6-digit code.');
      return;
    }
    setBusy(true);
    try {
      await verifyOtp(entered);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed.');
      setBusy(false);
      codeRef.current?.select();
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'phone') void request(false);
    else void confirm();
  };

  return (
    <div className="auth-panel">
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {step === 'phone' ? (
          <>
            <h1 className="auth-title">Log in</h1>
            <p className="auth-sub">
              We&apos;ll text you a one-time code. No password — your mobile number is the
              account.
            </p>

            <label className="auth-label" htmlFor="tf-phone">
              Indian mobile number
            </label>
            <div className="auth-row">
              <span className="auth-fixed-cc num" id="tf-phone-cc">
                {CC}
              </span>
              <input
                id="tf-phone"
                className="auth-input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                aria-describedby="tf-phone-cc"
                placeholder="98765 43210"
                value={phone}
                disabled={busy}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                  if (error) setError('');
                }}
              />
            </div>

            <Feedback error={error} note={note} />

            <button className="btn btn-pear auth-submit" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send code'}
            </button>
          </>
        ) : (
          <>
            <button
              className="auth-change"
              type="button"
              onClick={() => {
                setStep('phone');
                setCode('');
                setError('');
                setNote('');
              }}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Change number
            </button>

            <h1 className="auth-title">Enter code</h1>
            <p className="auth-sub">
              Sent to{' '}
              <strong className="num">
                {CC} {digits}
              </strong>
              .
            </p>

            {devCode && (
              <p className="auth-demo">
                Demo mode — use code <b className="num">{devCode}</b> to sign in.
              </p>
            )}

            <label className="auth-label" htmlFor="tf-code">
              6-digit code
            </label>
            <input
              id="tf-code"
              ref={codeRef}
              className="auth-input auth-code"
              type="tel"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="······"
              value={code}
              disabled={busy}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                if (error) setError('');
              }}
            />

            <Feedback error={error} note={note} />

            <button className="btn btn-pear auth-submit" type="submit" disabled={busy}>
              {busy ? 'Verifying…' : 'Verify & continue'}
            </button>

            <button
              className="auth-resend"
              type="button"
              onClick={() => void request(true)}
              disabled={busy || cooldown > 0}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
            </button>
          </>
        )}

        <p className="auth-foot micro">
          <ShieldCheck size={13} aria-hidden="true" />
          {AUTH_MODE === 'demo'
            ? 'Demo mode — no real account is created.'
            : 'Secured by Firebase Phone Authentication.'}
        </p>
      </form>

      <p className="auth-legal micro">
        By continuing you agree to our{' '}
        <Link href={legalHref('terms')}>terms</Link> and confirm you have read the{' '}
        <Link href={legalHref('investor-charter')}>investor charter</Link>. TradeFinder is
        an analytics platform, not an advisory.
      </p>

      <div id="recaptcha-container" />
    </div>
  );
}

function Feedback({ error, note }: { error: string; note: string }) {
  if (error) {
    return (
      <p className="auth-error" role="alert">
        {error}
      </p>
    );
  }
  if (note) {
    return (
      <p className="auth-note" role="status">
        {note}
      </p>
    );
  }
  return null;
}
