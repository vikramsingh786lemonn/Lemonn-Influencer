import Link from 'next/link';
import { MaskLines, Reveal } from '../Motion';
import { AuthCta } from '../Login/AuthCta';
import { OfferBanner } from './OfferBanner';
import { PURCHASE_HREF } from '@/lib/routes';

/* The status badge, the action pair and the trust line used to be three
   separate files of eight to thirteen lines each — no props, no state, one call
   site apiece. They read better here, next to the copy they belong to.
   OfferBanner stays its own file: it is the one piece with a plausible second
   home elsewhere on the site. */

export function HeroSection() {
  return (
    <section className="hero">
      <div className="wrap hero-head">
        <div className="hero-floor" aria-hidden="true" />

        <span className="hero-live">
          <span className="status-dot" aria-hidden="true" />
          <span className="hero-live-label">Live market feed</span>
        </span>

        <MaskLines
          className="hero-title"
          delay={0.08}
          lines={[
            'Trade alongside',
            'institutional operators',
            <span key="accent" className="hero-accent">
              in real time.
            </span>,
          ]}
        />

        <p className="lede hero-lede">
          Track candle-by-candle open interest, catch volume surges in 5-minute windows, and align
          your intraday option trades with market operators.
        </p>

        <div className="hero-actions">
          <Link className="btn btn-pear" href={PURCHASE_HREF}>
            Buy now
          </Link>
          <AuthCta className="btn btn-line" />
        </div>

        <p className="hero-trust">
          <span className="hero-trust-key">Integrated with</span> TradingView Advanced Charts
          &amp; Dhan brokerage APIs
        </p>
      </div>

      <div className="wrap">
        <Reveal y={14} delay={0.1}>
          <OfferBanner />
        </Reveal>
      </div>
    </section>
  );
}
