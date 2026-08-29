'use client';

import type { ReactNode } from 'react';
import { useTilt } from '@/hooks/useTilt';

/* Lets the server-rendered marketing page tilt one card without making the
   whole section a client component. Does not wrap children — `.price-card` is a
   flex column relying on `margin-top: auto`. */
export function TiltCard({
  as: Tag = 'div',
  className,
  children,
  maxTilt,
}: {
  as?: 'div' | 'article' | 'section';
  className?: string;
  children: ReactNode;
  maxTilt?: number;
}) {
  const tilt = useTilt<HTMLDivElement>(maxTilt);

  return (
    <Tag className={className} {...tilt}>
      <span className="tilt-sheen" aria-hidden />
      {children}
    </Tag>
  );
}
