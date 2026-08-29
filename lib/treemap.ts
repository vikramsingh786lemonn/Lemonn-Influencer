/* Squarified treemap layout (Bruls, Huizing & van Wijk, 2000). Geometry only.
   Squarified rather than slice-and-dice, which produces slivers whose areas
   cannot be compared. */

export interface TreeItem {
  name: string;
  weight: number;
}

export interface TreeRect<T extends TreeItem> {
  item: T;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Aspect ratio of the worst tile in a candidate row — the quantity being minimised. */
function worst(areas: number[], side: number): number {
  const sum = areas.reduce((a, b) => a + b, 0);
  if (sum === 0) return Infinity;
  const max = Math.max(...areas);
  const min = Math.min(...areas);
  return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
}

export function treemap<T extends TreeItem>(items: T[], W = 100, H = 100): TreeRect<T>[] {
  const sorted = [...items].filter((i) => i.weight > 0).sort((a, b) => b.weight - a.weight);
  const total = sorted.reduce((s, i) => s + i.weight, 0);
  if (!sorted.length || total <= 0) return [];

  const queue = sorted.map((item) => ({ item, area: (item.weight / total) * W * H }));
  const out: TreeRect<T>[] = [];

  let x = 0;
  let y = 0;
  let w = W;
  let h = H;

  while (queue.length) {
    const side = Math.min(w, h);
    const row: typeof queue = [];
    let best = Infinity;

    // Grow the row while it keeps improving the worst aspect ratio.
    while (queue.length) {
      const trial = [...row, queue[0]].map((c) => c.area);
      const ratio = worst(trial, side);
      if (row.length === 0 || ratio <= best) {
        best = ratio;
        row.push(queue.shift()!);
      } else {
        break;
      }
    }

    const rowArea = row.reduce((s, r) => s + r.area, 0);

    if (w >= h) {
      // Lay the row down the left edge, then take that column off the box.
      const rw = rowArea / h;
      let cy = y;
      for (const r of row) {
        const rh = r.area / rw;
        out.push({ item: r.item, x, y: cy, w: rw, h: rh });
        cy += rh;
      }
      x += rw;
      w -= rw;
    } else {
      const rh = rowArea / w;
      let cx = x;
      for (const r of row) {
        const rw = r.area / rh;
        out.push({ item: r.item, x: cx, y, w: rw, h: rh });
        cx += rw;
      }
      y += rh;
      h -= rh;
    }
  }

  return out;
}
