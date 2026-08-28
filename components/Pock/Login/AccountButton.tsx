'use client';

import { LogOut } from 'lucide-react';
import { LoginButton } from './LoginButton';
import { signOutUser } from '@/lib/auth/auth';
import { useAuthUser } from '@/hooks/useAuthUser';

export function AccountButton() {
  const user = useAuthUser();

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
