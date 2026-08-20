import { MaskLines, Reveal } from '../Motion';
import { LiveStatusBadge } from './LiveStatusBadge';
import { HeroActions } from './HeroActions';
import { TrustStrip } from './TrustStrip';
import { OfferBanner } from './OfferBanner';

export function HeroSection() {
  return (
    <section className="hero">
      <div className="wrap hero-head">
        <div className="hero-floor" aria-hidden="true" />

        <LiveStatusBadge />

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

        <HeroActions />
        <TrustStrip />
      </div>

      <div className="wrap">
        <Reveal y={14} delay={0.1}>
          <OfferBanner />
        </Reveal>
      </div>
    </section>
  );
}
