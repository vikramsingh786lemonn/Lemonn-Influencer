export interface WorldItem {
  name: string;
  price: number;
  chg: number;
  chgPct: number;
}

export const SAMPLE: WorldItem[] = [
  { name: 'NIFTY 50', price: 24238.5, chg: 42.3, chgPct: 0.17 },
  { name: 'SENSEX', price: 79412.7, chg: 138.9, chgPct: 0.18 },
  { name: 'DAX', price: 26323.88, chg: 4.43, chgPct: 0.02 },
  { name: 'FTSE', price: 10869.5, chg: 8.0, chgPct: 0.07 },
  { name: 'S&P 500', price: 7768.8, chg: 15.1, chgPct: 0.2 },
  { name: 'DOW 30', price: 54017.0, chg: 87.0, chgPct: 0.16 },
  { name: 'NIKKEI', price: 67308, chg: 660, chgPct: 0.99 },
  { name: 'HSI', price: 25652.82, chg: -284.67, chgPct: -1.1 },
  { name: 'BTC/USD', price: 64419.18, chg: 483.89, chgPct: 0.76 },
  { name: 'GOLD', price: 2412.6, chg: -6.4, chgPct: -0.26 },
  { name: 'CRUDE', price: 78.9, chg: 0.42, chgPct: 0.53 },
  { name: 'USD/INR', price: 83.42, chg: 0.06, chgPct: 0.07 },
];

function isItem(x: unknown): x is WorldItem {
  const it = x as WorldItem | null;
  return (
    !!it &&
    typeof it.name === 'string' &&
    typeof it.price === 'number' &&
    typeof it.chg === 'number' &&
    typeof it.chgPct === 'number'
  );
}

export interface WorldFeed {
  items: WorldItem[];
  live: boolean;
}

export async function getWorld(): Promise<WorldFeed> {
  try {
    const res = await fetch('/world_ticker.json', { cache: 'no-store' });
    if (res.ok) {
      const json: unknown = await res.json();
      const items = (json as { items?: unknown[] } | null)?.items;
      if (Array.isArray(items)) {
        const clean = items.filter(isItem);
        if (clean.length) return { items: clean, live: true };
      }
    }
  } catch {
  }
  return { items: SAMPLE, live: false };
}
