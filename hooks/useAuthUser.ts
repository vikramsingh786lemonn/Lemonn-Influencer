'use client';

import { useEffect, useState } from 'react';
import { onAuth, type AuthUser } from '@/lib/auth/auth';

/** Auth state has three values, and all three matter:
 *
 *   undefined  still resolving — render nothing conclusive
 *   null       signed out
 *   AuthUser   signed in
 *
 * Collapsing `undefined` into "signed out" is what makes a login prompt flash on
 * every refresh, so the return type keeps it. Four components used to inline
 * this same useState/useEffect pair; they all call this instead. */
export function useAuthUser(): AuthUser | null | undefined {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  useEffect(() => onAuth(setUser), []);
  return user;
}
