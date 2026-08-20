'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Reveal } from './Motion';
import { STRATEGIES } from './content';

const ITEMS = STRATEGIES;
const N = ITEMS.length;
const COPIES = 3;
const REPEATED = Array.from({ length: COPIES }, () => ITEMS).flat();

const ID_RE = /(?:shorts\/|youtu\.be\/|v=|embed\/)([\w-]{11})/;

function embedUrl(video: string): string | null {
  const id = ID_RE.exec(video)?.[1];
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0` : null;
}

function loopSeconds(w: number) {
  if (w >= 1536) return 25;
  if (w >= 1024) return 50;
  return 60;
}

const SEEK_MS = 500;
const DRAG_THRESHOLD = 6;

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function Shorts() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const seekingRef = useRef(false);
  const draggingRef = useRef(false);
  const seekTimer = useRef<number | null>(null);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const applyActive = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
  }, []);

  const measure = useCallback(() => {
    const first = cardRefs.current[0];
    const wrapCard = cardRefs.current[N];
    const oneSet = first && wrapCard ? wrapCard.offsetLeft - first.offsetLeft : 0;
    const centres = cardRefs.current.map((c) =>
      c ? c.offsetLeft + c.offsetWidth / 2 : 0,
    );
    return { oneSet, centres };
  }, []);

  const nearestCopy = useCallback((n: number) => {
    const cur = offsetRef.current;
    let best = n;
    let bestDist = Infinity;
    for (let c = 0; c < COPIES; c++) {
      const card = cardRefs.current[n + c * N];
      if (!card) continue;
      const d = Math.abs(card.offsetLeft - cur);
      if (d < bestDist) {
        bestDist = d;
        best = n + c * N;
      }
    }
    return best;
  }, []);

  const centerCard = useCallback(
    (idx: number, smooth: boolean) => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      const card = cardRefs.current[idx];
      if (!track || !viewport || !card) return;

      const target = Math.max(
        0,
        card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2,
      );

      if (smooth) seekingRef.current = true;
      track.style.transition = smooth ? `transform ${SEEK_MS}ms ease` : 'none';
      track.style.transform = `translate3d(${-target}px,0,0)`;

      offsetRef.current = target;
      applyActive(idx);

      if (seekTimer.current) window.clearTimeout(seekTimer.current);
      if (smooth) {
        seekTimer.current = window.setTimeout(() => {
          track.style.transition = 'none';
          seekingRef.current = false;
        }, SEEK_MS + 20);
      }
    },
    [applyActive],
  );

  useIsoLayoutEffect(() => {
    const start = window.innerWidth >= 1024 ? 2 : 1;
    centerCard(start, false);

    const onResize = () => centerCard(activeRef.current, false);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (seekTimer.current) window.clearTimeout(seekTimer.current);
    };
  }, [centerCard]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        setVisible(on);
        if (on) setEntered(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || hovering || playing !== null || reduced) return;

    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    let { oneSet, centres } = measure();
    let pxPerMs = Math.max(0.024, oneSet / (loopSeconds(window.innerWidth) * 1000));
    if (oneSet <= 0) return;

    const remeasure = () => {
      ({ oneSet, centres } = measure());
      pxPerMs = Math.max(0.024, oneSet / (loopSeconds(window.innerWidth) * 1000));
    };
    window.addEventListener('resize', remeasure);

    let raf = 0;
    let prev = 0;

    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);
      if (!prev) prev = ts;

      if (seekingRef.current || draggingRef.current) {
        prev = ts;
        return;
      }

      const dt = Math.min(ts - prev, 50);
      prev = ts;

      let offset = offsetRef.current + pxPerMs * dt;

      const wrapped = offset >= oneSet;
      if (wrapped) offset -= oneSet;

      offsetRef.current = offset;
      track.style.transform = `translate3d(${-offset}px,0,0)`;

      if (wrapped) {
        track.classList.add('is-jump');
        paint();
        requestAnimationFrame(() => track.classList.remove('is-jump'));
      }
    };

    const paint = () => {
      if (seekingRef.current || draggingRef.current) return;
      const mid = offsetRef.current + viewport.clientWidth / 2;
      const falloff = viewport.clientWidth / 2 || 1;

      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < centres.length; i++) {
        const d = Math.abs(centres[i] - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
        const card = cardRefs.current[i];
        if (!card) continue;
        const p = Math.max(0, 1 - d / falloff) ** 2;
        const q = Math.round(p * 50) / 50;
        if (card.dataset.p !== String(q)) {
          card.dataset.p = String(q);
          card.style.setProperty('--p', String(q));
        }
      }
      if (best !== activeRef.current) applyActive(best);
    };

    paint();
    const tick = window.setInterval(paint, 100);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(tick);
      window.removeEventListener('resize', remeasure);
    };
  }, [visible, hovering, playing, reduced, measure, applyActive]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    const startX = e.clientX;
    const startOffset = offsetRef.current;
    const { oneSet } = measure();
    const one = oneSet > 0 ? oneSet : 1;

    const ac = new AbortController();
    const { signal } = ac;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (!draggingRef.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        draggingRef.current = true;
        seekingRef.current = false;
        track.style.transition = 'none';
      }
      const raw = startOffset - dx;
      const wrapped = ((raw % one) + one) % one;
      offsetRef.current = wrapped;
      track.style.transform = `translate3d(${-wrapped}px,0,0)`;
    };

    const up = () => {
      ac.abort();
      window.setTimeout(() => {
        draggingRef.current = false;
      }, 0);
    };

    window.addEventListener('pointermove', move, { signal });
    window.addEventListener('pointerup', up, { signal });
    window.addEventListener('pointercancel', up, { signal });
  };

  useEffect(() => {
    if (playing === null) return;

    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), iframe, a[href]',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlaying(null);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
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
  }, [playing]);

  const src = playing === null ? null : embedUrl(ITEMS[playing].video);

  return (
    <section className="band" id="strategy-shorts">
      <div className="wrap">
        <Reveal>
          <div className="sec-head is-center">
            <span className="tag">strategy shorts</span>
            <h2 className="d2">Watch how traders read it</h2>
            <p className="lede">
              Short explainers on how traders read a setup on the scanners — walkthroughs of
              the method, not buy or sell calls.
            </p>
          </div>
        </Reveal>
      </div>

      <div
        ref={viewportRef}
        className={`shorts-viewport${entered ? ' is-in' : ''}`}
        onPointerDown={onPointerDown}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div ref={trackRef} className="shorts-track">
          {REPEATED.map((item, i) => (
            <div
              key={`${item.video}-${i}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`shorts-card${i % N === active % N ? ' is-active' : ''}`}
              onClick={() => {
                if (draggingRef.current) return;
                centerCard(i, true);
              }}
            >
              <div className="shorts-media">
                <Image
                  className="shorts-thumb"
                  src={`/${item.thumb}`}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 60vw, 320px"
                  draggable={false}
                />
                <button
                  type="button"
                  className="shorts-play"
                  aria-label={`Play ${item.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (draggingRef.current) return;
                    setPlaying(i % N);
                  }}
                >
                  <Play size={26} aria-hidden="true" />
                </button>
              </div>
              <span className="shorts-title">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap">
        <div className="shorts-dots">
          {ITEMS.map((item, i) => (
            <button
              key={item.video}
              type="button"
              aria-label={`Go to ${item.name}`}
              aria-current={i === active % N ? 'true' : undefined}
              className={`shorts-dot${i === active % N ? ' is-on' : ''}`}
              onClick={() => {
                setPlaying(null);
                centerCard(nearestCopy(i), true);
              }}
            />
          ))}
        </div>
      </div>

      {src && playing !== null && (
        <div
          className="shorts-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={ITEMS[playing].name}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPlaying(null);
          }}
        >
          <div ref={dialogRef} className="shorts-modal">
            <div className="shorts-modal-bar">
              <button
                type="button"
                className="shorts-close"
                onClick={() => setPlaying(null)}
                aria-label="Close video"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="shorts-player">
              <iframe
                key={ITEMS[playing].video}
                src={src}
                title={ITEMS[playing].name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
