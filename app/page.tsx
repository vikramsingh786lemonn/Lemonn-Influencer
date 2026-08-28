import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/Pock/Nav';
import { HeroSection } from '@/components/Pock/Hero';
import { Scanners } from '@/components/Pock/Scanners';
import { Shorts } from '@/components/Pock/Shorts';
import { Why } from '@/components/Pock/Why';
import { Pricing } from '@/components/Pock/Pricing';
import { Logo } from '@/components/Pock/Logo';
import { Faq } from '@/components/Pock/Faq';
import { Preloader } from '@/components/Pock/Preloader';
import { Reveal, Rail } from '@/components/Pock/Motion';
import { WorldTicker } from '@/components/Pock/WorldTicker';
import { FOOTER, SOCIALS, DISCLAIMER } from '@/components/Pock/content';
import './pock.css';

export const metadata: Metadata = {
  title: 'TradeFinder — Find the trade before the move',
  description:
    'A live market scanner for Indian F&O traders. Six scanners that read smart-money flow in stocks and index options, during the session — not after it.',
};

export default function Home() {
  return (
    <div className="pk" id="top">
      <Preloader />
      <Rail />
      <Nav />

      <WorldTicker />

      <HeroSection />

      <Scanners />

      <Shorts />

      <Why />

      <Pricing />

      <section className="band" id="faq">
        <div className="wrap">
          <Reveal>
            <div className="sec-head is-center">
              <span className="tag">questions</span>
              <h2 className="d2">Asked often</h2>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Faq />
          </Reveal>
        </div>
      </section>

      <section className="band-tight">
        <div className="wrap">
          <Reveal>
            <div className="cta-block">
              <span className="tag">get started</span>
              <h2 className="d2">Open it tomorrow at 9:15</h2>
              <p className="lede">
                See what the market is actually doing before you take your first position of the
                day.
              </p>
              <form className="field" action="#pricing">
                <label htmlFor="cta-email" className="sr-only">
                  Work email
                </label>
                <input
                  id="cta-email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
                <button className="btn btn-pear btn-sm" type="submit">
                  Get started
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <Logo size={32} />
              <ul style={{ marginTop: 20 }}>
                <li>Kashimira, Thane, MH 401107</li>
                <li className="num">+91 79778 78134</li>
                <li>info@tradefinder.in</li>
              </ul>
            </div>

            {FOOTER.map((col) => (
              <div key={col.heading}>
                <h4>{col.heading}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? <Link href={l.href}>{l.label}</Link> : <span>{l.label}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="foot-bottom">
            <span className="micro">
              &copy; {new Date().getFullYear()} TradeFinder. All rights reserved.
            </span>
            <div className="socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <p className="micro disclaimer">{DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
}
