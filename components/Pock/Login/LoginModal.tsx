'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!open || host) return;
    const el = document.createElement('div');
    el.className = 'pk';
    document.body.appendChild(el);
    setHost(el);
  }, [open, host]);

  useEffect(() => () => host?.remove(), [host]);

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]',
        ) ?? [],
      );

    const first = focusables().find((el) => el.tagName === 'INPUT') ?? focusables()[0];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const edge = e.shiftKey ? items[0] : items[items.length - 1];
      if (document.activeElement === edge) {
        e.preventDefault();
        (e.shiftKey ? items[items.length - 1] : items[0]).focus();
      }
    };

    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!host) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="lm-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            className="lm-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Log in to TradeFinder"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 0.75, 0.22, 1] }}
          >
            <button
              type="button"
              className="lm-close"
              onClick={onClose}
              aria-label="Close login"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="lm-brand">
              <Image
                src="/lemonn-logo.png"
                alt="Lemonn"
                width={28}
                height={28}
                className="lm-brand-mark"
              />
              <span className="lm-brand-text">Lemonn account</span>
            </div>

            <LoginForm onSuccess={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    host,
  );
}
