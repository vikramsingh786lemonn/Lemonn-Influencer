import Link from 'next/link';
import { AuthCta } from '../Login/AuthCta';

export function HeroActions() {
  return (
    <div className="hero-actions">
      <Link className="btn btn-pear" href="/payments">
        Buy now
      </Link>
      <AuthCta className="btn btn-line" />
    </div>
  );
}
