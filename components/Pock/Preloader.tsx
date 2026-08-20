'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const DURATION = 1500;

let playedThisRuntime = false;

export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(() => playedThisRuntime);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (playedThisRuntime) return;

    if (reduced) {
      playedThisRuntime = true;
      setDone(true);
      return;
    }

    document.body.style.overflow = 'hidden';

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 2)) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        playedThisRuntime = true;
        setDone(true);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = '';
    };
  }, [reduced]);

  useEffect(() => {
    if (done) document.body.style.overflow = '';
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="pre"
          role="status"
          aria-live="polite"
          aria-label="Loading TradeFinder"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pre-inner">
            <motion.div
              className="pre-mark"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              tradefinder
            </motion.div>

            <div className="pre-bar">
              <motion.div
                className="pre-fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: pct / 100 }}
                transition={{ duration: 0.15, ease: 'linear' }}
              />
            </div>

            <div className="pre-meta">
              <span>Loading scanners</span>
              <span className="num">{pct}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
