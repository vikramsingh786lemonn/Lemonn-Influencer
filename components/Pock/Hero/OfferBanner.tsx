import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PURCHASE_HREF } from '@/lib/routes';

export function OfferBanner() {
  return (
    <div className="offer">
      <span className="tag offer-tag">Diamond plan offer</span>
      <p className="offer-copy">
        Get <strong>6 months + 6 months free (₹4,999)</strong> — all premium scanners unlocked. No
        recurring auto-renewals.
      </p>
      <Link className="offer-link" href={PURCHASE_HREF}>
        Claim offer
        <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  );
}
