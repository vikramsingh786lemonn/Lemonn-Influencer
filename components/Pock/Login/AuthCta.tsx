'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LoginButton } from './LoginButton';
import { useAuthUser } from '@/hooks/useAuthUser';
import { WORKSPACE_HREF } from '@/lib/routes';

export function AuthCta({
  className = 'btn btn-line',
  children,
  signedInHref = WORKSPACE_HREF,
  signedInLabel = 'Open workspace',
  onOpen,
}: {
  className?: string;
  children?: ReactNode;
  signedInHref?: string;
  signedInLabel?: ReactNode;
  onOpen?: () => void;
}) {
  const user = useAuthUser();

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
