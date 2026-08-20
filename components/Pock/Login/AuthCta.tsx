'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LoginButton } from './LoginButton';
import { onAuth, type AuthUser } from '@/lib/auth/auth';
import { DEFAULT_TAB } from '@/lib/app-tabs';

export function AuthCta({
  className = 'btn btn-line',
  children,
  /* Straight to the default tab, not /app. Bare /app is a server redirect, so
     linking to it costs an extra round trip on every entry to the workspace. */
  signedInHref = `/app/${DEFAULT_TAB}`,
  signedInLabel = 'Open workspace',
  onOpen,
}: {
  className?: string;
  children?: ReactNode;
  signedInHref?: string;
  signedInLabel?: ReactNode;
  onOpen?: () => void;
}) {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => onAuth(setUser), []);

  if (user) {
    return (
      <Link className={className} href={signedInHref} onClick={onOpen}>
        {signedInLabel}
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <LoginButton className={className} onOpen={onOpen}>
      {children}
    </LoginButton>
  );
}
