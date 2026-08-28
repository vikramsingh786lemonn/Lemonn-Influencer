'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SCANNERS } from './content';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Scanners() {
  const [active, setActive] = useState(0);
  const marks = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    for (const mark of marks.current) if (mark) io.observe(mark);
    return () => io.disconnect();
  }, []);

  return (
    <section className="band pin-band" id="scanners">
      <div className="wrap">
        <div className="sec-head is-center">
          <span className="tag">the scanners</span>
          <h2 className="d2">Five modules, one live session</h2>
          <p className="lede">
            Four read the public market feed from different angles and show you what institutional
            positioning looks like as it forms; the fifth is where you log what you did and study
            the logic behind it. None of them tell you what to trade.
          </p>
        </div>
      </div>

      <div className="pin" style={{ '--steps': SCANNERS.length } as React.CSSProperties}>
        {SCANNERS.map((scanner, i) => (
          <div
            key={scanner.id}
            id={scanner.id}
            data-index={i}
            className="pin-mark"
            style={{ '--i': i } as React.CSSProperties}
            ref={(el) => {
              marks.current[i] = el;
            }}
          />
        ))}

        <div className="pin-inner">
          <div className="pin-grid">
            <ol className="pin-steps">
              {SCANNERS.map((scanner, i) => {
                const on = pinned ? i === active : true;
                return (
                  <li key={scanner.id} className={on ? 'pin-step is-on' : 'pin-step'}>
                    <span className="pin-dot num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="pin-step-text">
                      <p className="pin-name">{scanner.name}</p>
                      <h3 className="pin-title">{scanner.title}</h3>

                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            className="pin-detail"
                            initial={reduced ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.34, ease: EASE }}
                          >
                            <p className="pin-body">{scanner.body}</p>

                            <ul className="scan-chips">
                              {scanner.chips.map((chip) => (
                                <li key={chip}>{chip}</li>
                              ))}
                            </ul>

                            {/* No CTA while the scanner has no page of its
                                own — the chips above already say what it
                                does, and a button into a 404 does not. */}
                            {scanner.href && (
                              <Link className="btn btn-line btn-sm scan-cta" href={scanner.href}>
                                {scanner.cta ?? `Open ${scanner.name}`}
                                <ArrowRight size={16} aria-hidden="true" />
                              </Link>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pin-inline-shot">
                        <span className="scan-ground" aria-hidden="true" />
                        <Image
                          src={scanner.image}
                          alt={`${scanner.name} on desktop and mobile. Illustrative data.`}
                          width={1536}
                          height={1024}
                          sizes="100vw"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="pin-stage">
              {SCANNERS.map((scanner, i) => (
                <div
                  key={scanner.id}
                  className={i === active ? 'pin-shot is-on' : 'pin-shot'}
                  aria-hidden={i !== active}
                >
                  <span className="scan-ground" aria-hidden="true" />
                  <Image
                    src={scanner.image}
                    alt={`${scanner.name} on desktop and mobile. Illustrative data.`}
                    width={1536}
                    height={1024}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority={i === 0}
                  />
                </div>
              ))}

              <p className="pin-caption micro">
                Interface shown with sample data, for illustration only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
