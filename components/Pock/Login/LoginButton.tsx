'use client';

import { useState, type ReactNode } from 'react';
import { LoginModal } from './LoginModal';

export function LoginButton({
  className = 'btn btn-line',
  children = 'Log in',
  onOpen,
}: {
  className?: string;
  children?: ReactNode;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setOpen(true);
          onOpen?.();
        }}
      >
        {children}
      </button>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
