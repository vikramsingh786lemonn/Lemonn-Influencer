'use client';

import { useCallback, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/* Writes --rx/--ry (rotation) and --mx/--my (highlight) on the hovered element
   and lets CSS do the rest. Not React state: that would re-render on every move. */
export function useTilt<T extends HTMLElement>(maxTilt = 7) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || reduced) return;
      const box = el.getBoundingClientRect();
      const px = (e.clientX - box.left) / box.width;
      const py = (e.clientY - box.top) / box.height;
      el.style.setProperty('--ry', `${(px - 0.5) * 2 * maxTilt}deg`);
      el.style.setProperty('--rx', `${(0.5 - py) * 2 * maxTilt}deg`);
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
    },
    [reduced, maxTilt],
  );

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    for (const prop of ['--rx', '--ry', '--mx', '--my']) el.style.removeProperty(prop);
  }, []);

  return { ref, onPointerMove, onPointerLeave: reset, onBlur: reset };
}
