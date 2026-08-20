'use client';

import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { LoginButton } from './LoginButton';
import { onAuth, signOutUser, type AuthUser } from '@/lib/auth/auth';

export function AccountButton() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => onAuth(setUser), []);

  if (!user) {
    return <LoginButton className="btn btn-line btn-sm nav-login" />;
  }

  const tail = user.phone ? user.phone.slice(-4) : '';

  return (
    <button
      type="button"
      className="btn btn-line btn-sm nav-login"
      onClick={() => void signOutUser()}
      title={tail ? `Signed in as •••• ${tail}` : 'Signed in'}
    >
      <LogOut size={15} aria-hidden="true" />
      Sign out
    </button>
  );
}
