'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { FAQ } from './content';

const EASE = [0.22, 0.75, 0.22, 1] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const uid = useId();

  return (
    <div className="faq">
      {FAQ.map((item, i) => {
        const isOpen = i === open;
        const panelId = `${uid}-panel-${i}`;
        const buttonId = `${uid}-button-${i}`;

        return (
          <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={item.q}>
            <h3 className="faq-h">
              <button
                type="button"
                id={buttonId}
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq-mark" aria-hidden="true">
                  {isOpen ? <Minus size={17} /> : <Plus size={17} />}
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-panel"
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                >
                  <p className="faq-a">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
