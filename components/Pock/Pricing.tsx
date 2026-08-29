import Link from 'next/link';
import { TiltCard } from './TiltCard';
import { ArrowRight, Check, ShieldOff, Smartphone, Sparkles } from 'lucide-react';
import { AuthCta } from './Login/AuthCta';
import { Reveal } from './Motion';
import { PRICING } from './content';
import { PURCHASE_HREF } from '@/lib/routes';

export function Pricing() {
  const { plan, promo, policy, device } = PRICING;

  return (
    <section className="band" id="pricing">
      <div className="wrap">
        <Reveal>
          <div className="sec-head is-center">
            <span className="tag">pricing</span>
            <h2 className="d2">One plan. Everything in it.</h2>
            <p className="lede">
              No tiers to compare and no features held back for a higher price. One term, one
              payment, every scanner.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="price-grid">
            <TiltCard as="article" className="price-card is-lead" maxTilt={4}>
              <p className="price-eyebrow">{plan.eyebrow}</p>

              <p className="price-figure">
                <span className="price-cur" aria-hidden="true">
                  ₹
                </span>
                <span className="price-pix">{plan.price}</span>
              </p>

              <p className="price-term">{plan.term}</p>
              <p className="price-note">{plan.note}</p>

              <ul className="price-list">
                {plan.includes.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="price-foot">
                <Link className="btn btn-pear price-cta" href={PURCHASE_HREF}>
                  {plan.cta}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </TiltCard>

            <TiltCard as="article" className="price-card is-offer" maxTilt={4}>
              <p className="price-ribbon">
                <Sparkles size={13} aria-hidden="true" />
                {promo.ribbon}
              </p>

              <p className="price-eyebrow">{promo.eyebrow}</p>

              <p className="price-figure">
                <span className="price-pix">{promo.price}</span>
                <s className="price-was num" aria-hidden="true">
                  ₹{promo.was}
                </s>
              </p>

              <p className="price-term">{promo.term}</p>
              <p className="price-note">
                <span className="price-elig">{promo.eligibility}</span> — full access while it
                runs, no card required.
              </p>

              <ul className="price-list">
                {promo.includes.map((item) => (
                  <li key={item}>
                    <Check size={16} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="price-foot">
                <p className="price-cta-note micro">{promo.ctaNote}</p>
                <AuthCta
                  className="btn btn-line price-cta"
                  signedInHref={PURCHASE_HREF}
                  signedInLabel={promo.cta}
                >
                  {promo.cta}
                  <ArrowRight size={16} aria-hidden="true" />
                </AuthCta>
              </div>
            </TiltCard>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="price-policy">
            <div className="price-policy-item">
              <span className="price-policy-icon" aria-hidden="true">
                <ShieldOff size={18} />
              </span>
              <div>
                <h3 className="price-policy-title">{policy.title}</h3>
                <p className="price-policy-body">{policy.body}</p>
              </div>
            </div>

            <div className="price-policy-item">
              <span className="price-policy-icon" aria-hidden="true">
                <Smartphone size={18} />
              </span>
              <div>
                <h3 className="price-policy-title">One device at a time</h3>
                <p className="price-policy-body">{device}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="price-legal micro">
            Prices in INR. TradeFinder is a market analytics platform — a subscription buys
            access to the scanners and the education, never a recommendation to buy or sell,
            and never a projection of results.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
